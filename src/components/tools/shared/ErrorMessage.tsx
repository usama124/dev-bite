import React from "react";
import { AlertCircle, Lightbulb } from "lucide-react";

interface ErrorMessageProps {
  title?: string;
  message: string;
  line?: number;
  column?: number;
  snippet?: string;
  hint?: string;
}

export function ErrorMessage({
  title = "Validation Error",
  message,
  line,
  column,
  snippet,
  hint,
}: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-foreground space-y-2.5 backdrop-blur-sm animate-fade-in">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-semibold text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{title}</span>
        </div>
        {line !== undefined && column !== undefined && (
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="px-1.5 py-0.5 rounded bg-destructive/10 text-destructive font-medium">
              Line {line}, Col {column}
            </span>
          </div>
        )}
      </div>

      <p className="text-sm text-foreground/90 font-medium">{message}</p>

      {snippet && (
        <pre className="p-2.5 rounded-lg bg-background/90 border border-destructive/20 text-xs font-mono text-destructive overflow-x-auto whitespace-pre">
          {snippet}
        </pre>
      )}

      {hint && (
        <div className="flex items-start gap-2 text-xs text-muted-foreground pt-1 border-t border-destructive/10">
          <Lightbulb className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
          <span><strong className="text-foreground/80">Suggestion:</strong> {hint}</span>
        </div>
      )}
    </div>
  );
}
