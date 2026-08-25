"use client";

import React, { useState, useMemo } from "react";
import { joinText, splitText } from "@/lib/engines/text/joiner-splitter";
import { ToolWorkspace } from "../shared/ToolWorkspace";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CopyButton } from "../shared/CopyButton";
import { DownloadButton } from "../shared/DownloadButton";
import { ClearButton } from "../shared/ClearButton";
import { SampleButton } from "../shared/SampleButton";
import { ArrowLeftRight, Unlink, Link2 } from "lucide-react";

const SAMPLE_JOIN = `apple
banana
cherry
date
elderberry`;

const SAMPLE_SPLIT = `apple, banana, cherry, date, elderberry`;

export function TextJoinerSplitterTool() {
  const [mode, setMode] = useState<"join" | "split">("join");
  const [input, setInput] = useState(SAMPLE_JOIN);

  // Join settings
  const [joinDelimiter, setJoinDelimiter] = useState(", ");
  const [customJoinDelimiter, setCustomJoinDelimiter] = useState("");
  const [quoteWrap, setQuoteWrap] = useState<"none" | "single" | "double">("none");
  const [trimItems, setTrimItems] = useState(true);
  const [removeEmptyItems, setRemoveEmptyItems] = useState(true);

  // Split settings
  const [splitDelimiter, setSplitDelimiter] = useState(",");

  const effectiveJoinDelimiter =
    joinDelimiter === "custom" ? customJoinDelimiter : joinDelimiter;

  const output = useMemo(() => {
    if (mode === "join") {
      return joinText(input, {
        delimiter: effectiveJoinDelimiter,
        trimItems,
        removeEmptyItems,
        quoteWrap,
      });
    } else {
      return splitText(input, {
        delimiter: splitDelimiter,
        trimItems,
        removeEmptyItems,
      });
    }
  }, [
    mode,
    input,
    effectiveJoinDelimiter,
    quoteWrap,
    trimItems,
    removeEmptyItems,
    splitDelimiter,
  ]);

  return (
    <ToolWorkspace className="space-y-6">
      {/* Mode Switcher */}
      <div className="flex items-center gap-2 border-b border-border/50 pb-3">
        <button
          onClick={() => {
            setMode("join");
            setInput(SAMPLE_JOIN);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            mode === "join"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <Link2 className="h-4 w-4" />
          Join Lines into String
        </button>
        <button
          onClick={() => {
            setMode("split");
            setInput(SAMPLE_SPLIT);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            mode === "split"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <Unlink className="h-4 w-4" />
          Split String into Lines
        </button>
      </div>

      {/* Options Toolbar */}
      <div className="p-4 rounded-xl bg-muted/20 border border-border/50 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {mode === "join" ? (
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span>Delimiter:</span>
                <Select
                  value={joinDelimiter}
                  onChange={(e) => setJoinDelimiter(e.target.value)}
                  className="h-8 w-32 text-xs bg-background"
                >
                  <option value=", ">Comma &amp; Space (, )</option>
                  <option value=",">Comma (,)</option>
                  <option value="; ">Semicolon (; )</option>
                  <option value=" | ">Pipe ( | )</option>
                  <option value=" ">Space ( )</option>
                  <option value="\n">Newline (\n)</option>
                  <option value="custom">Custom Text...</option>
                </Select>
              </div>

              {joinDelimiter === "custom" && (
                <Input
                  value={customJoinDelimiter}
                  onChange={(e) => setCustomJoinDelimiter(e.target.value)}
                  placeholder="Custom delimiter..."
                  className="h-8 w-28 text-xs font-mono bg-background"
                />
              )}

              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span>Quote Wrap:</span>
                <Select
                  value={quoteWrap}
                  onChange={(e) => setQuoteWrap(e.target.value as "none" | "single" | "double")}
                  className="h-8 w-28 text-xs bg-background"
                >
                  <option value="none">None</option>
                  <option value="double">Double (&quot;...&quot;)</option>
                  <option value="single">Single (&apos;...&apos;)</option>
                </Select>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Split by delimiter:</span>
              <Input
                value={splitDelimiter}
                onChange={(e) => setSplitDelimiter(e.target.value)}
                placeholder="Delimiter (e.g. , or ; or space)"
                className="h-8 w-32 text-xs font-mono bg-background"
              />
            </div>
          )}

          <div className="flex items-center gap-4">
            <Switch
              checked={trimItems}
              onCheckedChange={setTrimItems}
              id="js-trim"
              label="Trim Items"
            />
            <Switch
              checked={removeEmptyItems}
              onCheckedChange={setRemoveEmptyItems}
              id="js-empty"
              label="Remove Empty"
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
              {mode === "join" ? "Lines to Join" : "String to Split"}
            </span>
            <div className="flex items-center gap-1">
              <SampleButton
                onLoadSample={() =>
                  setInput(mode === "join" ? SAMPLE_JOIN : SAMPLE_SPLIT)
                }
              />
              <ClearButton onClear={() => setInput("")} disabled={!input} />
            </div>
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              mode === "join"
                ? "Paste multiline items to join..."
                : "Paste delimited text to split into lines..."
            }
            className="min-h-[280px] text-xs font-mono"
          />
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {mode === "join" ? "Joined Result" : "Split Lines Result"}
            </span>
            <div className="flex items-center gap-1">
              <CopyButton textToCopy={output} label="Copy Result" />
              <DownloadButton
                content={output}
                filename={mode === "join" ? "joined-text.txt" : "split-lines.txt"}
                label="Download"
              />
            </div>
          </div>
          <Textarea
            value={output}
            readOnly
            placeholder="Result will appear here..."
            className="min-h-[280px] text-xs font-mono bg-muted/10"
          />
        </div>
      </div>
    </ToolWorkspace>
  );
}
