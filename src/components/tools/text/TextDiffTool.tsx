"use client";

import React, { useState, useMemo } from "react";
import { diffLines, DiffResult } from "@/lib/engines/text/text-diff";
import { ToolWorkspace } from "../shared/ToolWorkspace";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ClearButton } from "../shared/ClearButton";
import { SampleButton } from "../shared/SampleButton";
import { GitCompare, PlusCircle, MinusCircle, Check } from "lucide-react";

const SAMPLE_A = `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}`;

const SAMPLE_B = `function calculateTotal(items) {
  // Use modern reduce function
  return items.reduce((acc, item) => {
    return acc + (item.price * item.quantity);
  }, 0);
}`;

export function TextDiffTool() {
  const [textA, setTextA] = useState(SAMPLE_A);
  const [textB, setTextB] = useState(SAMPLE_B);

  const diff: DiffResult = useMemo(() => diffLines(textA, textB), [textA, textB]);

  return (
    <ToolWorkspace className="space-y-6">
      {/* Diff Stats Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-muted/20 border border-border/50">
        <div className="flex items-center gap-3 text-xs font-semibold">
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
            <PlusCircle className="h-3.5 w-3.5" /> +{diff.additions} additions
          </span>
          <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20">
            <MinusCircle className="h-3.5 w-3.5" /> -{diff.deletions} deletions
          </span>
          <span className="text-muted-foreground">
            {diff.unchanged} unchanged lines
          </span>
        </div>

        <div className="flex items-center gap-1">
          <SampleButton
            onLoadSample={() => {
              setTextA(SAMPLE_A);
              setTextB(SAMPLE_B);
            }}
          />
          <ClearButton
            onClear={() => {
              setTextA("");
              setTextB("");
            }}
            disabled={!textA && !textB}
          />
        </div>
      </div>

      {/* Input Editors (Text A & Text B) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Original */}
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">
            Original Text (Text A)
          </span>
          <Textarea
            value={textA}
            onChange={(e) => setTextA(e.target.value)}
            placeholder="Paste original version..."
            className="min-h-[220px] text-xs font-mono"
          />
        </div>

        {/* Modified */}
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Modified Text (Text B)
          </span>
          <Textarea
            value={textB}
            onChange={(e) => setTextB(e.target.value)}
            placeholder="Paste modified version..."
            className="min-h-[220px] text-xs font-mono"
          />
        </div>
      </div>

      {/* Visual Diff Output View */}
      <div className="space-y-2 pt-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Visual Comparison Output
        </span>
        <div className="rounded-xl border border-border/80 bg-background/90 font-mono text-xs overflow-x-auto divide-y divide-border/40">
          {diff.lines.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-xs">
              Enter text in both sides above to see highlighted difference view.
            </div>
          ) : (
            diff.lines.map((line, idx) => {
              let bg = "bg-transparent text-foreground/90";
              let prefix = " ";
              let symbolClass = "text-muted-foreground/40";

              if (line.type === "added") {
                bg = "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-medium";
                prefix = "+";
                symbolClass = "text-emerald-500 font-bold";
              } else if (line.type === "removed") {
                bg = "bg-rose-500/10 text-rose-700 dark:text-rose-300 font-medium line-through opacity-80";
                prefix = "-";
                symbolClass = "text-rose-500 font-bold";
              }

              return (
                <div
                  key={idx}
                  className={`flex items-start px-3 py-1 text-xs hover:bg-muted/40 transition-colors ${bg}`}
                >
                  <span className={`w-5 select-none font-bold shrink-0 ${symbolClass}`}>
                    {prefix}
                  </span>
                  <span className="w-10 select-none text-[10px] text-muted-foreground/60 text-right pr-3 shrink-0">
                    {line.oldLineNumber || ""}
                  </span>
                  <span className="w-10 select-none text-[10px] text-muted-foreground/60 text-right pr-3 shrink-0">
                    {line.newLineNumber || ""}
                  </span>
                  <span className="whitespace-pre-wrap break-all flex-1">{line.value || " "}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </ToolWorkspace>
  );
}
