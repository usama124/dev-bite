"use client";

import React, { useState, useMemo } from "react";
import { findAndReplace } from "@/lib/engines/text/find-replace";
import { ToolWorkspace } from "../shared/ToolWorkspace";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { CopyButton } from "../shared/CopyButton";
import { DownloadButton } from "../shared/DownloadButton";
import { ClearButton } from "../shared/ClearButton";
import { SampleButton } from "../shared/SampleButton";
import { ErrorMessage } from "../shared/ErrorMessage";
import { Search, Replace, CheckCircle2 } from "lucide-react";

const SAMPLE_TEXT = `The quick brown fox jumps over the lazy dog.
Foxes are wild animals. Every fox is clever.`;

export function FindReplaceTool() {
  const [source, setSource] = useState(SAMPLE_TEXT);
  const [findText, setFindText] = useState("fox");
  const [replaceText, setReplaceText] = useState("cat");
  const [isRegex, setIsRegex] = useState(false);
  const [matchCase, setMatchCase] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);

  const result = useMemo(() => {
    return findAndReplace(source, {
      findText,
      replaceText,
      isRegex,
      matchCase,
      wholeWord,
      replaceAll: true,
    });
  }, [source, findText, replaceText, isRegex, matchCase, wholeWord]);

  return (
    <ToolWorkspace className="space-y-5">
      {/* Search & Replace Input Controls */}
      <div className="p-4 rounded-xl bg-muted/20 border border-border/50 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Find */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <Search className="h-3.5 w-3.5 text-primary" />
              Find Text / Pattern
            </label>
            <Input
              value={findText}
              onChange={(e) => setFindText(e.target.value)}
              placeholder="Text or RegExp to find..."
              className="h-9 font-mono text-xs bg-background"
            />
          </div>

          {/* Replace */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <Replace className="h-3.5 w-3.5 text-indigo-500" />
              Replace With
            </label>
            <Input
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
              placeholder="Replacement text (supports $1, $2 with regex)..."
              className="h-9 font-mono text-xs bg-background"
            />
          </div>
        </div>

        {/* Toggles and Match Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-border/40">
          <div className="flex flex-wrap items-center gap-4">
            <Switch
              checked={isRegex}
              onCheckedChange={setIsRegex}
              id="fr-regex"
              label="Regular Expression (RegExp)"
            />
            <Switch
              checked={matchCase}
              onCheckedChange={setMatchCase}
              id="fr-case"
              label="Match Case"
            />
            <Switch
              checked={wholeWord}
              onCheckedChange={setWholeWord}
              id="fr-word"
              label="Whole Word Only"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs font-medium">
            <span className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary border border-primary/20 font-mono">
              {result.matchCount} match{result.matchCount === 1 ? "" : "es"} found
            </span>
          </div>
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
              Source Text
            </span>
            <div className="flex items-center gap-1">
              <SampleButton onLoadSample={() => setSource(SAMPLE_TEXT)} />
              <ClearButton onClear={() => setSource("")} disabled={!source} />
            </div>
          </div>
          <Textarea
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="Type or paste source text..."
            className="min-h-[280px] text-xs font-mono"
          />
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Replaced Output
            </span>
            <div className="flex items-center gap-1">
              <CopyButton textToCopy={result.output} label="Copy Result" />
              <DownloadButton
                content={result.output}
                filename="replaced-text.txt"
                label="Download"
              />
            </div>
          </div>
          <Textarea
            value={result.output}
            readOnly
            placeholder="Replaced output appears here..."
            className="min-h-[280px] text-xs font-mono bg-muted/10"
          />
        </div>
      </div>
    </ToolWorkspace>
  );
}
