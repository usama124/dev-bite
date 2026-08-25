"use client";

import React, { useState, useMemo } from "react";
import { sortJsonKeys } from "@/lib/engines/json/sorter";
import { validateJson } from "@/lib/engines/json/validator";
import { ToolWorkspace } from "../shared/ToolWorkspace";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CopyButton } from "../shared/CopyButton";
import { DownloadButton } from "../shared/DownloadButton";
import { ClearButton } from "../shared/ClearButton";
import { SampleButton } from "../shared/SampleButton";
import { ErrorMessage } from "../shared/ErrorMessage";
import { ArrowDownAZ, ArrowUpAZ } from "lucide-react";

const SAMPLE = `{
  "zebra": 1,
  "apple": { "mango": 3, "banana": 2 },
  "milk": true,
  "cherry": [3, 1, 2]
}`;

export function JsonSorterTool() {
  const [input, setInput] = useState(SAMPLE);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [recursive, setRecursive] = useState(true);
  const [indent, setIndent] = useState(2);

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: "" };
    const v = validateJson(input);
    if (!v.valid) return { output: "", error: v.error };
    const sorted = sortJsonKeys(v.parsed, order, recursive);
    return { output: JSON.stringify(sorted, null, indent) };
  }, [input, order, recursive, indent]);

  return (
    <ToolWorkspace className="space-y-5">
      {/* Controls */}
      <div className="p-4 rounded-xl bg-muted/20 border border-border/50 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-1">
          <Button
            variant={order === "asc" ? "default" : "outline"}
            size="sm"
            onClick={() => setOrder("asc")}
            className="h-8 text-xs"
          >
            <ArrowDownAZ className="h-3.5 w-3.5 mr-1" /> A → Z
          </Button>
          <Button
            variant={order === "desc" ? "default" : "outline"}
            size="sm"
            onClick={() => setOrder("desc")}
            className="h-8 text-xs"
          >
            <ArrowUpAZ className="h-3.5 w-3.5 mr-1" /> Z → A
          </Button>
        </div>
        <Switch checked={recursive} onCheckedChange={setRecursive} id="sort-recursive" label="Sort nested objects recursively" />
        <div className="flex items-center gap-2 text-xs text-muted-foreground ml-auto">
          <span>Indent:</span>
          {[2, 4, "tab"].map((v) => (
            <button
              key={v}
              onClick={() => setIndent(v === "tab" ? 0 : Number(v))}
              className={`px-2 py-1 rounded border text-xs font-mono ${
                (v === "tab" ? 0 : Number(v)) === indent
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border/60 bg-muted/20 text-muted-foreground hover:bg-muted/40"
              }`}
            >
              {v === "tab" ? "Tab" : `${v}`}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">JSON Input</span>
            <div className="flex items-center gap-1">
              <SampleButton onLoadSample={() => setInput(SAMPLE)} />
              <ClearButton onClear={() => setInput("")} disabled={!input} />
            </div>
          </div>
          <Textarea value={input} onChange={(e) => setInput(e.target.value)} className="min-h-[300px] text-xs font-mono" spellCheck={false} />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sorted Output</span>
            <div className="flex items-center gap-1">
              <CopyButton textToCopy={output} label="Copy" />
              <DownloadButton content={output} filename="sorted.json" label="Download" />
            </div>
          </div>
          {error ? <ErrorMessage title="Invalid JSON" message={error} /> : (
            <Textarea value={output} readOnly className="min-h-[300px] text-xs font-mono bg-muted/10" spellCheck={false} />
          )}
        </div>
      </div>
    </ToolWorkspace>
  );
}
