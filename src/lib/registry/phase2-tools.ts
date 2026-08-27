import { Tool, ToolCategory, ToolPriority } from "./types";

type P2Category = Extract<ToolCategory, "security" | "sql" | "data">;
type SeedTuple = [string, string, string, ToolPriority, string, string, string];
interface Seed { id: string; slug: string; name: string; category: P2Category; priority: ToolPriority; purpose: string; input: string; output: string }

const mapSeeds = (category: P2Category, rows: SeedTuple[]): Seed[] => rows.map(([id, slug, name, priority, purpose, input, output]) => ({ id, slug, name, category, priority, purpose, input, output }));

const security = mapSeeds("security", [
  ["S01", "password-generator", "Password Generator", "P0", "Generate cryptographically secure passwords with configurable character classes", "Length, character classes and count", "Secure password list"],
  ["S02", "password-strength-checker", "Password Strength Checker", "P0", "Analyze password strength locally and provide actionable guidance", "Password text", "Score, entropy, findings and suggestions"],
  ["S03", "hash-generator", "Hash Generator", "P0", "Generate MD5 and SHA-family hashes from text", "Text and hash algorithm", "Hexadecimal hash"],
  ["S04", "hmac-generator", "HMAC Generator", "P0", "Generate keyed HMAC signatures with browser cryptography", "Message, secret, algorithm and encoding", "HMAC signature"],
  ["S05", "hmac-validator", "HMAC Validator", "P1", "Compare an expected HMAC using constant-time byte comparison", "Message, secret, algorithm and expected HMAC", "Match status and generated HMAC"],
  ["S06", "jwt-decoder", "JWT Decoder", "P0", "Decode JWT header, payload, signature and time claims without implying verification", "Three-segment JWT", "Decoded JWT structure"],
  ["S07", "jwt-generator", "JWT Generator", "P1", "Generate signed development JWTs using an approved HMAC algorithm", "Header, payload, secret and HS algorithm", "Signed JWT"],
  ["S08", "jwt-validator", "JWT Validator", "P1", "Validate supported JWT HMAC signatures and inspect claims", "JWT, secret and expected algorithm", "Signature result and decoded claims"],
  ["S09", "fernet-key-generator", "Fernet Key Generator", "P1", "Generate Fernet-compatible URL-safe encryption keys", "Key count", "Fernet key list"],
  ["S10", "fernet-encrypt", "Fernet Encrypt", "P1", "Encrypt UTF-8 text into a standards-compatible Fernet token", "Plaintext and Fernet key", "Fernet token"],
  ["S11", "fernet-decrypt", "Fernet Decrypt", "P1", "Authenticate and decrypt a Fernet token", "Fernet token and key", "Plaintext"],
  ["S12", "aes-encrypt-decrypt", "AES Encrypt / Decrypt", "P1", "Encrypt or decrypt text with authenticated AES-GCM", "Text, key, nonce and optional associated data", "Ciphertext package or plaintext"],
  ["S13", "rsa-key-pair-generator", "RSA Key Pair Generator", "P1", "Generate RSA public/private key pairs locally", "Key size", "PEM public and private keys"],
  ["S14", "rsa-encrypt-decrypt", "RSA Encrypt / Decrypt", "P2", "Encrypt or decrypt short data using RSA-OAEP", "Text/ciphertext and PEM key", "Ciphertext or plaintext"],
  ["S15", "rsa-sign-verify", "RSA Sign / Verify", "P2", "Create and verify RSA-PSS signatures", "Message, PEM key and signature", "Signature or verification status"],
  ["S16", "secret-token-generator", "Secret / Token Generator", "P0", "Generate cryptographically secure application secrets", "Byte length, format and count", "Secure secret list"],
  ["S17", "random-bytes-generator", "Random Bytes Generator", "P1", "Generate cryptographically secure random byte representations", "Byte count and output format", "Random bytes"],
  ["S18", "checksum-generator", "Checksum Generator", "P1", "Generate CRC32, MD5 and SHA integrity checksums", "Text/file and algorithm", "Checksum"],
]);

