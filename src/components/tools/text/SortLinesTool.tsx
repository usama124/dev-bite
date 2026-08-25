"use client";

import React, { useState, useMemo } from "react";
import { sortLines, SortMode } from "@/lib/engines/text/sort-lines";
import { ToolWorkspace } from "../shared/ToolWorkspace";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CopyButton } from "../shared/CopyButton";
import { DownloadButton } from "../shared/DownloadButton";
import { ClearButton } from "../shared/ClearButton";
import { SampleButton } from "../shared/SampleButton";
import { ArrowDownAZ, ArrowUpAZ, Shuffle, ArrowUpDown } from "lucide-react";

const SAMPLE_TEXT = `item 10
item 2
apple
item 1
Zebra
banana
item 20
orange`;

export function SortLinesTool() {
  const [input, setInput] = useState(SAMPLE_TEXT);
  const [mode, setMode] = useState<SortMode>("natural");
  const [direction, setDirection] = useState<"asc" | "desc">("asc");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [deduplicate, setDeduplicate] = useState(false);
  const [shuffleSeed, setShuffleSeed] = useState(0);

  const output = useMemo(() => {
    return sortLines(input, {
      mode,
      direction,
      caseSensitive,
      deduplicate,
    });
  }, [input, mode, direction, caseSensitive, deduplicate, shuffleSeed]);

  return (
    <ToolWorkspace className="space-y-5">
      {/* Options Toolbar */}
      <div className="p-4 rounded-xl bg-muted/20 border border-border/50 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Sort Mode */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span>Sort By:</span>
              <Select
                value={mode}
                onChange={(e) => setMode(e.target.value as SortMode)}
                className="h-8 w-36 text-xs bg-background"
              >
                <option value="natural">Natural (Item 2 before 10)</option>
                <option value="alphabetical">Alphabetical (A - Z)</option>
                <option value="numeric">Numerical Value</option>
                <option value="length">Line Length (Shortest/Longest)</option>
                <option value="reverse">Reverse Order</option>
              </Select>
            </div>

            {/* Direction */}
            <div className="flex items-center gap-1">
              <Button
                variant={direction === "asc" ? "default" : "outline"}
                size="sm"
                onClick={() => setDirection("asc")}
                className="h-8 text-xs px-2.5"
                title="Ascending"
              >
                <ArrowDownAZ className="h-3.5 w-3.5 mr-1" />
                Ascending
              </Button>
              <Button
                variant={direction === "desc" ? "default" : "outline"}
                size="sm"
                onClick={() => setDirection("desc")}
                className="h-8 text-xs px-2.5"
                title="Descending"
              >
                <ArrowUpAZ className="h-3.5 w-3.5 mr-1" />
                Descending
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setMode("shuffle");
                  setShuffleSeed((s) => s + 1);
                }}
                className="h-8 text-xs px-2.5"
                title="Shuffle lines randomly"
              >
                <Shuffle className="h-3.5 w-3.5 mr-1" />
                Shuffle
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Switch
              checked={caseSensitive}
              onCheckedChange={setCaseSensitive}
              id="sort-case"
              label="Case Sensitive"
            />
            <Switch
              checked={deduplicate}
              onCheckedChange={setDeduplicate}
              id="sort-dedup"
              label="Deduplicate"
            />
          </div>
        </div>
      </div>

      {/* Editor Panes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Unsorted Lines ({input ? input.split(/\r?\n/).length : 0})
            </span>
            <div className="flex items-center gap-1">
              <SampleButton onLoadSample={() => setInput(SAMPLE_TEXT)} />
              <ClearButton onClear={() => setInput("")} disabled={!input} />
            </div>
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste multiline list to sort..."
            className="min-h-[300px] text-xs font-mono"
          />
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Sorted Result ({output ? output.split(/\r?\n/).length : 0})
            </span>
            <div className="flex items-center gap-1">
              <CopyButton textToCopy={output} label="Copy Sorted" />
              <DownloadButton
                content={output}
                filename="sorted-lines.txt"
                label="Download"
              />
            </div>
          </div>
          <Textarea
            value={output}
            readOnly
            placeholder="Sorted list appears here..."
            className="min-h-[300px] text-xs font-mono bg-muted/10"
          />
        </div>
      </div>
    </ToolWorkspace>
  );
}
