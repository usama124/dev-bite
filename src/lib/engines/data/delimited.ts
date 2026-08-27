export interface DataDiagnostic {
  row: number;
  column?: number;
  message: string;
}

export interface DataTable {
  headers: string[];
  rows: string[][];
  sourceRowCount: number;
}

export interface ParseDelimitedOptions {
  delimiter?: string;
  hasHeaders?: boolean;
  trimValues?: boolean;
}

export interface ParseDelimitedResult {
  table: DataTable;
  diagnostics: DataDiagnostic[];
}

function validDelimiter(delimiter: string): void {
  if (!delimiter || delimiter.length !== 1 || delimiter === '"' || /\r|\n/.test(delimiter)) {
    throw new Error("Delimiter must be exactly one character and cannot be a quote or line break.");
  }
}

export function parseDelimited(input: string, options: ParseDelimitedOptions = {}): ParseDelimitedResult {
  const delimiter = options.delimiter ?? ",";
  validDelimiter(delimiter);
  const diagnostics: DataDiagnostic[] = [];
  const records: string[][] = [];
  let record: string[] = [];
  let field = "";
  let quoted = false;
  let rowNumber = 1;

  const pushField = () => { record.push(options.trimValues ? field.trim() : field); field = ""; };
  const pushRecord = () => { pushField(); records.push(record); record = []; rowNumber++; };

  for (let index = 0; index < input.length; index++) {
    const char = input[index];
    if (quoted) {
      if (char === '"') {
        if (input[index + 1] === '"') { field += '"'; index++; }
        else quoted = false;
      } else field += char;
      continue;
    }
    if (char === '"') {
      if (field.length > 0) diagnostics.push({ row: rowNumber, column: record.length + 1, message: "A quoted field must begin at the start of a value." });
      quoted = true;
    } else if (char === delimiter) pushField();
    else if (char === "\n") pushRecord();
    else if (char === "\r") {
      if (input[index + 1] === "\n") index++;
      pushRecord();
    } else field += char;
  }
  if (quoted) diagnostics.push({ row: rowNumber, column: record.length + 1, message: "Quoted field is not closed." });
  if (field.length > 0 || record.length > 0 || input.endsWith(delimiter)) pushRecord();
  while (records.length && records[records.length - 1].every((value) => value === "")) records.pop();

  const hasHeaders = options.hasHeaders !== false;
  const width = records[0]?.length ?? 0;
  records.forEach((row, index) => {
    if (row.length !== width) diagnostics.push({ row: index + 1, message: `Row ${index + 1} has ${row.length} columns; expected ${width}.` });
  });
  const headers = hasHeaders && records.length
    ? records[0].map((value, index) => value || `column_${index + 1}`)
    : Array.from({ length: width }, (_, index) => `column_${index + 1}`);
  const rows = (hasHeaders ? records.slice(1) : records).map((row) => [
    ...row,
    ...Array(Math.max(0, width - row.length)).fill(""),
  ].slice(0, width));
  return { table: { headers, rows, sourceRowCount: records.length }, diagnostics };
}

export interface SerializeDelimitedOptions {
  delimiter?: string;
  quote?: string;
  lineEnding?: "lf" | "crlf";
  includeHeaders?: boolean;
  quoteAll?: boolean;
}

export function serializeDelimited(table: DataTable, options: SerializeDelimitedOptions = {}): string {
  const delimiter = options.delimiter ?? ",";
  validDelimiter(delimiter);
  const quote = options.quote ?? '"';
  if (quote.length !== 1) throw new Error("Quote character must be exactly one character.");
  const lineEnding = options.lineEnding === "crlf" ? "\r\n" : "\n";
  const encode = (value: string) => {
    const escaped = value.replaceAll(quote, quote + quote);
    return options.quoteAll || value.includes(delimiter) || value.includes(quote) || /\r|\n/.test(value)
      ? `${quote}${escaped}${quote}` : escaped;
  };
  const records = options.includeHeaders === false ? table.rows : [table.headers, ...table.rows];
  return records.map((row) => row.map((value) => encode(String(value ?? ""))).join(delimiter)).join(lineEnding);
}

export function detectValue(value: string): string | number | boolean | null {
  const trimmed = value.trim();
  if (trimmed === "") return null;
  if (/^-?(?:\d+|\d*\.\d+)$/.test(trimmed) && Number.isFinite(Number(trimmed))) return Number(trimmed);
  if (/^(true|false)$/i.test(trimmed)) return trimmed.toLowerCase() === "true";
  if (/^null$/i.test(trimmed)) return null;
  return value;
}

export function tableToJson(table: DataTable, detectTypes = true, objectOutput = true): unknown[] {
  return table.rows.map((row) => {
    const values = row.map((value) => detectTypes ? detectValue(value) : value);
    return objectOutput ? Object.fromEntries(table.headers.map((header, index) => [header, values[index] ?? null])) : values;
  });
}

function flattenRecord(value: Record<string, unknown>, prefix = "", output: Record<string, unknown> = {}): Record<string, unknown> {
  Object.entries(value).forEach(([key, item]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (item && typeof item === "object" && !Array.isArray(item)) flattenRecord(item as Record<string, unknown>, path, output);
    else output[path] = Array.isArray(item) ? JSON.stringify(item) : item;
  });
  return output;
}

export function jsonToTable(input: string, flattenNested = true): DataTable {
  const parsed: unknown = JSON.parse(input);
  if (!Array.isArray(parsed)) throw new Error("JSON input must be an array of objects or values.");
  const records: Record<string, unknown>[] = parsed.map((item) => {
    if (item && typeof item === "object" && !Array.isArray(item)) return flattenNested ? flattenRecord(item as Record<string, unknown>) : item as Record<string, unknown>;
    return { value: item };
  });
  const headers = Array.from(new Set(records.flatMap((record) => Object.keys(record))));
  const rows = records.map((record) => headers.map((header) => {
    const value = record[header];
    if (value === null || value === undefined) return "";
    return typeof value === "object" ? JSON.stringify(value) : String(value);
  }));
  return { headers, rows, sourceRowCount: rows.length };
}