const sql = mapSeeds("sql", [
  ["SQL01", "sql-formatter", "SQL Formatter", "P0", "Format SQL with configurable dialect, indentation and keyword casing", "SQL and formatting options", "Formatted SQL"],
  ["SQL02", "sql-minifier", "SQL Minifier", "P0", "Remove SQL comments and unnecessary whitespace while preserving quoted values", "SQL and dialect", "Minified SQL"],
  ["SQL03", "sql-validator", "SQL Validator", "P0", "Check supported SQL structure and report actionable diagnostics", "SQL and dialect", "Validation result"],
  ["SQL04", "sql-beautifier", "SQL Beautifier", "P1", "Beautify SQL through the shared formatter engine", "SQL and formatting options", "Beautified SQL"],
  ["SQL05", "sql-to-json", "SQL to JSON", "P0", "Convert delimited SQL result rows into JSON objects", "Tabular result data", "JSON array"],
  ["SQL06", "sql-to-csv", "SQL to CSV", "P0", "Normalize tabular SQL result data as CSV", "Tabular result data", "CSV"],
  ["SQL07", "sql-to-insert", "SQL to INSERT", "P0", "Generate dialect-aware INSERT statements from tabular rows", "Table name and tabular rows", "INSERT statements"],
  ["SQL08", "insert-to-sql", "INSERT to SQL", "P1", "Parse supported INSERT statements into structured table data", "INSERT SQL", "Structured JSON rows"],
  ["SQL09", "sql-in-clause-generator", "SQL IN Clause Generator", "P0", "Generate safely escaped SQL IN expressions from lists", "Value list and type", "IN expression"],
  ["SQL10", "sql-where-clause-builder", "SQL WHERE Clause Builder", "P1", "Build WHERE clauses from structured conditions", "Column/operator/value conditions", "WHERE clause"],
  ["SQL11", "sql-table-generator", "SQL Table Generator", "P1", "Generate CREATE TABLE statements from column definitions", "Table and column definitions", "CREATE TABLE SQL"],
  ["SQL12", "sql-update-generator", "SQL UPDATE Generator", "P1", "Generate UPDATE statements with an explicit condition", "Table, assignments and condition", "UPDATE SQL"],
  ["SQL13", "sql-delete-generator", "SQL DELETE Generator", "P1", "Generate DELETE statements with a visible missing-WHERE safeguard", "Table and condition", "DELETE SQL"],
  ["SQL14", "sql-join-generator", "SQL JOIN Generator", "P1", "Generate JOIN queries from table and key definitions", "Tables, join type and keys", "JOIN query"],
  ["SQL15", "sql-query-explainer", "SQL Query Explainer", "P2", "Explain supported query structure locally without AI or execution", "SQL query", "Deterministic query explanation"],
]);

const data = mapSeeds("data", [
  ["P2D01", "csv-viewer", "CSV Viewer", "P0", "Inspect CSV in a searchable, sortable and paginated table", "Pasted or uploaded CSV", "Tabular preview"],
  ["P2D02", "csv-formatter", "CSV Formatter", "P0", "Normalize delimited data with configurable quoting and line endings", "CSV or delimited text", "Normalized CSV"],
  ["P2D03", "csv-validator", "CSV Validator", "P0", "Validate CSV quoting and row structure with row diagnostics", "CSV or delimited text", "Validation diagnostics"],
  ["P2D04", "data-csv-to-json", "CSV to JSON", "P0", "Convert CSV rows into JSON objects with optional type detection", "CSV or delimited text", "JSON array"],
  ["P2D05", "data-json-to-csv", "JSON to CSV", "P0", "Convert JSON arrays into CSV with nested-field handling", "JSON array", "CSV"],
  ["P2D06", "csv-to-tsv", "CSV to TSV", "P0", "Convert comma-separated data to tab-separated data", "CSV", "TSV"],
  ["P2D07", "tsv-to-csv", "TSV to CSV", "P0", "Convert tab-separated data to comma-separated data", "TSV", "CSV"],
  ["P2D08", "csv-column-extractor", "CSV Column Extractor", "P1", "Extract selected columns from a dataset", "CSV and column names", "Selected-column CSV"],
  ["P2D09", "csv-column-remover", "CSV Column Remover", "P1", "Remove selected columns from a dataset", "CSV and column names", "Reduced CSV"],
  ["P2D10", "csv-column-renamer", "CSV Column Renamer", "P1", "Rename CSV columns without modifying source rows", "CSV and rename mapping", "Renamed CSV"],
  ["P2D11", "csv-sorter", "CSV Sorter", "P1", "Sort CSV rows by a selected column and direction", "CSV and sort column", "Sorted CSV"],
  ["P2D12", "csv-filter", "CSV Filter", "P1", "Filter CSV rows with explicit column operators", "CSV and filter condition", "Filtered CSV"],
  ["P2D13", "csv-deduplicator", "CSV Deduplicator", "P1", "Remove duplicate rows using whole-row or selected-column keys", "CSV and uniqueness columns", "Deduplicated CSV"],
  ["P2D14", "csv-merger", "CSV Merger", "P1", "Merge datasets while aligning columns by header", "Two CSV datasets", "Merged CSV"],
  ["P2D15", "csv-splitter", "CSV Splitter", "P1", "Split CSV into locally downloadable row chunks", "CSV and rows per file", "CSV chunks"],
  ["P2D16", "csv-transpose", "CSV Transpose", "P1", "Transpose rows and columns", "CSV", "Transposed CSV"],
  ["P2D17", "csv-statistics", "CSV Statistics", "P1", "Profile rows, missing values, uniqueness and numeric columns", "CSV", "Dataset statistics"],
  ["P2D18", "csv-to-markdown-table", "CSV to Markdown Table", "P1", "Convert CSV into escaped Markdown table syntax", "CSV", "Markdown table"],
  ["P2D19", "jsonl-formatter", "JSONL Formatter", "P0", "Validate and normalize JSON Lines one value per line", "JSONL / NDJSON", "Normalized JSONL"],
  ["P2D20", "jsonl-to-json", "JSONL to JSON", "P0", "Convert newline-delimited JSON into a JSON array", "JSONL / NDJSON", "JSON array"],
  ["P2D21", "json-to-jsonl", "JSON to JSONL", "P0", "Convert a JSON array into newline-delimited JSON", "JSON array", "JSONL / NDJSON"],
  ["P2D22", "delimited-text-converter", "Delimited Text Converter", "P0", "Convert between comma, tab, pipe, semicolon and custom delimiters", "Delimited text and delimiter choices", "Converted text"],
  ["P2D23", "data-cleaner", "Data Cleaner", "P0", "Trim, normalize and clean structured delimited data", "Delimited dataset", "Cleaned dataset"],
  ["P2D24", "column-row-counter", "Column / Row Counter", "P0", "Count rows, columns, empty values and duplicate structures", "Delimited dataset", "Dataset dimensions"],
]);

