"use client";

import * as React from "react";
import { Download, File, FileUp, RotateCcw, ShieldCheck, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TOOL_LIMITS } from "@/config/limits";
import { downloadBlob, formatFileSize, validateFile } from "@/lib/engines/file";
import { cn } from "@/lib/utils";
import { ToolWorkspace } from "./ToolWorkspace";

export interface LocalFileOutput {
  blob: Blob;
  filename: string;
  label?: string;
}

interface LocalFileWorkspaceProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  onReset: () => void;
  allowedTypes?: string[];
  maxSizeBytes?: number;
  maxFiles?: number;
  multiple?: boolean;
  allowEmpty?: boolean;
  showPicker?: boolean;
  pickerLabel?: string;
  processing?: boolean;
  progress?: number | null;
  error?: string;
  output?: LocalFileOutput | null;
  renderPreview?: (files: File[]) => React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function LocalFileWorkspace({ files, onFilesChange, onReset, allowedTypes, maxSizeBytes = TOOL_LIMITS.localFileMaxBytes, maxFiles = 1, multiple = false, allowEmpty = false, showPicker = true, pickerLabel = "Choose local file", processing = false, progress = null, error, output, renderPreview, children, className }: LocalFileWorkspaceProps) {
  const [validationError, setValidationError] = React.useState(""); const [dragging, setDragging] = React.useState(false); const inputRef = React.useRef<HTMLInputElement>(null);
  const selectFiles = (selected: File[]) => {
    setValidationError("");
    if (!multiple && selected.length > 1) { setValidationError("Select only one file for this tool."); return; }
    if (selected.length > maxFiles) { setValidationError(`Select no more than ${maxFiles} file${maxFiles === 1 ? "" : "s"}.`); return; }
    const invalid = selected.map((file) => ({ file, result: validateFile(file, { allowedTypes, maxSizeBytes, allowEmpty }) })).find((item) => !item.result.valid);
    if (invalid) { setValidationError(`${invalid.file.name}: ${invalid.result.errors.join(" ")}`); return; }
    onFilesChange(selected);
  };
  const reset = () => { setValidationError(""); setDragging(false); if (inputRef.current) inputRef.current.value = ""; onReset(); };
  const visibleError = validationError || error;
  return <ToolWorkspace className={cn("space-y-5", className)}>
    <div role="note" className="flex gap-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3 text-xs leading-relaxed text-emerald-700 dark:text-emerald-300"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" /><p><strong>Processed locally:</strong> Selected files stay in this browser tab and are not uploaded to DevBite servers.</p></div>
    {showPicker && <div onDragEnter={(event) => { event.preventDefault(); setDragging(true); }} onDragOver={(event) => event.preventDefault()} onDragLeave={(event) => { if (event.currentTarget === event.target) setDragging(false); }} onDrop={(event) => { event.preventDefault(); setDragging(false); selectFiles(Array.from(event.dataTransfer.files)); }} className={cn("rounded-2xl border-2 border-dashed p-6 text-center transition-colors sm:p-8", dragging ? "border-primary bg-primary/5" : "border-border/70 bg-muted/10")}>
      <FileUp className="mx-auto h-8 w-8 text-primary" /><p className="mt-3 text-sm font-semibold">Drop {multiple ? "files" : "a file"} here</p><p className="mt-1 text-xs text-muted-foreground">Maximum {formatFileSize(maxSizeBytes, { base: 1024 })} per file{allowedTypes?.length ? ` · ${allowedTypes.join(", ")}` : ""}</p>
      <label className="mt-4 inline-flex cursor-pointer items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">{pickerLabel}<input ref={inputRef} type="file" accept={allowedTypes?.join(",")} multiple={multiple} className="sr-only" onChange={(event) => { selectFiles(Array.from(event.target.files ?? [])); event.target.value = ""; }} /></label>
    </div>}
    {files.length > 0 && <section aria-label="Selected file details" className="space-y-2"><h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Selected {files.length === 1 ? "file" : "files"}</h2><div className="grid gap-2 sm:grid-cols-2">{files.map((file, index) => <div key={`${file.name}-${file.lastModified}-${index}`} className="flex min-w-0 items-center gap-3 rounded-xl border border-border/60 bg-muted/15 p-3"><File className="h-5 w-5 shrink-0 text-primary" /><div className="min-w-0"><p className="truncate text-sm font-medium" title={file.name}>{file.name}</p><p className="text-xs text-muted-foreground">{file.type || "Unknown MIME"} · {formatFileSize(file.size, { base: 1024 })}</p></div></div>)}</div></section>}
    {renderPreview && files.length > 0 ? renderPreview(files) : null}
    {children}
    {processing && <div aria-live="polite" role="status" className="space-y-1"><div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary transition-[width]" style={{ width: `${Math.max(2, progress ?? 0)}%` }} /></div><p className="text-xs text-muted-foreground">Processing locally{progress === null ? "…" : `: ${progress}%`}</p></div>}
    {visibleError && <div role="alert" className="flex gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"><TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" /><span>{visibleError}</span></div>}
    <div className="flex flex-wrap gap-2"><Button type="button" variant="outline" onClick={reset} disabled={processing || (!files.length && !visibleError && !output)}><RotateCcw className="mr-1.5 h-4 w-4" />Reset</Button>{output && <Button type="button" onClick={() => downloadBlob(output.blob, output.filename)} disabled={processing}><Download className="mr-1.5 h-4 w-4" />{output.label || "Download output"}</Button>}</div>
  </ToolWorkspace>;
}
