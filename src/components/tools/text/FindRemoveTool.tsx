"use client";

import React, { useState, useMemo } from "react";
import { findAndRemove } from "@/lib/engines/text/find-replace";
import { ToolWorkspace } from "../shared/ToolWorkspace";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { CopyButton } from "../shared/CopyButton";
import { DownloadButton } from "../shared/DownloadButton";
import { ClearButton } from "../shared/ClearButton";
import { SampleButton } from "../shared/SampleButton";
import { ErrorMessage } from "../shared/ErrorMessage";
import { Trash2, Search } from "lucide-react";

const SAMPLE_TEXT = `[DEBUG] 2026-08-24 Application started
[INFO] User logged in successfully
[DEBUG] Token validated
[WARN] Rate limit approaching
[DEBUG] Cache hit`;

export function FindRemoveTool() {
  const [source, setSource] = useState(SAMPLE_TEXT);
  const [findText, setFindText] = useState("[DEBUG]");
  const [isRegex, setIsRegex] = useState(false);
  const [matchCase, setMatchCase] = useState(true);
  const [wholeWord, setWholeWord] = useState(false);
  const [removeWholeLines, setRemoveWholeLines] = useState(true);

  const result = useMemo(() => {
    return findAndRemove(source, {
      findText,
      isRegex,
      matchCase,
      wholeWord,
      removeWholeLines,
    });
  }, [source, findText, isRegex, matchCase, wholeWord, removeWholeLines]);

  return (
    <ToolWorkspace className="space-y-5">
      {/* Search Input Controls */}
      <div className="p-4 rounded-xl bg-muted/20 border border-border/50 space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
            <Search className="h-3.5 w-3.5 text-primary" />
            Pattern / Substring to Remove
          </label>
          <Input
            value={findText}
            onChange={(e) => setFindText(e.target.value)}
            placeholder="Text or RegExp to strip..."
            className="h-9 font-mono text-xs bg-background"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-border/40">
          <div className="flex flex-wrap items-center gap-4">
            <Switch
              checked={removeWholeLines}
              onCheckedChange={setRemoveWholeLines}
              id="fr-lines"
              label="Remove Entire Matching Lines"
            />
            <Switch
              checked={isRegex}
              onCheckedChange={setIsRegex}
              id="fr-regex-r"
              label="RegExp Pattern"
            />
            <Switch
              checked={matchCase}
              onCheckedChange={setMatchCase}
              id="fr-case-r"
              label="Match Case"
            />
            <Switch
              checked={wholeWord}
              onCheckedChange={setWholeWord}
              id="fr-word-r"
              label="Whole Word"
            />
          </div>

          <span className="px-2.5 py-1 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 font-mono text-xs">
            {result.matchCount} occurrence{result.matchCount === 1 ? "" : "s"} removed
          </span>
        </div>
      </div>

      {result.error && (
        <ErrorMessage title="RegExp Syntax Error" message={result.error} />
      )}

      {/* Editor Panes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Source */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Input Text
            </span>
            <div className="flex items-center gap-1">
              <SampleButton onLoadSample={() => setSource(SAMPLE_TEXT)} />
              <ClearButton onClear={() => setSource("")} disabled={!source} />
            </div>
          </div>
          <Textarea
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="Paste text here..."
            className="min-h-[280px] text-xs font-mono"
          />
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Stripped Output
            </span>
            <div className="flex items-center gap-1">
              <CopyButton textToCopy={result.output} label="Copy Output" />
              <DownloadButton
                content={result.output}
                filename="stripped-text.txt"
                label="Download"
              />
            </div>
          </div>
          <Textarea
            value={result.output}
            readOnly
            placeholder="Text with matches removed appears here..."
            className="min-h-[280px] text-xs font-mono bg-muted/10"
          />
        </div>
      </div>
    </ToolWorkspace>
  );
}
