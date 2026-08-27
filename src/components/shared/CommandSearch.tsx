"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Command, ArrowRight, CornerDownLeft, Sparkles } from "lucide-react";
import { getAllTools, Tool, ToolCategory } from "@/lib/registry";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_LIST } from "@/lib/registry/categories";

interface CommandSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandSearch({ isOpen, onClose }: CommandSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const allTools = getAllTools();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open triggered by parent or global listener
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Filter tools
  const filteredTools = allTools.filter((tool) => {
    const matchesCategory =
      selectedCategory === "all" || tool.category === selectedCategory;

    if (!matchesCategory) return false;

    if (!query.trim()) return true;

    const cleanQuery = query.toLowerCase().trim();
    const nameMatch = tool.name.toLowerCase().includes(cleanQuery);
    const descMatch = tool.shortDescription.toLowerCase().includes(cleanQuery);
    const slugMatch = tool.slug.toLowerCase().includes(cleanQuery);
    const keywordMatch = tool.keywords.some((k) => k.toLowerCase().includes(cleanQuery));

    return nameMatch || descMatch || slugMatch || keywordMatch;
  });

  const handleSelectTool = (slug: string) => {
    onClose();
    router.push(`/tools/${slug}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredTools.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredTools.length) % Math.max(1, filteredTools.length));
    } else if (e.key === "Enter" && filteredTools.length > 0) {
      e.preventDefault();
      const target = filteredTools[selectedIndex];
      if (target) {
        handleSelectTool(target.slug);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-background/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-border/80 bg-card/95 shadow-2xl backdrop-blur-xl transition-all"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search header */}
        <div className="relative flex items-center border-b border-border/60 px-4 py-3">
          <Search className="h-5 w-5 text-muted-foreground mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder={`Search all ${allTools.length} tools...`}
            className="w-full bg-transparent text-sm sm:text-base placeholder:text-muted-foreground/70 focus:outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 text-muted-foreground hover:text-foreground rounded-md"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <div className="flex items-center gap-1 text-[11px] font-mono text-muted-foreground bg-muted/60 px-1.5 py-0.5 rounded border border-border/50">
              <span>ESC</span>
            </div>
          )}
        </div>

        {/* Category filter tabs */}
        <div className="flex items-center gap-1.5 px-4 py-2 border-b border-border/40 overflow-x-auto text-xs bg-muted/20">
          {["all", ...CATEGORY_LIST.map((category) => category.id)].map((cat) => (
            <button
              type="button"
              aria-pressed={selectedCategory === cat}
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setSelectedIndex(0);
              }}
              className={`px-2.5 py-1 rounded-md capitalize font-medium transition-colors whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {cat === "all" ? `All Tools (${allTools.length})` : cat}
            </button>
          ))}
        </div>

        {/* Results list */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-1">
          {filteredTools.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              <p>No tools found matching &quot;{query}&quot;</p>
              <p className="text-xs mt-1 text-muted-foreground/70">
                Try searching for general keywords like &quot;format&quot;, &quot;count&quot;, &quot;encode&quot;, or &quot;generate&quot;.
              </p>
            </div>
          ) : (
            filteredTools.map((tool, index) => {
              const isSelected = index === selectedIndex;
              return (
                <div
                  key={tool.id}
                  onClick={() => handleSelectTool(tool.slug)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? "bg-primary/10 text-foreground border border-primary/20"
                      : "hover:bg-muted/50 text-foreground/80"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <div
                      className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-mono font-bold ${
                        tool.category === "text"
                          ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                          : tool.category === "json"
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                          : tool.category === "developer"
                          ? "bg-primary/10 text-primary"
                          : tool.category === "security"
                          ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                          : tool.category === "sql"
                          ? "bg-violet-500/10 text-violet-600 dark:text-violet-400"
                          : tool.category === "data"
                          ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400"
                          : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      }`}
                    >
                      {tool.id}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm truncate">{tool.name}</span>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-muted text-muted-foreground">
                          {tool.category}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{tool.shortDescription}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {isSelected && (
                      <div className="hidden sm:flex items-center text-[10px] text-muted-foreground gap-1">
                        <span>Select</span>
                        <CornerDownLeft className="h-3 w-3" />
                      </div>
                    )}
                    <ArrowRight className={`h-4 w-4 transition-transform ${isSelected ? "translate-x-0.5 text-primary" : "text-muted-foreground/40"}`} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Search footer */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-muted/40 border-t border-border/60 text-[11px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="font-mono bg-background px-1.5 py-0.5 rounded border border-border/80">↑</kbd>{" "}
              <kbd className="font-mono bg-background px-1.5 py-0.5 rounded border border-border/80">↓</kbd> to navigate
            </span>
            <span>
              <kbd className="font-mono bg-background px-1.5 py-0.5 rounded border border-border/80">↵</kbd> to open
            </span>
          </div>
          <span>Showing {filteredTools.length} tools</span>
        </div>
      </div>
    </div>
  );
}
