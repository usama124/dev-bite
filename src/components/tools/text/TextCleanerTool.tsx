"use client";

import React, { useState, useMemo } from "react";
import { cleanText } from "@/lib/engines/text/text-cleaner";
import { ToolWorkspace } from "../shared/ToolWorkspace";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { CopyButton } from "../shared/CopyButton";
import { DownloadButton } from "../shared/DownloadButton";
import { ClearButton } from "../shared/ClearButton";
import { SampleButton } from "../shared/SampleButton";
import { Wand2 } from "lucide-react";

const SAMPLE_TEXT = `<div class="article">
  <h1>&ldquo;DevBite&rdquo; Text Cleaner &mdash; Fast &amp; Reliable</h1>
  <p>Pasted content often includes &lsquo;smart quotes&rsquo;, non-breaking spaces&nbsp;and <b>HTML markup</b>! 🚀</p>
  
  
  <p>This pipeline cleans everything in one deterministic pass.</p>
</div>`;

export function TextCleanerTool() {
  const [input, setInput] = useState(SAMPLE_TEXT);
  const [stripHtml, setStripHtml] = useState(true);
  const [convertSmartQuotes, setConvertSmartQuotes] = useState(true);
  const [removeNonPrintable, setRemoveNonPrintable] = useState(true);
  const [stripEmojis, setStripEmojis] = useState(false);
  const [collapseBlankLines, setCollapseBlankLines] = useState(true);
  const [trimLines, setTrimLines] = useState(true);
  const [collapseSpaces, setCollapseSpaces] = useState(true);

  const output = useMemo(() => {
    return cleanText(input, {
      stripHtml,
      convertSmartQuotes,
      removeNonPrintable,
      stripEmojis,
      collapseBlankLines,
      trimLines,
      collapseSpaces,
    });
  }, [
    input,
    stripHtml,
    convertSmartQuotes,
    removeNonPrintable,
    stripEmojis,
    collapseBlankLines,
    trimLines,
    collapseSpaces,
  ]);

  return (
    <ToolWorkspace className="space-y-5">
      {/* Options Pipeline Grid */}
      <div className="p-4 rounded-xl bg-muted/20 border border-border/50 space-y-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Cleaning Operations Pipeline
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <Switch
            checked={stripHtml}
            onCheckedChange={setStripHtml}
            id="cl-html"
            label="Strip HTML / XML Tags"
          />
          <Switch
            checked={convertSmartQuotes}
            onCheckedChange={setConvertSmartQuotes}
            id="cl-quotes"
            label='Smart Quotes (" " to " ")'
          />
          <Switch
            checked={collapseSpaces}
            onCheckedChange={setCollapseSpaces}
            id="cl-spaces"
            label="Collapse Extra Spaces"
          />
          <Switch
            checked={collapseBlankLines}
            onCheckedChange={setCollapseBlankLines}
            id="cl-blanks"
            label="Remove Blank Lines"
          />
          <Switch
            checked={trimLines}
            onCheckedChange={setTrimLines}
            id="cl-trim"
            label="Trim Line Edges"
          />
          <Switch
            checked={removeNonPrintable}
            onCheckedChange={setRemoveNonPrintable}
            id="cl-control"
            label="Remove Control Chars"
          />
          <Switch
            checked={stripEmojis}
            onCheckedChange={setStripEmojis}
            id="cl-emojis"
            label="Strip Emojis"
          />
        </div>
      </div>

      {/* Input / Output Panes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Dirty Text Input
            </span>
            <div className="flex items-center gap-1">
              <SampleButton onLoadSample={() => setInput(SAMPLE_TEXT)} />
              <ClearButton onClear={() => setInput("")} disabled={!input} />
            </div>
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste text with HTML, smart quotes, or irregular characters..."
            className="min-h-[300px] text-xs font-mono"
          />
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Sanitized Output
            </span>
            <div className="flex items-center gap-1">
              <CopyButton textToCopy={output} label="Copy Cleaned" />
              <DownloadButton
                content={output}
                filename="cleaned.txt"
                label="Download"
              />
            </div>
          </div>
          <Textarea
            value={output}
            readOnly
            placeholder="Normalized text will appear here automatically..."
            className="min-h-[300px] text-xs font-mono bg-muted/10"
          />
        </div>
      </div>
    </ToolWorkspace>
  );
}
