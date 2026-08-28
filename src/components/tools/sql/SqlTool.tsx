"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { parseDelimited, serializeDelimited, tableToJson } from "@/lib/engines/data";
import { explainSql, formatSql, generateCreateTable, generateDelete, generateInClause, generateUpdate, generateWhere, minifySql, parseInsert, quoteIdentifier, SqlDialect, SUPPORTED_SQL_DIALECTS, tableToInsert, validateSql } from "@/lib/engines/sql";
import { ClearButton } from "../shared/ClearButton";
import { CopyButton } from "../shared/CopyButton";
import { DownloadButton } from "../shared/DownloadButton";
import { ErrorMessage } from "../shared/ErrorMessage";
import { ToolWorkspace } from "../shared/ToolWorkspace";

export type SqlMode = "format" | "minify" | "validate" | "beautify" | "to-json" | "to-csv" | "to-insert" | "insert-parse" | "in-clause" | "where" | "table" | "update" | "delete" | "join" | "explain";
const sqlSample = "SELECT u.id,u.name,COUNT(o.id) AS orders FROM users u LEFT JOIN orders o ON u.id=o.user_id WHERE u.active=true GROUP BY u.id,u.name ORDER BY orders DESC;";
const tableSample = "id,name,active\n1,Alice,true\n2,Bob,false";
const samples: Partial<Record<SqlMode, string>> = { "to-json": tableSample, "to-csv": tableSample, "to-insert": tableSample, "insert-parse": "INSERT INTO users (id, name, active) VALUES (1, 'Alice', TRUE), (2, 'Bob', FALSE);", "in-clause": "apple\nbanana\norange", where: "status|=|active|AND\nage|>=|18|AND", table: "id|INTEGER|required|primary\nname|VARCHAR(120)|required|\ncreated_at|TIMESTAMP||", update: "name=Alice\nactive=true", delete: "id|=|42|AND", join: "orders|LEFT|users.id|orders.user_id" };

const parseConditions = (input: string) => input.split("\n").filter((line) => line.trim()).map((line) => { const [column, operator, value = "", connector] = line.split("|"); return { column: column?.trim(), operator: operator?.trim(), value: value.trim(), connector: connector?.trim().toUpperCase() as "AND" | "OR" | undefined }; });

