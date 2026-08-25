import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Tool } from "@/lib/registry/types";
import { Badge } from "@/components/ui/badge";

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const categoryBadgeStyles = {
    text: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    json: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    developer: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
    encoding: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  };

  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="group relative flex flex-col justify-between p-5 rounded-2xl glass-card transition-all duration-200"
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span
            className={`text-[11px] font-mono font-medium uppercase px-2 py-0.5 rounded-full border ${
              categoryBadgeStyles[tool.category]
            }`}
          >
            {tool.category}
          </span>
          <span className="text-xs font-mono text-muted-foreground/60">{tool.id}</span>
        </div>

        <h3 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
          {tool.name}
        </h3>
        <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2 leading-relaxed">
          {tool.shortDescription}
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground group-hover:text-primary transition-colors">
        <span className="font-medium">Open Tool</span>
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
