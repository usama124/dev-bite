"use client";

import React from "react";
import { FileUp } from "lucide-react";

interface FileDropzoneProps {
  accept?: string;
  label?: string;
  onTextLoaded: (text: string, file: File) => void;
}

export function FileDropzone({ accept = ".csv,.tsv,.txt,.json,.jsonl", label = "Upload local file", onTextLoaded }: FileDropzoneProps) {
  const load = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onTextLoaded(String(reader.result ?? ""), file);
    reader.readAsText(file);
  };
  return (
    <label className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md border border-input bg-background/50 px-3 text-xs font-medium transition-colors hover:bg-accent focus-within:ring-2 focus-within:ring-ring">
      <FileUp className="h-3.5 w-3.5" />{label}
      <input type="file" accept={accept} className="sr-only" onChange={(event) => { load(event.target.files?.[0]); event.target.value = ""; }} />
    </label>
  );
}