export function SqlTool({ mode }: { mode: SqlMode }) {
  const [input, setInput] = React.useState(samples[mode] ?? sqlSample); const [output, setOutput] = React.useState(""); const [error, setError] = React.useState(""); const [dialect, setDialect] = React.useState<SqlDialect>("postgresql"); const [tableName, setTableName] = React.useState("users"); const [keywordCase, setKeywordCase] = React.useState<"upper" | "lower" | "preserve">("upper"); const [conditions, setConditions] = React.useState("id|=|42|AND");
  const process = () => { setError(""); try { let value = "";
    if (mode === "format" || mode === "beautify") value = formatSql(input, { keywordCase, indent: 2 });
    else if (mode === "minify") value = minifySql(input);
    else if (mode === "validate") { const result = validateSql(input, dialect); value = JSON.stringify(result, null, 2); }
    else if (mode === "to-json") { const parsed = parseDelimited(input, { hasHeaders: true }); if (parsed.diagnostics.length) throw new Error(parsed.diagnostics.map((item) => item.message).join(" ")); value = JSON.stringify(tableToJson(parsed.table, true), null, 2); }
    else if (mode === "to-csv") { const parsed = parseDelimited(input, { hasHeaders: true, delimiter: input.includes("\t") ? "\t" : "," }); if (parsed.diagnostics.length) throw new Error(parsed.diagnostics.map((item) => item.message).join(" ")); value = serializeDelimited(parsed.table); }
    else if (mode === "to-insert") { const parsed = parseDelimited(input, { hasHeaders: true }); if (parsed.diagnostics.length) throw new Error(parsed.diagnostics.map((item) => item.message).join(" ")); value = tableToInsert(parsed.table, tableName, dialect); }
    else if (mode === "insert-parse") value = JSON.stringify(parseInsert(input), null, 2);
    else if (mode === "in-clause") value = generateInClause(input.split(/[\n,]+/), "text", false, dialect);
    else if (mode === "where") value = generateWhere(parseConditions(input), dialect);
    else if (mode === "table") value = generateCreateTable(tableName, input.split("\n").filter(Boolean).map((line) => { const [name, type, required, primary] = line.split("|"); return { name, type, nullable: required !== "required", primary: primary === "primary" }; }), dialect);
    else if (mode === "update") { const assignments = input.split("\n").filter(Boolean).map((line) => { const separator = line.indexOf("="); if (separator < 1) throw new Error(`Invalid assignment: ${line}`); return { column: line.slice(0, separator).trim(), value: line.slice(separator + 1).trim() }; }); value = generateUpdate(tableName, assignments, parseConditions(conditions), dialect); }
    else if (mode === "delete") value = generateDelete(tableName, parseConditions(input), dialect);
    else if (mode === "join") { const [right, type, leftKey, rightKey] = input.trim().split("|"); if (!right || !leftKey || !rightKey) throw new Error("Use: right_table|LEFT|left.key|right.key"); const joinType = (type || "INNER").toUpperCase(); if (!new Set(["INNER", "LEFT", "RIGHT", "FULL"]).has(joinType)) throw new Error("Join type must be INNER, LEFT, RIGHT or FULL."); value = `SELECT *\nFROM ${quoteIdentifier(tableName, dialect)}\n${joinType} JOIN ${quoteIdentifier(right, dialect)} ON ${quoteIdentifier(leftKey, dialect)} = ${quoteIdentifier(rightKey, dialect)};`; }
    else value = JSON.stringify(explainSql(input, dialect), null, 2);
    setOutput(value);
  } catch (reason) { setOutput(""); setError(reason instanceof Error ? reason.message : "Unable to process SQL."); } };
  const needsTable = ["to-insert", "table", "update", "delete", "join"].includes(mode); const formatting = mode === "format" || mode === "beautify";
  return <ToolWorkspace className="space-y-5">
    <div role="note" className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-3 text-xs leading-relaxed text-violet-700 dark:text-violet-300"><strong>Dialect-aware scope:</strong> DevBite parses and generates the documented subset locally. It does not connect to a database or claim universal vendor grammar compatibility.{mode === "explain" ? " The explanation is deterministic—not AI—and is not a database execution plan." : ""}</div>
    {(mode === "delete" || mode === "update") && <div role="alert" className="rounded-xl border border-red-500/25 bg-red-500/5 p-3 text-xs text-red-700 dark:text-red-300"><strong>Destructive SQL safeguard:</strong> a structured WHERE condition is mandatory. DevBite refuses to generate an unrestricted {mode.toUpperCase()} statement.</div>}
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><label className="text-xs font-medium">Dialect<Select value={dialect} onChange={(e) => setDialect(e.target.value as SqlDialect)} className="mt-1">{SUPPORTED_SQL_DIALECTS.map((item) => <option key={item} value={item}>{item}</option>)}</Select></label>{formatting && <label className="text-xs font-medium">Keyword case<Select value={keywordCase} onChange={(e) => setKeywordCase(e.target.value as typeof keywordCase)} className="mt-1"><option value="upper">UPPERCASE</option><option value="lower">lowercase</option><option value="preserve">Preserve</option></Select></label>}{needsTable && <label className="text-xs font-medium">Base / target table<Input value={tableName} onChange={(e) => setTableName(e.target.value)} className="mt-1 font-mono" /></label>}</div>
    <div className="grid gap-4 lg:grid-cols-2"><section className="space-y-2"><span className="text-xs font-semibold uppercase text-muted-foreground">{mode === "update" ? "SET assignments (column=value)" : mode === "delete" || mode === "where" ? "Conditions (column|operator|value|AND/OR)" : "Input"}</span><Textarea value={input} onChange={(e) => setInput(e.target.value)} className="min-h-[340px] font-mono text-xs" spellCheck={false} />{mode === "update" && <label className="block text-xs font-medium">WHERE conditions (column|operator|value|AND/OR)<Textarea value={conditions} onChange={(e) => setConditions(e.target.value)} className="mt-1 min-h-28 font-mono text-xs" spellCheck={false} /></label>}</section><section className="space-y-2"><div className="flex justify-between gap-2"><span className="text-xs font-semibold uppercase text-muted-foreground">Result</span><div className="flex gap-1"><CopyButton textToCopy={output} /><DownloadButton content={output} filename={`${mode}-output.${mode === "to-json" || mode === "insert-parse" || mode === "explain" ? "json" : "sql"}`} /></div></div>{error ? <ErrorMessage title="SQL processing error" message={error} /> : <pre className="min-h-[340px] overflow-auto whitespace-pre-wrap break-words rounded-xl border border-border/70 bg-muted/10 p-4 font-mono text-xs">{output || "Choose options and process the input."}</pre>}</section></div>
    <div className="flex flex-wrap gap-2"><Button onClick={process}>Process locally</Button><ClearButton onClear={() => { setInput(""); setConditions(""); setOutput(""); setError(""); }} disabled={!input && !conditions && !output} /></div>
  </ToolWorkspace>;
}
