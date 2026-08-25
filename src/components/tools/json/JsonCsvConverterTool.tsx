"use client";

import React, { ChangeEvent, useMemo, useState } from "react";
import { FileJson2, Table2 } from "lucide-react";
import { csvToJson, jsonToCsv } from "@/lib/engines/json/csv-converter";
import { ToolWorkspace } from "../shared/ToolWorkspace";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CopyButton } from "../shared/CopyButton";
import { DownloadButton } from "../shared/DownloadButton";
import { ClearButton } from "../shared/ClearButton";
import { SampleButton } from "../shared/SampleButton";
import { ErrorMessage } from "../shared/ErrorMessage";

const JSON_SAMPLE = `[
  { "name": "Alice", "age": 30, "team": "Platform" },
  { "name": "Bob", "age": 25, "team": "Developer Tools" }
]`;
const CSV_SAMPLE = `name,age,team
Alice,30,Platform
Bob,25,Developer Tools`;

const DELIMITERS = [
  { label: "Comma ( , )", value: "," },
  { label: "Semicolon ( ; )", value: ";" },
  { label: "Tab", value: "\t" },
  { label: "Pipe ( | )", value: "|" },
];

export function JsonCsvConverterTool({ mode }: { mode: "json-to-csv" | "csv-to-json" }) {
  const isJsonToCsv = mode === "json-to-csv";
  const sample = isJsonToCsv ? JSON_SAMPLE : CSV_SAMPLE;
  const [input, setInput] = useState(sample);
  const [delimiter, setDelimiter] = useState(",");
  const [includeHeaders, setIncludeHeaders] = useState(true);
  const [flattenNested, setFlattenNested] = useState(true);
  const [detectTypes, setDetectTypes] = useState(true);
  const [trimValues, setTrimValues] = useState(true);

  const result = useMemo(() => {
    if (!input.trim()) return { output: "", rowCount: 0, columnCount: 0 };
    if (isJsonToCsv) {
      const converted = jsonToCsv(input, { delimiter, includeHeaders, flattenNested });
      return { output: converted.csv, rowCount: converted.rowCount, columnCount: converted.columnCount, error: converted.error };
    }
    const converted = csvToJson(input, { delimiter, includeHeaders, detectTypes, trimValues, indent: 2 });
    return { output: converted.json, rowCount: converted.rowCount, columnCount: 0, error: converted.error };
  }, [delimiter, detectTypes, flattenNested, includeHeaders, input, isJsonToCsv, trimValues]);

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setInput(String(reader.result ?? ""));
    reader.readAsText(file);
    event.target.value = "";
  };

  return (
    <ToolWorkspace className="space-y-5">
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border/50 bg-muted/20 p-4">
        <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <span>Delimiter</span>
          <Select value={delimiter} onChange={(event) => setDelimiter(event.target.value)} className="h-8 w-36 text-xs">
            {DELIMITERS.map((option) => <option key={option.label} value={option.value}>{option.label}</option>)}
          </Select>
        </label>
        <Switch
          id="csv-headers"
          checked={includeHeaders}
          onCheckedChange={setIncludeHeaders}
          label={isJsonToCsv ? "Include header row" : "First row is headers"}
        />
        {isJsonToCsv ? (
          <Switch id="csv-flatten" checked={flattenNested} onCheckedChange={setFlattenNested} label="Flatten nested objects" />
        ) : (
          <>
            <Switch id="csv-types" checked={detectTypes} onCheckedChange={setDetectTypes} label="Detect value types" />
            <Switch id="csv-trim" checked={trimValues} onCheckedChange={setTrimValues} label="Trim values" />
          </>
        )}
        <span className="ml-auto rounded-lg border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs font-semibold text-primary">
          {result.rowCount} rows{isJsonToCsv && result.columnCount > 0 ? ` · ${result.columnCount} columns` : ""}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{isJsonToCsv ? "JSON input" : "CSV input"}</span>
            <div className="flex items-center gap-1">
              {!isJsonToCsv && (
                <label className="inline-flex h-9 cursor-pointer items-center rounded-lg border border-input bg-background/60 px-3 text-xs font-medium hover:bg-muted/50">
                  Upload CSV
                  <input type="file" accept=".csv,text/csv,text/plain" onChange={handleFile} className="sr-only" />
                </label>
              )}
              <SampleButton onLoadSample={() => setInput(sample)} />
              <ClearButton onClear={() => setInput("")} disabled={!input} />
            </div>
          </div>
          <Textarea value={input} onChange={(event) => setInput(event.target.value)} className="min-h-[340px] font-mono text-xs" spellCheck={false} />
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {isJsonToCsv ? <Table2 className="h-3.5 w-3.5" /> : <FileJson2 className="h-3.5 w-3.5" />}
              {isJsonToCsv ? "CSV output" : "JSON output"}
            </span>
            <div className="flex items-center gap-1">
              <CopyButton textToCopy={result.output} label="Copy" />
              <DownloadButton
                content={result.output}
                filename={isJsonToCsv ? "converted.csv" : "converted.json"}
                mimeType={isJsonToCsv ? "text/csv;charset=utf-8" : "application/json;charset=utf-8"}
                label="Download"
              />
            </div>
          </div>
          {result.error ? (
            <ErrorMessage title="Conversion Error" message={result.error} />
          ) : (
            <pre className="min-h-[340px] overflow-auto whitespace-pre-wrap break-words rounded-xl border border-border/70 bg-muted/10 p-4 font-mono text-xs text-foreground">
              {result.output || "Converted output will appear here."}
            </pre>
          )}
        </div>
      </div>
    </ToolWorkspace>
  );
}
