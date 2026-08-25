"use client";

import React, { useState, useMemo } from "react";
import { validateJson } from "@/lib/engines/json/validator";
import { ToolWorkspace } from "../shared/ToolWorkspace";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "../shared/CopyButton";
import { ClearButton } from "../shared/ClearButton";
import { SampleButton } from "../shared/SampleButton";
import { CheckCircle2, XCircle, AlertTriangle, MapPin } from "lucide-react";

const VALID_SAMPLE = `{
  "name": "DevBite",
  "version": "1.0.0",
  "features": ["fast", "private", "free"],
  "meta": {
    "tools": 48,
    "categories": 4
  }
}`;

const INVALID_SAMPLE = `{
  "name": "DevBite",
  "version": 1.0,
  "features": ["fast", "private", "free",],
  "active": true
}`;

export function JsonValidatorTool() {
  const [input, setInput] = useState(VALID_SAMPLE);

  const result = useMemo(() => validateJson(input), [input]);

  const lineCount = input ? input.split("\n").length : 0;
  const charCount = input.length;

  return (
    <ToolWorkspace className="space-y-5">
      {/* Status Banner */}
      {input.trim() && (
        <div
          className={`flex items-start gap-3 p-4 rounded-xl border text-sm font-medium ${
            result.valid
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
              : "bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300"
          }`}
        >
          {result.valid ? (
            <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5" />
          ) : (
            <XCircle className="h-5 w-5 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 space-y-1">
            <div className="font-semibold">
              {result.valid ? "Valid JSON ✓" : "Invalid JSON — Syntax Error Detected"}
            </div>
            {!result.valid && result.error && (
              <div className="text-xs opacity-90 font-mono">{result.error}</div>
            )}
            {!result.valid && result.line && (
              <div className="flex items-center gap-1 text-xs opacity-80">
                <MapPin className="h-3 w-3" />
                Line {result.line}, Column {result.column}
              </div>
            )}
            {result.valid && (
              <div className="text-xs opacity-80">
                Parsed type: <strong>{Array.isArray(result.parsed) ? "Array" : typeof result.parsed}</strong>
                {Array.isArray(result.parsed) && <span> ({result.parsed.length} items)</span>}
                {result.parsed !== null && typeof result.parsed === "object" && !Array.isArray(result.parsed) && (
                  <span> ({Object.keys(result.parsed as object).length} keys)</span>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Editor */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            JSON Input
          </label>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setInput(VALID_SAMPLE)}
              className="h-7 px-2.5 text-xs rounded-md border border-border/60 bg-muted/20 hover:bg-muted/40 text-muted-foreground hover:text-foreground"
            >
              Valid Sample
            </button>
            <button
              onClick={() => setInput(INVALID_SAMPLE)}
              className="h-7 px-2.5 text-xs rounded-md border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/15 text-rose-600 dark:text-rose-400"
            >
              Invalid Sample
            </button>
            <ClearButton onClear={() => setInput("")} disabled={!input} />
            <CopyButton textToCopy={input} label="Copy" />
          </div>
        </div>
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Paste JSON to validate, e.g. {"key": "value"}'
          className="min-h-[340px] text-xs font-mono"
          spellCheck={false}
        />
        <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
          <span>{lineCount} lines · {charCount} characters</span>
          {result.valid && (
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">✓ Passes validation</span>
          )}
        </div>
      </div>
    </ToolWorkspace>
  );
}
