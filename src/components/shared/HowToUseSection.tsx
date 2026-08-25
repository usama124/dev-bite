import React from "react";
import { BookOpen, CheckCircle2 } from "lucide-react";
import { ToolExample } from "@/lib/registry/types";

interface HowToUseSectionProps {
  toolName: string;
  steps?: string[];
  examples?: ToolExample[];
  features?: string[];
}

export function HowToUseSection({
  toolName,
  steps,
  examples,
  features,
}: HowToUseSectionProps) {
  return (
    <section className="mt-14 pt-10 border-t border-border/60">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Step by step guide */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              How to use {toolName}
            </h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Follow these simple steps to use the online {toolName.toLowerCase()} tool:
          </p>

          {steps && steps.length > 0 ? (
            <ol className="space-y-3 mt-4">
              {steps.map((step, idx) => (
                <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs">
                    {idx + 1}
                  </span>
                  <span className="pt-0.5 leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-muted-foreground">
              Input your data into the workspace above, configure your options, and get instant results.
            </p>
          )}

          {/* Key features */}
          {features && features.length > 0 && (
            <div className="mt-6 pt-4 border-t border-border/40">
              <h3 className="text-sm font-semibold text-foreground mb-3">Key Capabilities</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Examples / Explanations */}
        {examples && examples.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold tracking-tight text-foreground">Example</h3>
            {examples.map((ex, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-border/60 bg-muted/20 p-4 space-y-3 backdrop-blur-sm"
              >
                <div className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
                  {ex.title}
                </div>
                {ex.description && (
                  <p className="text-xs text-muted-foreground leading-relaxed">{ex.description}</p>
                )}
                {ex.input && (
                  <div>
                    <span className="text-[11px] font-mono text-muted-foreground/80 block mb-1">Input:</span>
                    <pre className="p-2.5 rounded-lg bg-background/80 border border-border/50 text-xs font-mono overflow-x-auto whitespace-pre-wrap">
                      {ex.input}
                    </pre>
                  </div>
                )}
                {ex.output && (
                  <div>
                    <span className="text-[11px] font-mono text-muted-foreground/80 block mb-1">Output:</span>
                    <pre className="p-2.5 rounded-lg bg-primary/5 border border-primary/20 text-xs font-mono text-primary overflow-x-auto whitespace-pre-wrap">
                      {ex.output}
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
