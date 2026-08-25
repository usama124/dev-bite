"use client";

import React, { useState, useMemo } from "react";
import { diffJson, DiffNode } from "@/lib/engines/json/diff";
import { ToolWorkspace } from "../shared/ToolWorkspace";
import { Textarea } from "@/components/ui/textarea";
import { ClearButton } from "../shared/ClearButton";
import { SampleButton } from "../shared/SampleButton";
import { PlusCircle, MinusCircle, AlertCircle, Equal } from "lucide-react";

const SAMPLE_A = `{
  "name": "Alice",
  "age": 30,
  "city": "New York",
  "roles": ["admin", "user"]
}`;

const SAMPLE_B = `{
  "name": "Alice",
  "age": 31,
  "country": "USA",
  "roles": ["admin", "moderator", "user"]
}`;

function DiffNodeView({ node, depth = 0 }: { node: DiffNode; depth?: number }) {
  const colorMap: Record<string, string> = {
    added: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/5",
    removed: "text-rose-600 dark:text-rose-400 bg-rose-500/5",
    modified: "text-amber-600 dark:text-amber-400 bg-amber-500/5",
    "type-changed": "text-orange-600 dark:text-orange-400 bg-orange-500/5",
    unchanged: "text-muted-foreground",
  };
  const iconMap: Record<string, React.ReactNode> = {
    added: <PlusCircle className="h-3 w-3 text-emerald-500 shrink-0" />,
    removed: <MinusCircle className="h-3 w-3 text-rose-500 shrink-0" />,
    modified: <AlertCircle className="h-3 w-3 text-amber-500 shrink-0" />,
    "type-changed": <AlertCircle className="h-3 w-3 text-orange-500 shrink-0" />,
    unchanged: <Equal className="h-3 w-3 text-muted-foreground/40 shrink-0" />,
  };

  return (
    <div className="font-mono text-xs" style={{ paddingLeft: depth > 0 ? "1.25rem" : 0 }}>
      <div className={`flex items-start gap-1.5 py-0.5 px-1.5 rounded ${colorMap[node.type]}`}>
        {iconMap[node.type]}
        <span>
          {node.key !== "root" && <span className="font-semibold">{node.key}: </span>}
          {!node.children && (
            <>
              {node.type === "removed" && <span className="line-through opacity-70">{JSON.stringify(node.leftValue)}</span>}
              {node.type === "added" && <span>{JSON.stringify(node.rightValue)}</span>}
              {node.type === "modified" && (
                <>
                  <span className="line-through opacity-70 mr-2">{JSON.stringify(node.leftValue)}</span>
                  <span>→ {JSON.stringify(node.rightValue)}</span>
                </>
              )}
              {node.type === "type-changed" && (
                <>
                  <span className="line-through opacity-70 mr-2">{JSON.stringify(node.leftValue)}</span>
                  <span>→ {JSON.stringify(node.rightValue)}</span>
                </>
              )}
              {node.type === "unchanged" && <span>{JSON.stringify(node.leftValue)}</span>}
            </>
          )}
        </span>
      </div>
      {node.children?.map((child, i) => (
        <DiffNodeView key={i} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}

export function JsonDiffTool() {
  const [textA, setTextA] = useState(SAMPLE_A);
  const [textB, setTextB] = useState(SAMPLE_B);

  const diff = useMemo(() => diffJson(textA, textB), [textA, textB]);

  return (
    <ToolWorkspace className="space-y-5">
      {/* Stats */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-muted/20 border border-border/50 text-xs">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20 font-semibold">
            <PlusCircle className="h-3.5 w-3.5" /> {diff.additions} added
          </span>
          <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20 font-semibold">
            <MinusCircle className="h-3.5 w-3.5" /> {diff.deletions} removed
          </span>
          <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 font-semibold">
            <AlertCircle className="h-3.5 w-3.5" /> {diff.modifications} modified
          </span>
        </div>
        <div className="flex items-center gap-1">
          <SampleButton onLoadSample={() => { setTextA(SAMPLE_A); setTextB(SAMPLE_B); }} />
          <ClearButton onClear={() => { setTextA(""); setTextB(""); }} disabled={!textA && !textB} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">Original JSON (A)</span>
          {diff.leftError && <p className="text-xs text-rose-500 font-mono">{diff.leftError}</p>}
          <Textarea value={textA} onChange={(e) => setTextA(e.target.value)} className="min-h-[220px] text-xs font-mono" spellCheck={false} />
        </div>
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Modified JSON (B)</span>
          {diff.rightError && <p className="text-xs text-rose-500 font-mono">{diff.rightError}</p>}
          <Textarea value={textB} onChange={(e) => setTextB(e.target.value)} className="min-h-[220px] text-xs font-mono" spellCheck={false} />
        </div>
      </div>

      {/* Diff View */}
      {diff.result && (
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Diff Result</span>
          <div className="p-4 rounded-xl border border-border/70 bg-background/90 overflow-auto max-h-[400px]">
            <DiffNodeView node={diff.result} />
          </div>
        </div>
      )}
    </ToolWorkspace>
  );
}
