import React from "react";
import { Tool } from "@/lib/registry/types";
import { ToolCard } from "./ToolCard";
import { Sparkles } from "lucide-react";

interface RelatedToolsProps {
  tools: Tool[];
  title?: string;
  subtitle?: string;
}

export function RelatedTools({
  tools,
  title = "Related Developer Tools",
  subtitle = "Explore more utilities commonly used together.",
}: RelatedToolsProps) {
  if (!tools || tools.length === 0) return null;

  return (
    <section className="mt-14 pt-10 border-t border-border/60">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <h2 className="text-xl font-bold tracking-tight text-foreground">{title}</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-6">{subtitle}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </section>
  );
}
