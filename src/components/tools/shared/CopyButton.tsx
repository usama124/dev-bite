"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button, ButtonProps } from "@/components/ui/button";
import { copyToClipboard } from "@/lib/utils";

interface CopyButtonProps extends Omit<ButtonProps, "onClick"> {
  textToCopy: string;
  label?: string;
  copiedLabel?: string;
}

export function CopyButton({
  textToCopy,
  label = "Copy",
  copiedLabel = "Copied!",
  variant = "outline",
  size = "sm",
  className,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!textToCopy) return;
    const success = await copyToClipboard(textToCopy);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCopy}
      disabled={!textToCopy}
      className={className}
      aria-label={copied ? copiedLabel : label}
      {...props}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-emerald-500 mr-1.5" />
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
            {copiedLabel}
          </span>
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
          <span>{label}</span>
        </>
      )}
    </Button>
  );
}
