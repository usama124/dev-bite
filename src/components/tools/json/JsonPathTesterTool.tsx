"use client";

import React, { useMemo, useState } from "react";
import { Braces, Route } from "lucide-react";
import { testJsonPath } from "@/lib/engines/json/path-tester";
import { ToolWorkspace } from "../shared/ToolWorkspace";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { CopyButton } from "../shared/CopyButton";
import { DownloadButton } from "../shared/DownloadButton";
import { ClearButton } from "../shared/ClearButton";
import { SampleButton } from "../shared/SampleButton";
import { ErrorMessage } from "../shared/ErrorMessage";

const SAMPLE_JSON = `{
  "store": {
    "books": [
      { "title": "Clean Code", "price": 28 },
      { "title": "Refactoring", "price": 32 }
    ]
  }
}`;

const SAMPLE_PATH = "$.store.books[*].title";

export function JsonPathTesterTool() {
  const [input, setInput] = useState(SAMPLE_JSON);
  const [path, setPath] = useState(SAMPLE_PATH);
  const result = useMemo(() => testJsonPath(input, path), [input, path]);
  const output = result.success ? JSON.stringify(result.value, null, 2) : "";

  const loadSample = () => {
    setInput(SAMPLE_JSON);
    setPath(SAMPLE_PATH);
  };

  return (
    <ToolWorkspace className="space-y-5">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label htmlFor="json-path" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            JSONPath expression
          </label>
          <div className="flex items-center gap-1">
            <SampleButton onLoadSample={loadSample} />
            <ClearButton onClear={() => { setInput(""); setPath(""); }} disabled={!input && !path} />
          </div>
        </div>
        <div className="relative">
          <Route className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            id="json-path"
            value={path}
            onChange={(event) => setPath(event.target.value)}
            placeholder="$.users[*].name"
            className="pl-9 font-mono"
            spellCheck={false}
          />
        </div>
        <p className="text-[11px] text-muted-foreground">
          Supported: <code>$</code>, dot keys, bracket keys, array indexes, negative indexes, wildcards, and multi-indexes.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">JSON input</span>
          <Textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Paste JSON to query..."
            className="min-h-[340px] font-mono text-xs"
            spellCheck={false}
          />
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Matched value</span>
            <div className="flex items-center gap-1">
              <CopyButton textToCopy={output} label="Copy" />
              <DownloadButton content={output} filename="json-path-result.json" label="Download" />
            </div>
          </div>
          {result.success ? (
            <div className="min-h-[340px] rounded-xl border border-border/70 bg-muted/10 p-4">
              <div className="mb-3 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
                <Braces className="h-4 w-4" />
                <span className="font-semibold">Match found</span>
                <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 font-mono">{result.type}</span>
              </div>
              <pre className="overflow-auto whitespace-pre-wrap break-words font-mono text-xs text-foreground">{output}</pre>
            </div>
          ) : (
            <ErrorMessage title="Path Error" message={result.error ?? "No match found."} />
          )}
        </div>
      </div>
    </ToolWorkspace>
  );
}
