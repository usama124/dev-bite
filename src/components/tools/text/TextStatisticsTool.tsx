"use client";

import React, { useState, useMemo } from "react";
import { computeTextStatistics } from "@/lib/engines/text/text-statistics";
import { ToolWorkspace } from "../shared/ToolWorkspace";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "../shared/CopyButton";
import { ClearButton } from "../shared/ClearButton";
import { SampleButton } from "../shared/SampleButton";
import {
  BookOpen,
  Award,
  Clock,
  Volume2,
  FileText,
  Type,
  AlignLeft,
  Percent,
  Sparkles,
} from "lucide-react";

const SAMPLE_TEXT = `DevBite provides an extensive suite of developer productivity tools. Every tool is crafted with careful attention to user experience, speed, and privacy.

The text statistics engine analyzes readability scores like Flesch Reading Ease and Flesch-Kincaid Grade Level, helping writers, marketers, and developers ensure their content is clear and engaging.`;

export function TextStatisticsTool() {
  const [text, setText] = useState(SAMPLE_TEXT);

  const stats = useMemo(() => computeTextStatistics(text), [text]);

  return (
    <ToolWorkspace className="space-y-6">
      {/* Readability & Grade Level Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Flesch Reading Ease */}
        <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="h-4 w-4" />
              Flesch Reading Ease
            </span>
            <span className="text-2xl font-black text-foreground">{stats.fleschReadingEase} / 100</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Difficulty: <strong className="text-foreground">{stats.readingEaseLabel}</strong>
          </p>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden mt-1">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-primary rounded-full transition-all"
              style={{ width: `${stats.fleschReadingEase}%` }}
            />
          </div>
        </div>

        {/* Grade Level */}
        <div className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Award className="h-4 w-4 text-indigo-500" />
              Flesch-Kincaid Grade
            </span>
            <span className="text-2xl font-black text-foreground">{stats.fleschGradeLevel}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Target Audience: <strong className="text-foreground">{stats.gradeLevelLabel}</strong>
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl border border-border/60 bg-card/60 text-xs">
          <span className="text-muted-foreground block mb-1">Words / Unique</span>
          <span className="text-lg font-bold text-foreground">{stats.words} / {stats.uniqueWords}</span>
        </div>
        <div className="p-3 rounded-xl border border-border/60 bg-card/60 text-xs">
          <span className="text-muted-foreground block mb-1">Lexical Diversity</span>
          <span className="text-lg font-bold text-foreground">{stats.lexicalDiversityPercent}%</span>
        </div>
        <div className="p-3 rounded-xl border border-border/60 bg-card/60 text-xs">
          <span className="text-muted-foreground block mb-1">Avg Sentence Length</span>
          <span className="text-lg font-bold text-foreground">{stats.avgSentenceLengthWords} words</span>
        </div>
        <div className="p-3 rounded-xl border border-border/60 bg-card/60 text-xs">
          <span className="text-muted-foreground block mb-1">Avg Word Length</span>
          <span className="text-lg font-bold text-foreground">{stats.avgWordLengthChars} chars</span>
        </div>
        <div className="p-3 rounded-xl border border-border/60 bg-card/60 text-xs">
          <span className="text-muted-foreground block mb-1">Sentences</span>
          <span className="text-lg font-bold text-foreground">{stats.sentences}</span>
        </div>
        <div className="p-3 rounded-xl border border-border/60 bg-card/60 text-xs">
          <span className="text-muted-foreground block mb-1">Paragraphs</span>
          <span className="text-lg font-bold text-foreground">{stats.paragraphs}</span>
        </div>
        <div className="p-3 rounded-xl border border-border/60 bg-card/60 text-xs">
          <span className="text-muted-foreground block mb-1">Reading Time</span>
          <span className="text-lg font-bold text-foreground">{stats.readingTimeFormatted}</span>
        </div>
        <div className="p-3 rounded-xl border border-border/60 bg-card/60 text-xs">
          <span className="text-muted-foreground block mb-1">Speaking Time</span>
          <span className="text-lg font-bold text-foreground">{stats.speakingTimeFormatted}</span>
        </div>
      </div>

      {/* Input Area */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Analysis Input
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
          placeholder="Paste or type text to inspect detailed statistics, readability grades, and metrics..."
          className="min-h-[220px] text-sm leading-relaxed"
        />
      </div>
    </ToolWorkspace>
  );
}
