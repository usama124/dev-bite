"use client";

import React from "react";
import { formatJsonl, jsonlToJson, jsonToJsonl } from "@/lib/engines/data";
import { ToolWorkspace } from "../shared/ToolWorkspace";
import { FileDropzone } from "../shared/FileDropzone";
import { CopyButton } from "../shared/CopyButton";
import { DownloadButton } from "../shared/DownloadButton";
import { ClearButton } from "../shared/ClearButton";
import { SampleButton } from "../shared/SampleButton";
import { ErrorMessage } from "../shared/ErrorMessage";
import { Textarea } from "@/components/ui/textarea";

type Mode = "format" | "jsonl-to-json" | "json-to-jsonl";
const jsonlSample = '{"id":1,"name":"Alice"}\n{"id":2,"name":"Bob"}'; const jsonSample = '[\n  { "id": 1, "name": "Alice" },\n  { "id": 2, "name": "Bob" }\n]';
export function JsonlTool({ mode }: { mode: Mode }) {
  const fromJson = mode === "json-to-jsonl"; const [input, setInput] = React.useState(fromJson ? jsonSample : jsonlSample);
  const result = React.useMemo(() => { if (!input.trim()) return { output: "", errors: [] as string[], count: 0 }; if (mode === "format") { const value = formatJsonl(input); return { output: value.output, errors: value.diagnostics.map((item) => item.message), count: value.count }; } if (mode === "jsonl-to-json") { const value = jsonlToJson(input); return { output: value.output, errors: value.diagnostics.map((item) => item.message), count: value.count }; } const value = jsonToJsonl(input); return { output: value.output, errors: value.error ? [value.error] : [], count: value.count }; }, [input, mode]);
  const outputExtension = mode === "jsonl-to-json" ? "json" : "jsonl";
  return <ToolWorkspace className="space-y-5"><div className="flex flex-wrap items-center justify-between gap-2"><span className="rounded-lg border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs font-semibold text-primary">{result.count} values</span><div className="flex flex-wrap gap-1"><FileDropzone accept=".json,.jsonl,.ndjson,.txt" onTextLoaded={(text) => setInput(text)} /><SampleButton onLoadSample={() => setInput(fromJson ? jsonSample : jsonlSample)} /><ClearButton onClear={() => setInput("")} disabled={!input} /></div></div><div className="grid gap-4 lg:grid-cols-2"><section className="space-y-2"><span className="text-xs font-semibold uppercase text-muted-foreground">{fromJson ? "JSON array" : "JSONL / NDJSON"} input</span><Textarea value={input} onChange={(event) => setInput(event.target.value)} className="min-h-[340px] font-mono text-xs" spellCheck={false} /></section><section className="space-y-2"><div className="flex justify-between gap-2"><span className="text-xs font-semibold uppercase text-muted-foreground">{outputExtension.toUpperCase()} output</span><div className="flex gap-1"><CopyButton textToCopy={result.output} /><DownloadButton content={result.output} filename={`${mode}-output.${outputExtension}`} /></div></div>{result.errors.length ? <ErrorMessage title="Line Validation Error" message={result.errors.slice(0, 10).join(" ")} /> : <pre className="min-h-[340px] overflow-auto whitespace-pre-wrap break-words rounded-xl border border-border/70 bg-muted/10 p-4 font-mono text-xs">{result.output || "Output will appear here."}</pre>}</section></div></ToolWorkspace>;
}
