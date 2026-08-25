"use client";

import React, { useState, useMemo } from "react";
import { countWordsAndStats } from "@/lib/engines/text/word-counter";
import { ToolWorkspace } from "../shared/ToolWorkspace";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "../shared/CopyButton";
import { ClearButton } from "../shared/ClearButton";
import { SampleButton } from "../shared/SampleButton";
import { Clock, Volume2, Type, AlignLeft, Hash, FileText } from "lucide-react";

const SAMPLE_TEXT = `DevBite is a fast, free, and privacy-first online developer utilities platform. Every tool runs 100% locally in your browser using modern Web APIs and pure TypeScript engines.

No data ever leaves your device. Try our word counter, JSON formatter, UUID generator, and Base64 encoder to supercharge your daily development workflows!`;

export function WordCounterTool() {
  const [text, setText] = useState("");

  const stats = useMemo(() => countWordsAndStats(text), [text]);

  const statCards = [
    { label: "Words", value: stats.words, icon: FileText, color: "text-blue-500" },
    { label: "Characters", value: stats.characters, icon: Type, color: "text-indigo-500" },
    { label: "Chars (no spaces)", value: stats.charactersNoSpaces, icon: Hash, color: "text-violet-500" },
    { label: "Sentences", value: stats.sentences, icon: AlignLeft, color: "text-cyan-500" },
    { label: "Paragraphs", value: stats.paragraphs, icon: AlignLeft, color: "text-amber-500" },
    { label: "Lines", value: stats.lines, icon: AlignLeft, color: "text-emerald-500" },
    { label: "Reading Time", value: stats.readingTimeFormatted, icon: Clock, color: "text-rose-500" },
    { label: "Speaking Time", value: stats.speakingTimeFormatted, icon: Volume2, color: "text-teal-500" },
  ];

  return (
    <ToolWorkspace className="space-y-6">
      {/* Live Statistics Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="p-3.5 rounded-xl border border-border/60 bg-muted/20 backdrop-blur-sm flex flex-col justify-between transition-all hover:bg-muted/30"
            >
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                <span>{card.label}</span>
                <Icon className={`h-3.5 w-3.5 ${card.color}`} />
              </div>
              <div className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {card.value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Type or Paste Text
          </label>
          <div className="flex items-center gap-1">
            <SampleButton onLoadSample={() => setText(SAMPLE_TEXT)} />
            <ClearButton onClear={() => setText("")} disabled={!text} />
            <CopyButton textToCopy={text} label="Copy Text" />
          </div>
        </div>

        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Start typing or paste your text here to see live word count, character count, reading time and statistics..."
          className="min-h-[240px] text-base leading-relaxed"
          autoFocus
        />

        <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
          <span>Avg. Word Length: <strong>{stats.avgWordLength}</strong> chars</span>
          <span>{stats.characters} total characters</span>
        </div>
      </div>

      {/* Top Keywords / Word Frequency */}
      {stats.topWords.length > 0 && (
        <div className="pt-4 border-t border-border/50">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Top Keyword Frequency
          </h4>
          <div className="flex flex-wrap gap-2">
            {stats.topWords.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/40 border border-border/60 text-xs text-foreground"
              >
                <span className="font-medium">{item.word}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-background/80 text-muted-foreground">
                  {item.count} &bull; {item.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </ToolWorkspace>
  );
}
