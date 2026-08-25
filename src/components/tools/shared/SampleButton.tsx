"use client";

import React from "react";
import { FileText } from "lucide-react";
import { Button, ButtonProps } from "@/components/ui/button";

interface SampleButtonProps extends Omit<ButtonProps, "onClick"> {
  onLoadSample: () => void;
  label?: string;
}

export function SampleButton({
  onLoadSample,
  label = "Sample Data",
  variant = "ghost",
  size = "sm",
  className,
  ...props
}: SampleButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onLoadSample}
      className={className}
      aria-label={label}
      {...props}
    >
      <FileText className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
      <span>{label}</span>
    </Button>
  );
}
