"use client";

import React, { useState, useMemo } from "react";
import { countCharacters } from "@/lib/engines/text/character-counter";
import { ToolWorkspace } from "../shared/ToolWorkspace";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "../shared/CopyButton";
import { ClearButton } from "../shared/ClearButton";
import { SampleButton } from "../shared/SampleButton";
import { Type, AlignLeft, Hash, Twitter, MessageSquare, Search, FileText } from "lucide-react";

const SAMPLE_TEXT = `DevBite gives developers free, client-side online utilities that run with zero server latency and 100% privacy. Check your tweet and meta description character limits in real-time!`;

export function CharacterCounterTool() {
  const [text, setText] = useState("");

  const stats = useMemo(() => countCharacters(text), [text]);

  const socialProgress = [
    {
      name: "X (Twitter)",
      limit: 280,
      remaining: stats.socialLimits.twitter.remaining,
      percent: stats.socialLimits.twitter.percentage,
      icon: Twitter,
    },
    {
      name: "Google Meta Title",
      limit: 60,
      remaining: stats.socialLimits.metaTitle.remaining,
      percent: stats.socialLimits.metaTitle.percentage,
      icon: Search,
    },
    {
      name: "Google Meta Description",
      limit: 160,
      remaining: stats.socialLimits.metaDescription.remaining,
      percent: stats.socialLimits.metaDescription.percentage,
      icon: FileText,
    },
    {
      name: "SMS Message",
      limit: 160,
      remaining: stats.socialLimits.sms.remaining,
      parts: stats.socialLimits.sms.parts,
      icon: MessageSquare,
    },
  ];

  return (
    <ToolWorkspace className="space-y-6">
      {/* Primary Counter Highlight */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl border border-primary/30 bg-primary/5 flex flex-col justify-between">
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">Total Characters</span>
          <span className="text-3xl font-extrabold text-foreground mt-1">{stats.characters}</span>
        </div>
        <div className="p-4 rounded-xl border border-border/60 bg-muted/20 flex flex-col justify-between">
          <span className="text-xs font-medium text-muted-foreground">No Spaces</span>
          <span className="text-2xl font-bold text-foreground mt-1">{stats.charactersNoSpaces}</span>
        </div>
        <div className="p-4 rounded-xl border border-border/60 bg-muted/20 flex flex-col justify-between">
          <span className="text-xs font-medium text-muted-foreground">Words</span>
          <span className="text-2xl font-bold text-foreground mt-1">{stats.words}</span>
        </div>
        <div className="p-4 rounded-xl border border-border/60 bg-muted/20 flex flex-col justify-between">
          <span className="text-xs font-medium text-muted-foreground">UTF-8 Bytes</span>
          <span className="text-2xl font-bold text-foreground mt-1">{stats.bytesUtf8}</span>
        </div>
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
          placeholder="Start typing or paste text here to see live character count, byte size and social media length limits..."
          className="min-h-[220px] text-base leading-relaxed"
          autoFocus
        />
      </div>

      {/* Social / SEO Length Limits */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Platform Length Limits &amp; Recommendations
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {socialProgress.map((item, idx) => {
            const Icon = item.icon;
            const isOver = item.remaining < 0;
            return (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-border/60 bg-muted/10 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-medium text-foreground">
                    <Icon className="h-3.5 w-3.5 text-primary" />
                    <span>{item.name}</span>
                  </div>
                  <span
                    className={`font-mono text-xs font-bold ${
                      isOver ? "text-destructive" : "text-muted-foreground"
                    }`}
                  >
                    {isOver ? `${Math.abs(item.remaining)} over limit` : `${item.remaining} chars left`}
                  </span>
                </div>

                {item.parts !== undefined ? (
                  <div className="text-[11px] text-muted-foreground">
                    Estimated SMS Segments: <strong className="text-foreground">{item.parts}</strong>
                  </div>
                ) : (
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isOver ? "bg-destructive" : "bg-primary"
                      }`}
                      style={{ width: `${Math.min(100, item.percent || 0)}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </ToolWorkspace>
  );
}
