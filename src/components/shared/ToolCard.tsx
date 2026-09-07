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
    security: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    sql: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20",
    data: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    api: "bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 border-fuchsia-500/20",
    image: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
    pdf: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    file: "bg-lime-500/10 text-lime-700 dark:text-lime-400 border-lime-500/20",
    networking: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
    generation: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
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
