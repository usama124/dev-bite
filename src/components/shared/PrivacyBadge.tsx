import React from "react";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface PrivacyBadgeProps {
  className?: string;
  subtle?: boolean;
}

export function PrivacyBadge({ className, subtle = false }: PrivacyBadgeProps) {
  if (subtle) {
    return (
      <div className={cn("inline-flex items-center gap-1.5 text-xs text-muted-foreground font-medium", className)}>
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
        <span>100% Client-Side &bull; No data leaves your device</span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 backdrop-blur-sm",
        className
      )}
    >
      <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-500" />
      <span>🔒 Processed locally in your browser. Complete privacy guaranteed.</span>
    </div>
  );
}
