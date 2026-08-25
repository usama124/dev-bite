export interface KeyOperationResult {
  output: unknown;
  operatedCount: number;
  error?: string;
}

export interface KeyPathOptions {
  recursive?: boolean;
  unique?: boolean;
  includePaths?: boolean;
}

export function extractJsonKeyPaths(
  jsonStr: string,
  options: KeyPathOptions = {}
): { keys: string[]; error?: string } {
  const { recursive = true, unique = true, includePaths = true } = options;

  try {
    const parsed: unknown = JSON.parse(jsonStr);
    const keys: string[] = [];

    const visit = (value: unknown, prefix = "") => {
      if (Array.isArray(value)) {
        if (recursive) value.forEach((item, index) => visit(item, `${prefix}[${index}]`));
        return;
      }
      if (value === null || typeof value !== "object") return;

      for (const [key, child] of Object.entries(value as Record<string, unknown>)) {
        const path = prefix ? `${prefix}.${key}` : key;
        keys.push(includePaths ? path : key);
        if (recursive) visit(child, path);
      }
    };

    visit(parsed);
    return { keys: unique ? Array.from(new Set(keys)) : keys };
  } catch (error) {
    return { keys: [], error: (error as Error).message };
  }
}

function extractKeys(obj: unknown, keys: string[], recursive: boolean): unknown {
  if (Array.isArray(obj)) {
    return obj.map((item) => extractKeys(item, keys, recursive));
  }
  if (obj !== null && typeof obj === "object") {
    const record = obj as Record<string, unknown>;
    const result: Record<string, unknown> = {};
    for (const k of keys) {
      if (k in record) {
        result[k] = recursive && record[k] !== null && typeof record[k] === "object"
          ? extractKeys(record[k], keys, recursive)
          : record[k];
      }
    }
    return result;
  }
  return obj;
}

function removeKeys(obj: unknown, keys: string[], recursive: boolean, count = { n: 0 }): unknown {
  if (Array.isArray(obj)) {
    return obj.map((item) => removeKeys(item, keys, recursive, count));
  }
  if (obj !== null && typeof obj === "object") {
    const record = obj as Record<string, unknown>;
    const result: Record<string, unknown> = {};
    for (const k of Object.keys(record)) {
      if (keys.includes(k)) {
        count.n++;
      } else {
        result[k] = recursive && record[k] !== null && typeof record[k] === "object"
          ? removeKeys(record[k], keys, recursive, count)
          : record[k];
      }
    }
    return result;
  }
  return obj;
}

export function extractJsonKeys(jsonStr: string, keys: string[], recursive = true): KeyOperationResult {
  try {
    const parsed = JSON.parse(jsonStr);
    const output = extractKeys(parsed, keys, recursive);
    return { output, operatedCount: keys.length };
  } catch (e) {
    return { output: null, operatedCount: 0, error: (e as Error).message };
  }
}

export function removeJsonKeys(jsonStr: string, keys: string[], recursive = true): KeyOperationResult {
  try {
    const parsed = JSON.parse(jsonStr);
    const count = { n: 0 };
    const output = removeKeys(parsed, keys, recursive, count);
    return { output, operatedCount: count.n };
  } catch (e) {
    return { output: null, operatedCount: 0, error: (e as Error).message };
  }
}
