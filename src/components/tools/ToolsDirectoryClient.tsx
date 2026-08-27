"use client";

import React, { useState } from "react";
import { getAllTools, ToolCategory } from "@/lib/registry";
import { CATEGORY_LIST } from "@/lib/registry/categories";
import { ToolCard } from "@/components/shared/ToolCard";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { Search, Wrench } from "lucide-react";
import { Input } from "@/components/ui/input";

export function ToolsDirectoryClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [query, setQuery] = useState("");

  const allTools = getAllTools();

  const filteredTools = allTools.filter((tool) => {
    const matchesCategory =
      selectedCategory === "all" || tool.category === selectedCategory;
    if (!matchesCategory) return false;

    if (!query.trim()) return true;

    const cleanQuery = query.toLowerCase().trim();
    const nameMatch = tool.name.toLowerCase().includes(cleanQuery);
    const descMatch = tool.shortDescription.toLowerCase().includes(cleanQuery);
    const keywordMatch = tool.keywords.some((k) => k.toLowerCase().includes(cleanQuery));

    return nameMatch || descMatch || keywordMatch;
  });

  return (
    <div className="container py-8 max-w-5xl space-y-8">
      <Breadcrumbs items={[{ label: "All Tools" }]} />

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-primary">
          <Wrench className="h-5 w-5" />
          <span className="text-xs font-bold uppercase tracking-wider">Directory</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
          All Developer Tools ({allTools.length})
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
          Browse the complete Phase 1 and Phase 2 catalog of fast, free, client-side utilities across seven focused categories.
        </p>
      </div>

      {/* Search and Category Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto p-1 rounded-xl bg-muted/40 border border-border/50">
          <button
            type="button"
            aria-pressed={selectedCategory === "all"}
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              selectedCategory === "all"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All ({allTools.length})
          </button>
          {CATEGORY_LIST.map((cat) => (
            <button
              type="button"
              aria-pressed={selectedCategory === cat.id}
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat.name.replace(" Tools", "").replace(" Utilities", "").replace(" & Decoding", "")} ({cat.totalTools})
            </button>
          ))}
        </div>

        {/* In-page filter input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter tools by keyword..."
            className="pl-8 text-xs h-9 bg-background/80"
          />
        </div>
      </div>

      {/* Tools Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
        {filteredTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="p-12 text-center text-sm text-muted-foreground border border-dashed border-border/70 rounded-2xl">
          <p>No utilities found matching &quot;{query}&quot;</p>
        </div>
      )}
    </div>
  );
}
