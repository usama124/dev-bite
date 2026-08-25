export interface CsvConvertOptions {
  delimiter?: string;
  includeHeaders?: boolean;
  flattenNested?: boolean;
  indent?: number;
  detectTypes?: boolean;
  trimValues?: boolean;
}

function assertDelimiter(delimiter: string): void {
  if (delimiter.length !== 1 || delimiter === '"' || delimiter === "\r" || delimiter === "\n") {
    throw new Error("Delimiter must be one character and cannot be a quote or line break.");
  }
}

function parseCsvRows(csv: string, delimiter: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let index = 0; index < csv.length; index++) {
    const character = csv[index];
    if (character === '"') {
      if (inQuotes && csv[index + 1] === '"') {
        field += '"';
        index++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (character === delimiter && !inQuotes) {
      row.push(field);
      field = "";
    } else if ((character === "\n" || character === "\r") && !inQuotes) {
      if (character === "\r" && csv[index + 1] === "\n") index++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }

  if (inQuotes) throw new Error("CSV contains an unclosed quoted field.");
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function flattenObject(obj: Record<string, unknown>, prefix = ""): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key of Object.keys(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    const val = obj[key];
    if (val !== null && typeof val === "object" && !Array.isArray(val)) {
      Object.assign(result, flattenObject(val as Record<string, unknown>, fullKey));
    } else {
      result[fullKey] = Array.isArray(val) ? JSON.stringify(val) : String(val ?? "");
    }
  }
  return result;
}

export function jsonToCsv(jsonStr: string, options: CsvConvertOptions = {}): {
  csv: string;
  rowCount: number;
  columnCount: number;
  error?: string;
} {
  const { delimiter = ",", includeHeaders = true, flattenNested = true } = options;

  try {
    assertDelimiter(delimiter);
    let parsed = JSON.parse(jsonStr);
    if (!Array.isArray(parsed)) {
      if (typeof parsed === "object" && parsed !== null) parsed = [parsed];
      else return { csv: "", rowCount: 0, columnCount: 0, error: "JSON must be an array or object." };
    }

    const rows: Record<string, string>[] = parsed.map((item: unknown) => {
      if (item !== null && typeof item === "object" && !Array.isArray(item)) {
        return flattenNested
          ? flattenObject(item as Record<string, unknown>)
          : Object.fromEntries(
              Object.entries(item as Record<string, unknown>).map(([k, v]) => [
                k,
                typeof v === "object" ? JSON.stringify(v) : String(v ?? ""),
              ])
            );
      }
      return { value: String(item) };
    });

    const allKeys = Array.from(new Set(rows.flatMap((r) => Object.keys(r))));

    const escape = (v: string) =>
      v.includes(delimiter) || v.includes('"') || v.includes("\n")
        ? `"${v.replace(/"/g, '""')}"`
        : v;

    const lines: string[] = [];
    if (includeHeaders) lines.push(allKeys.map(escape).join(delimiter));

    for (const row of rows) {
      lines.push(allKeys.map((k) => escape(row[k] ?? "")).join(delimiter));
    }

    return { csv: lines.join("\n"), rowCount: rows.length, columnCount: allKeys.length };
  } catch (e) {
    return { csv: "", rowCount: 0, columnCount: 0, error: (e as Error).message };
  }
}

export function csvToJson(csvStr: string, options: CsvConvertOptions = {}): {
  json: string;
  rowCount: number;
  error?: string;
} {
  const {
    delimiter = ",",
    includeHeaders = true,
    indent = 2,
    detectTypes = true,
    trimValues = true,
  } = options;

  if (!csvStr?.trim()) return { json: "[]", rowCount: 0 };

  try {
    assertDelimiter(delimiter);
    const rows = parseCsvRows(csvStr.trim(), delimiter).filter(
      (row) => row.some((field) => field.trim().length > 0)
    );
    if (rows.length === 0) return { json: "[]", rowCount: 0 };

    if (!includeHeaders) {
      return { json: JSON.stringify(rows, null, indent), rowCount: rows.length };
    }

    const headers = rows[0].map((header) => trimValues ? header.trim() : header);
    if (headers.some((header) => !header)) throw new Error("CSV header names cannot be empty.");
    if (new Set(headers).size !== headers.length) throw new Error("CSV header names must be unique.");

    const records = rows.slice(1).map((values) => {
      const record: Record<string, string | number | boolean | null> = {};
      headers.forEach((h, i) => {
        const source = values[i] ?? "";
        const raw = trimValues ? source.trim() : source;
        if (raw === "") record[h] = null;
        else if (detectTypes && raw === "true") record[h] = true;
        else if (detectTypes && raw === "false") record[h] = false;
        else if (detectTypes && !isNaN(Number(raw))) record[h] = Number(raw);
        else record[h] = raw;
      });
      return record;
    });

    return { json: JSON.stringify(records, null, indent), rowCount: records.length };
  } catch (e) {
    return { json: "", rowCount: 0, error: (e as Error).message };
  }
}
