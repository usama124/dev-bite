"use client";

import React from "react";
import { FileUp } from "lucide-react";
import { readTextFileProgressively } from "@/lib/engines/data";

interface FileDropzoneProps {
  accept?: string;
  label?: string;
  multiple?: boolean;
  onTextLoaded?: (text: string, file: File) => void;
  onFilesLoaded?: (items: Array<{ text: string; file: File }>) => void;
  onError?: (message: string) => void;
}

export function FileDropzone({ accept = ".csv,.tsv,.txt,.json,.jsonl", label = "Upload local file", multiple = false, onTextLoaded, onFilesLoaded, onError }: FileDropzoneProps) {
  const [progress, setProgress] = React.useState<number | null>(null);
  const load = async (files: File[]) => {
    if (!files.length) return; setProgress(0);
    try {
      const loaded: Array<{ text: string; file: File }> = [];
      for (let index = 0; index < files.length; index++) { const file = files[index]; const text = await readTextFileProgressively(file, (value) => setProgress(Math.round(((index + value / 100) / files.length) * 100))); loaded.push({ text, file }); }
      if (multiple) onFilesLoaded?.(loaded); else if (loaded[0]) onTextLoaded?.(loaded[0].text, loaded[0].file);
    } catch (reason) { onError?.(reason instanceof Error ? reason.message : "Unable to read the selected file."); }
    finally { setProgress(null); }
  };
  return (
    <label className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md border border-input bg-background/50 px-3 text-xs font-medium transition-colors hover:bg-accent focus-within:ring-2 focus-within:ring-ring">
      <FileUp className="h-3.5 w-3.5" />{progress === null ? label : `Loading ${progress}%`}
      <input type="file" accept={accept} multiple={multiple} className="sr-only" onChange={(event) => { void load(Array.from(event.target.files ?? [])); event.target.value = ""; }} />
      {progress !== null && <span className="sr-only" role="status">Reading local file: {progress}% complete</span>}
    </label>
  );
}
