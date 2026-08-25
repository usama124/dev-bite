"use client";

import React, { useState, useMemo } from "react";
import { removeWhitespace } from "@/lib/engines/text/whitespace-remover";
import { ToolWorkspace } from "../shared/ToolWorkspace";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CopyButton } from "../shared/CopyButton";
import { DownloadButton } from "../shared/DownloadButton";
import { ClearButton } from "../shared/ClearButton";
import { SampleButton } from "../shared/SampleButton";
import { Sparkles, Wand2 } from "lucide-react";

const SAMPLE_TEXT = `   DevBite    Whitespace    Remover   

   Line 1 with    extra    spaces.   
   
   
   Line 2 preceded by empty lines.   
   
   \tTab-indented line with trailing spaces.   `;

export function WhitespaceRemoverTool() {
  const [input, setInput] = useState(SAMPLE_TEXT);
  const [collapseMultipleSpaces, setCollapseMultipleSpaces] = useState(true);
  const [trimLineEdges, setTrimLineEdges] = useState(true);
  const [removeBlankLines, setRemoveBlankLines] = useState(true);
  const [removeAllWhitespace, setRemoveAllWhitespace] = useState(false);
  const [replaceTabsWithSpaces, setReplaceTabsWithSpaces] = useState(true);

  const output = useMemo(() => {
    return removeWhitespace(input, {
      collapseMultipleSpaces,
      trimLineEdges,
      removeBlankLines,
      removeAllWhitespace,
      replaceTabsWithSpaces,
    });
  }, [
    input,
    collapseMultipleSpaces,
    trimLineEdges,
    removeBlankLines,
    removeAllWhitespace,
    replaceTabsWithSpaces,
  ]);

  const handlePresetAllSpaces = () => {
    setRemoveAllWhitespace(true);
  };

  const handlePresetClean = () => {
    setRemoveAllWhitespace(false);
    setCollapseMultipleSpaces(true);
    setTrimLineEdges(true);
    setRemoveBlankLines(true);
    setReplaceTabsWithSpaces(true);
  };

  return (
    <ToolWorkspace className="space-y-5">
      {/* Options Toolbar */}
      <div className="p-4 rounded-xl bg-muted/20 border border-border/50 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-4">
            <Switch
              checked={collapseMultipleSpaces}
              onCheckedChange={(val) => {
                setCollapseMultipleSpaces(val);
                setRemoveAllWhitespace(false);
              }}
              id="ws-collapse"
              label="Collapse Multiple Spaces"
            />
            <Switch
              checked={trimLineEdges}
              onCheckedChange={(val) => {
                setTrimLineEdges(val);
                setRemoveAllWhitespace(false);
              }}
              id="ws-trim"
              label="Trim Line Edges"
            />
            <Switch
              checked={removeBlankLines}
              onCheckedChange={(val) => {
                setRemoveBlankLines(val);
                setRemoveAllWhitespace(false);
              }}
              id="ws-blank"
              label="Remove Blank Lines"
            />
            <Switch
              checked={replaceTabsWithSpaces}
              onCheckedChange={setReplaceTabsWithSpaces}
              id="ws-tabs"
              label="Tabs to Spaces"
            />
            <Switch
              checked={removeAllWhitespace}
              onCheckedChange={setRemoveAllWhitespace}
              id="ws-all"
              label="Remove ALL Whitespace"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePresetClean}
              className="h-8 text-xs"
            >
              Standard Clean
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handlePresetAllSpaces}
              className="h-8 text-xs"
            >
              Remove All Spaces
            </Button>
          </div>
        </div>
      </div>

      {/* Input / Output Panes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Input Text
            </span>
            <div className="flex items-center gap-1">
              <SampleButton onLoadSample={() => setInput(SAMPLE_TEXT)} />
              <ClearButton onClear={() => setInput("")} disabled={!input} />
            </div>
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste text with messy spacing or blank lines..."
            className="min-h-[300px] text-xs font-mono"
          />
          <div className="text-[11px] text-muted-foreground px-1">
            Input: {input.length} chars &bull; {input.split(/\r?\n/).length} lines
          </div>
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Cleaned Output
            </span>
            <div className="flex items-center gap-1">
              <CopyButton textToCopy={output} label="Copy Result" />
              <DownloadButton
                content={output}
                filename="cleaned-text.txt"
                label="Download"
              />
            </div>
          </div>
          <Textarea
            value={output}
            readOnly
            placeholder="Cleaned text will appear here automatically..."
            className="min-h-[300px] text-xs font-mono bg-muted/10"
          />
          <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1">
            <span>Output: {output.length} chars &bull; {output ? output.split(/\r?\n/).length : 0} lines</span>
            <span>Saved {Math.max(0, input.length - output.length)} characters</span>
          </div>
        </div>
      </div>
    </ToolWorkspace>
  );
}
