import React from "react";
import { cn } from "@/lib/utils";

interface ToolWorkspaceProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function ToolWorkspace({ children, className, ...props }: ToolWorkspaceProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/80 bg-card/80 backdrop-blur-xl shadow-glass dark:shadow-glass-dark p-4 sm:p-6 transition-all",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