const seeds = [...security, ...sql, ...data];

export const PHASE2_TOOLS: Tool[] = seeds.map((seed) => {
  const siblings = seeds.filter((item) => item.category === seed.category && item.id !== seed.id);
  const siblingIndex = seeds.filter((item) => item.category === seed.category).findIndex((item) => item.id === seed.id);
  const related = [siblings[siblingIndex % siblings.length]?.id, siblings[(siblingIndex + 1) % siblings.length]?.id, seed.category === "data" ? "J01" : seed.category === "sql" ? "P2D04" : "E03"].filter((id): id is string => Boolean(id));
  return {
    id: seed.id, slug: seed.slug, name: seed.name, category: seed.category, priority: seed.priority,
    shortDescription: `${seed.purpose}.`, description: `${seed.purpose}. Processing stays in your browser and preserves the original input.`,
    keywords: [seed.name.toLowerCase(), `${seed.name.toLowerCase()} online`, `free ${seed.name.toLowerCase()}`, `${seed.category} tool`, seed.slug],
    seoTitle: `${seed.name} — Free Private Online Tool`, seoDescription: `Use DevBite's free ${seed.name.toLowerCase()} to ${seed.purpose.toLowerCase()}. Private, client-side, responsive and available without installation.`,
    inputLabel: seed.input, outputLabel: seed.output, supportsCopy: true, supportsDownload: true, supportsClear: true, supportsSample: true,
    downloadFilename: `${seed.slug}-output.txt`, clientSide: true, relatedToolIds: [...new Set(related)].slice(0, 4),
    faqs: [
      { question: `Does the ${seed.name} upload my input?`, answer: `No. The ${seed.name} processes input locally in your browser and does not send it to a DevBite backend.` },
      { question: `What does the ${seed.name} produce?`, answer: `${seed.output}. Invalid or unsupported input is reported without replacing the original content.` },
      { question: `Does the ${seed.name} work on mobile?`, answer: "Yes. Its controls and result layout adapt to mobile, tablet and desktop screens." },
    ],
    examples: [{ title: "Example", input: seed.input, output: seed.output }], features: ["Browser-only processing", "Human-readable validation", "Responsive workspace", "Copy and download output"],
    howToUse: [`Enter ${seed.input.toLowerCase()}.`, "Choose the required options.", `Review the ${seed.output.toLowerCase()} and diagnostics.`, "Copy or download the result when needed."], status: "active",
  };
});
