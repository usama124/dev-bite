"use client";

import React, { useState, useMemo } from "react";
import { removeDuplicateLines } from "@/lib/engines/text/duplicate-lines";
import { ToolWorkspace } from "../shared/ToolWorkspace";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select } from "@/components/ui/select";
import { CopyButton } from "../shared/CopyButton";
import { DownloadButton } from "../shared/DownloadButton";
import { ClearButton } from "../shared/ClearButton";
import { SampleButton } from "../shared/SampleButton";
import { Layers } from "lucide-react";

const SAMPLE_TEXT = `apple
banana
orange
apple
grape
banana
orange
watermelon
apple`;

export function RemoveDuplicateLinesTool() {
  const [input, setInput] = useState(SAMPLE_TEXT);
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [trimBeforeCompare, setTrimBeforeCompare] = useState(true);
  const [preserveOccurrence, setPreserveOccurrence] = useState<"first" | "last">("first");
  const [removeEmptyLines, setRemoveEmptyLines] = useState(true);

  const result = useMemo(() => {
    return removeDuplicateLines(input, {
      caseSensitive,
      trimBeforeCompare,
      preserveOccurrence,
      removeEmptyLines,
    });
  }, [input, caseSensitive, trimBeforeCompare, preserveOccurrence, removeEmptyLines]);

  return (
    <ToolWorkspace className="space-y-5">
      {/* Options Toolbar */}
      <div className="p-4 rounded-xl bg-muted/20 border border-border/50 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4">
            <Switch
              checked={caseSensitive}
              onCheckedChange={setCaseSensitive}
              id="dup-case"
              label="Case Sensitive"
            />
            <Switch
              checked={trimBeforeCompare}
              onCheckedChange={setTrimBeforeCompare}
              id="dup-trim"
              label="Trim Whitespace"
            />
            <Switch
              checked={removeEmptyLines}
              onCheckedChange={setRemoveEmptyLines}
              id="dup-empty"
              label="Remove Empty Lines"
            />
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>Keep:</span>
              <Select
                value={preserveOccurrence}
                onChange={(e) => setPreserveOccurrence(e.target.value as "first" | "last")}
                className="h-8 w-28 text-xs bg-background"
              >
                <option value="first">First Match</option>
                <option value="last">Last Match</option>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20">
              {result.duplicateLinesCount} duplicate{result.duplicateLinesCount === 1 ? "" : "s"} removed
            </span>
          </div>
        </div>
      </div>

      {/* Editor Panes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Input Lines ({result.originalLinesCount})
            </span>
            <div className="flex items-center gap-1">
              <SampleButton onLoadSample={() => setInput(SAMPLE_TEXT)} />
              <ClearButton onClear={() => setInput("")} disabled={!input} />
            </div>
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste list with duplicate lines..."
            className="min-h-[300px] text-xs font-mono"
          />
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Unique Lines ({result.uniqueLinesCount})
            </span>
            <div className="flex items-center gap-1">
              <CopyButton textToCopy={result.output} label="Copy Unique" />
              <DownloadButton
                content={result.output}
                filename="deduplicated-lines.txt"
                label="Download"
              />
            </div>
          </div>
          <Textarea
            value={result.output}
            readOnly
            placeholder="Deduplicated lines appear here..."
            className="min-h-[300px] text-xs font-mono bg-muted/10"
          />
        </div>
      </div>
    </ToolWorkspace>
  );
}
