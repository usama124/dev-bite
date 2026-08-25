"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Sparkles,
  ShieldCheck,
  Zap,
  Lock,
  Cpu,
  ArrowRight,
  Type,
  Braces,
  Code2,
  Binary,
  Command,
} from "lucide-react";
import { CATEGORY_LIST } from "@/lib/registry/categories";
import { getPopularTools, getAllTools } from "@/lib/registry";
import { ToolCard } from "@/components/shared/ToolCard";
import { PrivacyBadge } from "@/components/shared/PrivacyBadge";
import { CommandSearch } from "@/components/shared/CommandSearch";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const popularTools = getPopularTools();
  const allTools = getAllTools();

  const categoryIcons = {
    text: Type,
    json: Braces,
    developer: Code2,
    encoding: Binary,
  };

  const featureCards = [
    {
      title: "100% Client-Side Privacy",
      description: "All processing occurs locally in your browser. No input text, tokens, or files are ever sent to a server.",
      icon: Lock,
      color: "text-emerald-500",
    },
    {
      title: "Zero Latency & Instant Output",
      description: "Optimized pure TypeScript engines deliver instant calculations with no API lag or rate limits.",
      icon: Zap,
      color: "text-amber-500",
    },
    {
      title: "No Signups or Installs",
      description: "Direct access to full utility capabilities from any device without accounts or intrusive permissions.",
      icon: Cpu,
      color: "text-indigo-500",
    },
  ];

  return (
    <>
      <div className="container py-12 md:py-20 max-w-5xl space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="flex justify-center">
            <PrivacyBadge />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-foreground leading-[1.1]">
            Your Everyday <br className="hidden sm:inline" />
            <span className="theme-gradient-text bg-clip-text text-transparent">
              Online Toolbox
            </span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Fast, free, and privacy-friendly utilities for developers and creators. Format, transform, count, validate, and encode in one click.
          </p>

          {/* Interactive Search Bar */}
          <div className="pt-2 max-w-xl mx-auto">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl border border-border/80 bg-card/80 backdrop-blur-xl shadow-glass dark:shadow-glass-dark hover:border-primary/50 transition-all text-left text-muted-foreground group"
            >
              <div className="flex items-center gap-3">
                <Search className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="text-sm font-medium">
                  Search all 48 tools... (e.g. JSON Formatter, Word Counter, UUID)
                </span>
              </div>
              <kbd className="hidden sm:inline-flex items-center gap-1 font-mono text-xs bg-muted/80 px-2 py-1 rounded-md border border-border/80 text-muted-foreground">
                <Command className="h-3 w-3" /> K
              </kbd>
            </button>
          </div>
        </section>

        {/* Categories Explorer */}
        <section id="categories" className="scroll-mt-24 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Tool Categories
            </h2>
            <Link
              href="/tools"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              View All 48 Tools <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CATEGORY_LIST.map((category) => {
              const Icon = categoryIcons[category.id];
              return (
                <Link
                  key={category.id}
                  href={`/tools/category/${category.id}`}
                  className="group p-5 rounded-2xl glass-card transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div
                      className={`h-10 w-10 rounded-xl flex items-center justify-center border ${category.badgeBg} ${category.badgeBorder} ${category.badgeText}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {category.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground group-hover:text-primary font-medium">
                    <span>{category.totalTools} Utilities</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Popular Launch Tools */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground">
                Popular &amp; Representative Launch Tools
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Instant interactive developer utilities built with zero server dependencies.
              </p>
            </div>
            <Link
              href="/tools"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
            >
              Browse Directory <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularTools.slice(0, 8).map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>

        {/* Why Use DevBite */}
        <section className="p-8 rounded-3xl border border-border/60 bg-muted/10 backdrop-blur-md space-y-6">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">
              Why Use DevBite?
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Designed by developers for developers. Clean, reliable, and uncompromised on speed or privacy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {featureCards.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="space-y-2.5">
                  <div className="flex items-center gap-2.5">
                    <Icon className={`h-5 w-5 ${feat.color}`} />
                    <h3 className="font-semibold text-sm text-foreground">{feat.title}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Global Command Search Modal */}
      <CommandSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}
