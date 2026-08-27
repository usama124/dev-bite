"use client";

import React from "react";
import { parseDelimited } from "@/lib/engines/data";
import { ToolWorkspace } from "../shared/ToolWorkspace";
import { FileDropzone } from "../shared/FileDropzone";
import { DataGrid } from "../shared/DataGrid";
import { ErrorMessage } from "../shared/ErrorMessage";
import { ClearButton } from "../shared/ClearButton";
import { SampleButton } from "../shared/SampleButton";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

const sample = "name,age,team\nAlice,30,Platform\nBob,25,Developer Tools\nCarol,34,Data";
export function CsvViewerTool() {
  const [input, setInput] = React.useState(sample); const [delimiter, setDelimiter] = React.useState(","); const [search, setSearch] = React.useState("");
  const result = React.useMemo(() => { try { return parseDelimited(input, { delimiter, hasHeaders: true }); } catch (error) { return { table: { headers: [], rows: [], sourceRowCount: 0 }, diagnostics: [{ row: 1, message: error instanceof Error ? error.message : "Unable to parse data." }] }; } }, [delimiter, input]);
  return <ToolWorkspace className="space-y-5"><div className="flex flex-wrap items-center gap-2"><label className="text-xs font-medium">Delimiter <Select value={delimiter} onChange={(event) => setDelimiter(event.target.value)} className="ml-2 h-8 w-32 text-xs"><option value=",">Comma</option><option value="\t">Tab</option><option value=";">Semicolon</option><option value="|">Pipe</option></Select></label><FileDropzone accept=".csv,.tsv,.txt,text/csv,text/plain" onTextLoaded={(text) => setInput(text)} /><div className="ml-auto flex gap-1"><SampleButton onLoadSample={() => setInput(sample)} /><ClearButton onClear={() => setInput("")} disabled={!input} /></div></div><Textarea value={input} onChange={(event) => setInput(event.target.value)} className="min-h-44 font-mono text-xs" spellCheck={false} placeholder="Paste CSV or upload a local file" />{result.diagnostics.length ? <ErrorMessage title="CSV Diagnostics" message={result.diagnostics.slice(0, 5).map((item) => item.message).join(" ")} /> : <><div className="flex flex-wrap items-center justify-between gap-2"><div className="text-xs text-muted-foreground"><strong className="text-foreground">{result.table.rows.length}</strong> rows · <strong className="text-foreground">{result.table.headers.length}</strong> columns</div><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search table..." className="h-9 w-full sm:w-64" /></div><DataGrid table={result.table} search={search} /></>}</ToolWorkspace>;
}
