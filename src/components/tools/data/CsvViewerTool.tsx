"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TOOL_LIMITS } from "@/config/limits";
import { DataDiagnostic, DataTable, parseDelimitedProgressive } from "@/lib/engines/data";
import { ClearButton } from "../shared/ClearButton";
import { DataGrid } from "../shared/DataGrid";
import { ErrorMessage } from "../shared/ErrorMessage";
import { FileDropzone } from "../shared/FileDropzone";
import { SampleButton } from "../shared/SampleButton";
import { ToolWorkspace } from "../shared/ToolWorkspace";

const sample = "name,age,team\nAlice,30,Platform\nBob,25,Developer Tools\nCarol,34,Data";
const emptyTable: DataTable = { headers: [], rows: [], sourceRowCount: 0 };
export function CsvViewerTool() {
  const [input, setInput] = React.useState(sample); const [preset, setPreset] = React.useState(","); const [customDelimiter, setCustomDelimiter] = React.useState("^"); const delimiter = preset === "custom" ? customDelimiter : preset; const [search, setSearch] = React.useState(""); const [table, setTable] = React.useState<DataTable>(emptyTable); const [diagnostics, setDiagnostics] = React.useState<DataDiagnostic[]>([]); const [progress, setProgress] = React.useState<number | null>(null);
  React.useEffect(() => { let active = true; const timer = setTimeout(() => { setProgress(0); parseDelimitedProgressive(input, { delimiter, hasHeaders: true }, (value) => { if (active) setProgress(value); }).then((result) => { if (active) { setTable(result.table); setDiagnostics(result.diagnostics); } }).catch((reason) => { if (active) { setTable(emptyTable); setDiagnostics([{ row: 1, message: reason instanceof Error ? reason.message : "Unable to parse data." }]); } }).finally(() => { if (active) setProgress(null); }); }, input.length > TOOL_LIMITS.dataProgressiveThresholdChars ? 50 : 150); return () => { active = false; clearTimeout(timer); }; }, [delimiter, input]);
  return <ToolWorkspace className="space-y-5"><div role="note" className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-3 text-xs text-cyan-700 dark:text-cyan-300">Large local files are streamed into the page, parsed in yielding chunks, and rendered 25 rows at a time to keep the interface responsive.</div><div className="flex flex-wrap items-end gap-2"><label className="text-xs font-medium">Delimiter<Select value={preset} onChange={(event) => setPreset(event.target.value)} className="mt-1 w-32 text-xs"><option value=",">Comma</option><option value="\t">Tab</option><option value=";">Semicolon</option><option value="|">Pipe</option><option value="custom">Custom</option></Select></label>{preset === "custom" && <label className="text-xs font-medium">Custom delimiter<Input value={customDelimiter} maxLength={1} onChange={(event) => setCustomDelimiter(event.target.value)} className="mt-1 w-20 font-mono" /></label>}<FileDropzone accept=".csv,.tsv,.txt,text/csv,text/plain" onTextLoaded={(text) => setInput(text)} onError={(message) => setDiagnostics([{ row: 1, message }])} /><div className="ml-auto flex gap-1"><SampleButton onLoadSample={() => setInput(sample)} /><ClearButton onClear={() => setInput("")} disabled={!input} /></div></div><Textarea value={input} onChange={(event) => setInput(event.target.value)} className="min-h-44 font-mono text-xs" spellCheck={false} placeholder="Paste CSV or upload a local file" />{progress !== null && <p role="status" className="text-xs text-muted-foreground">Parsing locally: {progress}%</p>}{diagnostics.length ? <ErrorMessage title="CSV Diagnostics" message={diagnostics.slice(0, 5).map((item) => item.message).join(" ")} /> : <><div className="flex flex-wrap items-center justify-between gap-2"><div className="text-xs text-muted-foreground"><strong className="text-foreground">{table.rows.length}</strong> rows · <strong className="text-foreground">{table.headers.length}</strong> columns</div><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search table..." className="h-9 w-full sm:w-64" /></div><DataGrid table={table} search={search} /></>}</ToolWorkspace>;
}
