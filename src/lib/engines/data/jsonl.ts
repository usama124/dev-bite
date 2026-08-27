import { DataDiagnostic } from "./delimited";

export interface JsonlResult {
  values: unknown[];
  diagnostics: DataDiagnostic[];
}

export function parseJsonl(input: string): JsonlResult {
  const values: unknown[] = [];
  const diagnostics: DataDiagnostic[] = [];
  input.replace(/^\uFEFF/, "").split(/\r?\n/).forEach((line, index) => {
    if (!line.trim()) return;
    try { values.push(JSON.parse(line)); }
    catch (error) { diagnostics.push({ row: index + 1, message: `Line ${index + 1}: ${error instanceof Error ? error.message : "Invalid JSON value."}` }); }
  });
  return { values, diagnostics };
}

export function formatJsonl(input: string): { output: string; diagnostics: DataDiagnostic[]; count: number } {
  const parsed = parseJsonl(input);
  return { output: parsed.diagnostics.length ? "" : parsed.values.map((value) => JSON.stringify(value)).join("\n"), diagnostics: parsed.diagnostics, count: parsed.values.length };
}

export function jsonlToJson(input: string, indent = 2): { output: string; diagnostics: DataDiagnostic[]; count: number } {
  const parsed = parseJsonl(input);
  return { output: parsed.diagnostics.length ? "" : JSON.stringify(parsed.values, null, indent), diagnostics: parsed.diagnostics, count: parsed.values.length };
}

export function jsonToJsonl(input: string): { output: string; error?: string; count: number } {
  try {
    const parsed: unknown = JSON.parse(input);
    if (!Array.isArray(parsed)) return { output: "", count: 0, error: "JSON input must be an array. Each array item becomes one JSONL line." };
    return { output: parsed.map((value) => JSON.stringify(value)).join("\n"), count: parsed.length };
  } catch (error) {
    return { output: "", count: 0, error: error instanceof Error ? `Invalid JSON: ${error.message}` : "Invalid JSON input." };
  }
}
