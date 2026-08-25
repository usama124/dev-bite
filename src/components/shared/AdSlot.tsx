import React from "react";
import { cn } from "@/lib/utils";

interface AdSlotProps {
  slotId?: string;
  format?: "banner" | "rectangle" | "horizontal";
  className?: string;
}

export function AdSlot({ slotId = "banner-placeholder", format = "horizontal", className }: AdSlotProps) {
  return (
    <div
      className={cn(
        "my-8 w-full overflow-hidden rounded-xl border border-dashed border-border/70 bg-muted/20 p-4 text-center text-xs text-muted-foreground/60 transition-all",
        format === "horizontal" && "min-h-[90px] flex flex-col items-center justify-center",
        format === "rectangle" && "min-h-[250px] flex flex-col items-center justify-center",
        className
      )}
      id={slotId}
      aria-label="Advertisement Space"
    >
      <div className="text-[10px] tracking-wider uppercase opacity-50 mb-1">Sponsored / Ad Placement</div>
      <div className="text-xs text-muted-foreground/40 font-mono">Clean, Non-Intrusive Ad Slot</div>
    </div>
  );
}
