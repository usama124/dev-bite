"use client";

import React, { useState, useEffect, useTransition } from "react";
import { formatJson, JsonFormatResult } from "@/lib/engines/json/formatter";
import { ToolWorkspace } from "../shared/ToolWorkspace";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CopyButton } from "../shared/CopyButton";
import { DownloadButton } from "../shared/DownloadButton";
import { ClearButton } from "../shared/ClearButton";
import { SampleButton } from "../shared/SampleButton";
import { ErrorMessage } from "../shared/ErrorMessage";
import { formatBytes } from "@/lib/utils";
import { CheckCircle2, Minimize2, Sparkles, Wand2 } from "lucide-react";

const SAMPLE_JSON = `{
  "platform": "DevBite",
  "version": 1.0,
  "category": "developer-utilities",
  "privacy": {
    "localProcessing": true,
    "serverUploads": false,
    "telemetry": "none"
  },
  "features": [
    "100% Client-Side Processing",
    "Real-time Validation",
    "Zero Latency",
    "Keyboard Accessible"
  ],
  "activeToolsCount": 48
}`;

export function JsonFormatterTool() {
  const [input, setInput] = useState(SAMPLE_JSON);
  const [output, setOutput] = useState("");
  const [indent, setIndent] = useState<number | "tab">(2);
  const [sortKeys, setSortKeys] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [result, setResult] = useState<JsonFormatResult | null>(null);
  const [, startTransition] = useTransition();

  const handleFormat = (compactMode = isCompact) => {
    startTransition(() => {
      const res = formatJson(input, {
        indent,
        sortKeys,
        compact: compactMode,
      });
      setResult(res);
      if (res.success) {
        setOutput(res.output);
      }
    });
  };

  useEffect(() => {
    if (input.trim()) {
      handleFormat();
    } else {
      setOutput("");
      setResult(null);
    }
  }, [input, indent, sortKeys, isCompact]);

  const handleMinify = () => {
    setIsCompact(true);
    handleFormat(true);
  };

  const handleBeautify = () => {
    setIsCompact(false);
    handleFormat(false);
  };

  return (
    <ToolWorkspace className="space-y-5">
      {/* Controls and Options Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-muted/20 border border-border/50">
        <div className="flex flex-wrap items-center gap-3">
          {/* Indent Selector */}
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <span>Indent:</span>
            <Select
              value={String(indent)}
              onChange={(e) => {
                const val = e.target.value;
                setIndent(val === "tab" ? "tab" : parseInt(val, 10));
                setIsCompact(false);
              }}
              className="h-8 w-28 text-xs bg-background"
            >
              <option value="2">2 Spaces</option>
              <option value="4">4 Spaces</option>
              <option value="3">3 Spaces</option>
              <option value="tab">1 Tab</option>
            </Select>
          </div>

          {/* Sort Keys Alphabetically */}
          <Switch
            checked={sortKeys}
            onCheckedChange={setSortKeys}
            id="sort-keys"
            label="Sort Keys A-Z"
          />
        </div>

        {/* Quick Format & Minify Buttons */}
        <div className="flex items-center gap-1.5">
          <Button
            variant={!isCompact ? "default" : "outline"}
            size="sm"
            onClick={handleBeautify}
            className="h-8 text-xs"
          >
            <Wand2 className="h-3.5 w-3.5 mr-1" />
            Format
          </Button>
          <Button
            variant={isCompact ? "default" : "outline"}
            size="sm"
            onClick={handleMinify}
            className="h-8 text-xs"
          >
            <Minimize2 className="h-3.5 w-3.5 mr-1" />
            Minify
          </Button>
        </div>
      </div>

      {/* Error banner if invalid JSON */}
      {result && !result.success && result.error && (
        <ErrorMessage
          title="Invalid JSON Format"
          message={result.error.message}
          line={result.error.line}
          column={result.error.column}
          snippet={result.error.snippet}
          hint={result.error.hint}
        />
      )}

      {/* Editor Panes: Input & Formatted Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input Column */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Input JSON
            </span>
            <div className="flex items-center gap-1">
              <SampleButton onLoadSample={() => setInput(SAMPLE_JSON)} />
              <ClearButton onClear={() => setInput("")} disabled={!input} />
            </div>
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your JSON here..."
            className="min-h-[360px] text-xs font-mono"
            spellCheck={false}
          />
          <div className="text-[11px] text-muted-foreground font-mono px-1">
            Input Size: {formatBytes(result?.originalSizeBytes || 0)}
          </div>
        </div>

        {/* Output Column */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Formatted Output
              </span>
              {result?.success && output && (
                <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="h-3 w-3" /> Valid JSON
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <CopyButton textToCopy={output} label="Copy JSON" />
              <DownloadButton
                content={output}
                filename="formatted.json"
                mimeType="application/json"
                label="Download"
              />
            </div>
          </div>
          <Textarea
            value={output}
            readOnly
            placeholder="Formatted JSON will appear here automatically..."
            className="min-h-[360px] text-xs font-mono bg-muted/10"
            spellCheck={false}
          />
          <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono px-1">
            <span>Lines: {result?.lineCount || 0}</span>
            <span>Output Size: {formatBytes(result?.sizeBytes || 0)}</span>
          </div>
        </div>
      </div>
    </ToolWorkspace>
  );
}
