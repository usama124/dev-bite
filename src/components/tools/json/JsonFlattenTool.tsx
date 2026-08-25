"use client";

import React, { useState, useMemo } from "react";
import { flattenJson, unflattenJson, Separator } from "@/lib/engines/json/flatten";
import { validateJson } from "@/lib/engines/json/validator";
import { ToolWorkspace } from "../shared/ToolWorkspace";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { CopyButton } from "../shared/CopyButton";
import { DownloadButton } from "../shared/DownloadButton";
import { ClearButton } from "../shared/ClearButton";
import { SampleButton } from "../shared/SampleButton";
import { ErrorMessage } from "../shared/ErrorMessage";
import { Layers, Layers2 } from "lucide-react";

const NESTED_SAMPLE = `{
  "user": {
    "profile": {
      "name": "Alice",
      "age": 30
    },
    "settings": {
      "theme": "dark",
      "notifications": true
    }
  },
  "tags": ["admin", "user"]
}`;

const FLAT_SAMPLE = `{
  "user.profile.name": "Alice",
  "user.profile.age": 30,
  "user.settings.theme": "dark",
  "user.settings.notifications": true,
  "tags.0": "admin",
  "tags.1": "user"
}`;

export function JsonFlattenTool({ mode: initialMode = "flatten" }: { mode?: "flatten" | "unflatten" }) {
  const [mode, setMode] = useState<"flatten" | "unflatten">(initialMode);
  const [input, setInput] = useState(mode === "flatten" ? NESTED_SAMPLE : FLAT_SAMPLE);
  const [separator, setSeparator] = useState<Separator>(".");
  const [indent, setIndent] = useState(2);

  const { output, error, keyCount } = useMemo(() => {
    if (!input.trim()) return { output: "", keyCount: 0 };
    const v = validateJson(input);
    if (!v.valid) return { output: "", error: v.error, keyCount: 0 };

    try {
      if (mode === "flatten") {
        const flat = flattenJson(v.parsed, separator);
        return { output: JSON.stringify(flat, null, indent), keyCount: Object.keys(flat).length };
      }
      const parsed = v.parsed as Record<string, unknown>;
      const unflat = unflattenJson(parsed, separator);
      return { output: JSON.stringify(unflat, null, indent), keyCount: 0 };
    } catch (conversionError) {
      return { output: "", error: (conversionError as Error).message, keyCount: 0 };
    }
  }, [input, mode, separator, indent]);

  return (
    <ToolWorkspace className="space-y-5">
      {/* Mode Tabs */}
      <div className="flex items-center gap-2 border-b border-border/50 pb-3">
        <button
          onClick={() => { setMode("flatten"); setInput(NESTED_SAMPLE); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${mode === "flatten" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
        >
          <Layers className="h-4 w-4" /> Flatten (Nested → Flat)
        </button>
        <button
          onClick={() => { setMode("unflatten"); setInput(FLAT_SAMPLE); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${mode === "unflatten" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
        >
          <Layers2 className="h-4 w-4" /> Unflatten (Flat → Nested)
        </button>
      </div>

      {/* Options */}
      <div className="p-3 rounded-xl bg-muted/20 border border-border/50 flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-2 text-muted-foreground">
          <span>Key separator:</span>
          <Select value={separator} onChange={(e) => setSeparator(e.target.value as Separator)} className="h-8 w-20 text-xs bg-background">
            <option value=".">. (dot)</option>
            <option value="/">/</option>
            <option value="_">_</option>
            <option value=">"> &gt;</option>
            <option value=":">:</option>
          </Select>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground ml-auto">
          <span>Indent:</span>
          {[2, 4].map((v) => (
            <button key={v} onClick={() => setIndent(v)} className={`px-2 py-1 rounded border text-xs font-mono ${v === indent ? "bg-primary text-primary-foreground border-primary" : "border-border/60 bg-muted/20 hover:bg-muted/40"}`}>{v}</button>
          ))}
        </div>
        {mode === "flatten" && keyCount > 0 && (
          <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 font-mono ml-auto">
            {keyCount} flat keys
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {mode === "flatten" ? "Nested JSON Input" : "Flat JSON Input"}
            </span>
            <div className="flex items-center gap-1">
              <SampleButton onLoadSample={() => setInput(mode === "flatten" ? NESTED_SAMPLE : FLAT_SAMPLE)} />
              <ClearButton onClear={() => setInput("")} disabled={!input} />
            </div>
          </div>
          <Textarea value={input} onChange={(e) => setInput(e.target.value)} className="min-h-[300px] text-xs font-mono" spellCheck={false} />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {mode === "flatten" ? "Flattened Output" : "Nested Output"}
            </span>
            <div className="flex items-center gap-1">
              <CopyButton textToCopy={output} label="Copy" />
              <DownloadButton content={output} filename={`${mode}d.json`} label="Download" />
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
