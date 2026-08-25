"use client";

import React from "react";
import { Download } from "lucide-react";
import { Button, ButtonProps } from "@/components/ui/button";
import { downloadTextFile } from "@/lib/utils";

interface DownloadButtonProps extends Omit<ButtonProps, "onClick"> {
  content: string;
  filename: string;
  mimeType?: string;
  label?: string;
}

export function DownloadButton({
  content,
  filename,
  mimeType = "text/plain;charset=utf-8",
  label = "Download",
  variant = "outline",
  size = "sm",
  className,
  ...props
}: DownloadButtonProps) {
  const handleDownload = () => {
    if (!content) return;
    downloadTextFile(filename, content, mimeType);
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleDownload}
      disabled={!content}
      className={className}
      aria-label={label}
      {...props}
    >
      <Download className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
      <span>{label}</span>
    </Button>
  );
}
