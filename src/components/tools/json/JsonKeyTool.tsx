"use client";

import React, { useMemo, useState } from "react";
import { KeyRound, ShieldCheck } from "lucide-react";
import { extractJsonKeyPaths, removeJsonKeys } from "@/lib/engines/json/key-tools";
import { ToolWorkspace } from "../shared/ToolWorkspace";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { CopyButton } from "../shared/CopyButton";
import { DownloadButton } from "../shared/DownloadButton";
import { ClearButton } from "../shared/ClearButton";
import { SampleButton } from "../shared/SampleButton";
import { ErrorMessage } from "../shared/ErrorMessage";

const SAMPLE = `{
  "id": 101,
  "user": {
    "name": "Alice",
    "email": "alice@example.com",
    "password": "secret"
  },
  "token": "private-token"
}`;

export function JsonKeyTool({ mode }: { mode: "extract" | "remove" }) {
  const [input, setInput] = useState(SAMPLE);
  const [keyInput, setKeyInput] = useState("password, token");
  const [recursive, setRecursive] = useState(true);
  const [unique, setUnique] = useState(true);
  const [includePaths, setIncludePaths] = useState(true);

  const result = useMemo(() => {
    if (!input.trim()) return { output: "", count: 0 };

    if (mode === "extract") {
      const extracted = extractJsonKeyPaths(input, { recursive, unique, includePaths });
      return {
        output: extracted.keys.join("\n"),
        count: extracted.keys.length,
        error: extracted.error,
      };
    }

    const keys = keyInput.split(/[\n,]+/).map((key) => key.trim()).filter(Boolean);
    if (keys.length === 0) return { output: "", count: 0, error: "Enter at least one exact key to remove." };
    const removed = removeJsonKeys(input, keys, recursive);
    return {
      output: removed.error ? "" : JSON.stringify(removed.output, null, 2),
      count: removed.operatedCount,
      error: removed.error,
    };
  }, [includePaths, input, keyInput, mode, recursive, unique]);

  return (
    <ToolWorkspace className="space-y-5">
      <div className="rounded-xl border border-border/50 bg-muted/20 p-4">
        {mode === "remove" && (
          <div className="mb-4 space-y-2">
            <label htmlFor="keys-to-remove" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Exact keys to remove
            </label>
            <Input
              id="keys-to-remove"
              value={keyInput}
              onChange={(event) => setKeyInput(event.target.value)}
              placeholder="password, token, secret"
              className="font-mono"
            />
            <p className="text-[11px] text-muted-foreground">Separate multiple keys with commas or new lines. Only exact key names are matched.</p>
          </div>
        )}
        <div className="flex flex-wrap items-center gap-4">
          <Switch id="key-recursive" checked={recursive} onCheckedChange={setRecursive} label="Include nested objects" />
          {mode === "extract" && (
            <>
              <Switch id="key-paths" checked={includePaths} onCheckedChange={setIncludePaths} label="Show full paths" />
              <Switch id="key-unique" checked={unique} onCheckedChange={setUnique} label="Unique results" />
            </>
          )}
          <span className="ml-auto rounded-lg border border-primary/20 bg-primary/5 px-2.5 py-1 text-xs font-semibold text-primary">
            {result.count} {mode === "extract" ? "keys found" : "keys removed"}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">JSON input</span>
            <div className="flex items-center gap-1">
              <SampleButton onLoadSample={() => setInput(SAMPLE)} />
              <ClearButton onClear={() => setInput("")} disabled={!input} />
            </div>
          </div>
          <Textarea value={input} onChange={(event) => setInput(event.target.value)} className="min-h-[340px] font-mono text-xs" spellCheck={false} />
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {mode === "extract" ? <KeyRound className="h-3.5 w-3.5" /> : <ShieldCheck className="h-3.5 w-3.5" />}
              {mode === "extract" ? "Key paths" : "Sanitized JSON"}
            </span>
            <div className="flex items-center gap-1">
              <CopyButton textToCopy={result.output} label="Copy" />
              <DownloadButton content={result.output} filename={mode === "extract" ? "json-keys.txt" : "sanitized.json"} label="Download" />
            </div>
          </div>
          {result.error ? (
            <ErrorMessage message={result.error} />
          ) : (
            <pre className="min-h-[340px] overflow-auto whitespace-pre-wrap break-words rounded-xl border border-border/70 bg-muted/10 p-4 font-mono text-xs text-foreground">
              {result.output || "Results will appear here."}
            </pre>
          )}
        </div>
      </div>
    </ToolWorkspace>
  );
}
