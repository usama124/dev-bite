import { TOOL_LIMITS } from "@/config/limits";
import type { DataDiagnostic, ParseDelimitedOptions, ParseDelimitedResult } from "./delimited";

const yieldToBrowser = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

export async function parseDelimitedProgressive(input: string, options: ParseDelimitedOptions = {}, onProgress?: (value: number) => void): Promise<ParseDelimitedResult> {
  if (input.length > TOOL_LIMITS.dataMaxInputChars) throw new Error(`Input exceeds the ${(TOOL_LIMITS.dataMaxInputChars / 1_000_000).toFixed(0)} million character browser limit. Split the file into smaller chunks.`);
  const delimiter = options.delimiter ?? ",";
  if (!delimiter || delimiter.length !== 1 || delimiter === '"' || /\r|\n/.test(delimiter)) throw new Error("Delimiter must be exactly one character and cannot be a quote or line break.");
  const diagnostics: DataDiagnostic[] = []; const records: string[][] = []; let record: string[] = []; let field = ""; let quoted = false; let rowNumber = 1; const chunkSize = 100_000;
  const pushField = () => { record.push(options.trimValues ? field.trim() : field); field = ""; }; const pushRecord = () => { pushField(); records.push(record); record = []; rowNumber++; };
  for (let index = 0; index < input.length; index++) { const char = input[index];
    if (quoted) { if (char === '"') { if (input[index + 1] === '"') { field += '"'; index++; } else quoted = false; } else field += char; }
    else if (char === '"') { if (field.length > 0) diagnostics.push({ row: rowNumber, column: record.length + 1, message: "A quoted field must begin at the start of a value." }); quoted = true; }
    else if (char === delimiter) pushField(); else if (char === "\n") pushRecord(); else if (char === "\r") { if (input[index + 1] === "\n") index++; pushRecord(); } else field += char;
    if (index > 0 && index % chunkSize === 0) { onProgress?.(Math.round((index / input.length) * 100)); await yieldToBrowser(); }
  }
  if (quoted) diagnostics.push({ row: rowNumber, column: record.length + 1, message: "Quoted field is not closed." }); if (field.length > 0 || record.length > 0 || input.endsWith(delimiter)) pushRecord(); while (records.length && records.at(-1)!.every((value) => value === "")) records.pop();
  const hasHeaders = options.hasHeaders !== false; const width = records[0]?.length ?? 0; records.forEach((row, index) => { if (row.length !== width) diagnostics.push({ row: index + 1, message: `Row ${index + 1} has ${row.length} columns; expected ${width}.` }); }); const headers = hasHeaders && records.length ? records[0].map((value, index) => value || `column_${index + 1}`) : Array.from({ length: width }, (_, index) => `column_${index + 1}`); const rows = (hasHeaders ? records.slice(1) : records).map((row) => [...row, ...Array(Math.max(0, width - row.length)).fill("")].slice(0, width)); onProgress?.(100); return { table: { headers, rows, sourceRowCount: records.length }, diagnostics };
}

export async function readTextFileProgressively(file: File, onProgress?: (value: number) => void): Promise<string> {
  if (file.size > TOOL_LIMITS.dataFileMaxBytes) throw new Error(`File exceeds the ${(TOOL_LIMITS.dataFileMaxBytes / 1_000_000).toFixed(0)} MB local-processing limit. Split it before loading.`);
  const reader = file.stream().getReader(); const decoder = new TextDecoder(); const chunks: string[] = []; let loaded = 0;
  while (true) { const { done, value } = await reader.read(); if (done) break; chunks.push(decoder.decode(value, { stream: true })); loaded += value.byteLength; onProgress?.(file.size ? Math.round((loaded / file.size) * 100) : 100); }
  chunks.push(decoder.decode()); onProgress?.(100); return chunks.join("");
}
