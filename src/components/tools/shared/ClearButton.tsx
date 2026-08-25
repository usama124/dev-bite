"use client";

import React from "react";
import { Trash2 } from "lucide-react";
import { Button, ButtonProps } from "@/components/ui/button";

interface ClearButtonProps extends Omit<ButtonProps, "onClick"> {
  onClear: () => void;
  disabled?: boolean;
  label?: string;
}

export function ClearButton({
  onClear,
  disabled = false,
  label = "Clear",
  variant = "ghost",
  size = "sm",
  className,
  ...props
}: ClearButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClear}
      disabled={disabled}
      className={className}
      aria-label={label}
      {...props}
    >
      <Trash2 className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
      <span>{label}</span>
    </Button>
  );
}
