"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { TOOL_LIMITS } from "@/config/limits";
import { base64ToFile, calculateFileHash, convertFileSize, createDownloadBlob, fileToBase64, formatFileSize, getFileMetadata, safeFilename } from "@/lib/engines/file";
import type { HashAlgorithm } from "@/lib/engines/security/hash";
import { CopyButton } from "../shared/CopyButton";
import { LocalFileWorkspace, type LocalFileOutput } from "../shared/LocalFileWorkspace";

function ResultPanel({ output, placeholder = "Process a local file to see the result." }: { output: string; placeholder?: string }) {
  return <section className="min-w-0 space-y-2"><div className="flex flex-wrap items-center justify-between gap-2"><h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Result</h2><CopyButton textToCopy={output} /></div><pre className="max-h-[440px] min-h-28 overflow-auto whitespace-pre-wrap break-all rounded-xl border border-border/70 bg-muted/10 p-4 font-mono text-xs">{output || placeholder}</pre></section>;
}

function LargeFileWarning({ file }: { file?: File }) {
  return file && file.size >= TOOL_LIMITS.localFileWarningBytes ? <p role="note" className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-3 text-xs text-amber-700 dark:text-amber-300">This is a large browser operation ({formatFileSize(file.size, { base: 1024 })}). Keep this tab open while local processing completes.</p> : null;
}

export function FileHashCalculatorTool() {
  const [files, setFiles] = React.useState<File[]>([]); const [algorithm, setAlgorithm] = React.useState<HashAlgorithm>("SHA-256"); const [output, setOutput] = React.useState(""); const [error, setError] = React.useState(""); const [processing, setProcessing] = React.useState(false); const [progress, setProgress] = React.useState<number | null>(null);
  const reset = () => { setFiles([]); setOutput(""); setError(""); setProgress(null); };
  const process = async () => { const file = files[0]; if (!file) { setError("Choose a file before calculating its hash."); return; } setProcessing(true); setProgress(0); setError(""); try { const hash = await calculateFileHash(file, algorithm, setProgress); setOutput(`${algorithm}\n${hash}`); } catch (reason) { setOutput(""); setError(reason instanceof Error ? reason.message : "Unable to hash this file."); } finally { setProcessing(false); setProgress(null); } };
  const outputBlob = output ? { blob: createDownloadBlob(output, "text/plain;charset=utf-8"), filename: `${safeFilename(files[0]?.name || "file")}.${algorithm.toLowerCase().replace("-", "")}.txt`, label: "Download hash" } : null;
  return <LocalFileWorkspace files={files} onFilesChange={(next) => { setFiles(next); setOutput(""); setError(""); }} onReset={reset} maxSizeBytes={TOOL_LIMITS.localFileMaxBytes} processing={processing} progress={progress} error={error} output={outputBlob}><LargeFileWarning file={files[0]} /><div className="flex flex-wrap items-end gap-3"><label className="text-xs font-medium">Hash algorithm<Select value={algorithm} onChange={(event) => { setAlgorithm(event.target.value as HashAlgorithm); setOutput(""); }} className="mt-1 w-40"><option>MD5</option><option>SHA-1</option><option>SHA-256</option><option>SHA-384</option><option>SHA-512</option></Select></label><Button onClick={() => void process()} disabled={!files.length || processing}>Calculate hash</Button></div><ResultPanel output={output} /></LocalFileWorkspace>;
}

export function FileSizeConverterTool() {
  const [files, setFiles] = React.useState<File[]>([]); const [base, setBase] = React.useState<1000 | 1024>(1024); const [output, setOutput] = React.useState(""); const [error, setError] = React.useState("");
  const process = () => { const file = files[0]; if (!file) { setError("Choose a file before converting its size."); return; } const values = convertFileSize(file.size, base); setOutput(Object.entries(values).map(([unit, value]) => `${unit}: ${Number(value.toFixed(8)).toLocaleString("en-US", { maximumFractionDigits: 8 })}`).join("\n")); setError(""); };
  const outputBlob = output ? { blob: createDownloadBlob(output, "text/plain;charset=utf-8"), filename: `${safeFilename(files[0]?.name || "file")}-sizes.txt`, label: "Download sizes" } : null;
  return <LocalFileWorkspace files={files} onFilesChange={(next) => { setFiles(next); setOutput(""); setError(""); }} onReset={() => { setFiles([]); setOutput(""); setError(""); }} error={error} output={outputBlob} allowEmpty><div className="flex flex-wrap items-end gap-3"><label className="text-xs font-medium">Unit system<Select value={String(base)} onChange={(event) => { setBase(Number(event.target.value) as 1000 | 1024); setOutput(""); }} className="mt-1 w-48"><option value="1024">Binary (KiB, MiB)</option><option value="1000">Decimal (KB, MB)</option></Select></label><Button onClick={process} disabled={!files.length}>Convert size</Button></div><ResultPanel output={output} /></LocalFileWorkspace>;
}

export function FileMetadataViewerTool() {
  const [files, setFiles] = React.useState<File[]>([]); const [includeTimestamp, setIncludeTimestamp] = React.useState(true); const [includeSafeName, setIncludeSafeName] = React.useState(true); const [output, setOutput] = React.useState(""); const [error, setError] = React.useState("");
  const process = () => { const file = files[0]; if (!file) { setError("Choose a file before reading metadata."); return; } const metadata = getFileMetadata(file); if (!includeTimestamp) delete (metadata as Partial<typeof metadata>).lastModified; if (!includeSafeName) delete (metadata as Partial<typeof metadata>).safeName; setOutput(JSON.stringify(metadata, null, 2)); setError(""); };
  const outputBlob = output ? { blob: createDownloadBlob(output, "application/json"), filename: `${safeFilename(files[0]?.name || "file")}-metadata.json`, label: "Download metadata" } : null;
  return <LocalFileWorkspace files={files} onFilesChange={(next) => { setFiles(next); setOutput(""); setError(""); }} onReset={() => { setFiles([]); setOutput(""); setError(""); }} error={error} output={outputBlob} allowEmpty><div className="flex flex-wrap items-center gap-4"><Switch checked={includeTimestamp} onCheckedChange={(value) => { setIncludeTimestamp(value); setOutput(""); }} label="Include modification time" /><Switch checked={includeSafeName} onCheckedChange={(value) => { setIncludeSafeName(value); setOutput(""); }} label="Include safe filename" /><Button onClick={process} disabled={!files.length}>View metadata</Button></div><ResultPanel output={output} /></LocalFileWorkspace>;
}

export function FileToBase64Tool() {
  const [files, setFiles] = React.useState<File[]>([]); const [dataUrl, setDataUrl] = React.useState(false); const [output, setOutput] = React.useState(""); const [error, setError] = React.useState(""); const [processing, setProcessing] = React.useState(false); const [progress, setProgress] = React.useState<number | null>(null);
  const reset = () => { setFiles([]); setOutput(""); setError(""); setProgress(null); };
  const process = async () => { const file = files[0]; if (!file) { setError("Choose a file before encoding it."); return; } setProcessing(true); setProgress(0); setError(""); try { setOutput(await fileToBase64(file, dataUrl, setProgress)); } catch (reason) { setOutput(""); setError(reason instanceof Error ? reason.message : "Unable to encode this file."); } finally { setProcessing(false); setProgress(null); } };
  const outputBlob = output ? { blob: createDownloadBlob(output, "text/plain;charset=utf-8"), filename: `${safeFilename(files[0]?.name || "file")}.base64.txt`, label: "Download Base64" } : null;
  return <LocalFileWorkspace files={files} onFilesChange={(next) => { setFiles(next); setOutput(""); setError(""); }} onReset={reset} maxSizeBytes={TOOL_LIMITS.base64FileMaxBytes} processing={processing} progress={progress} error={error} output={outputBlob}><div className="flex flex-wrap items-center gap-4"><Switch checked={dataUrl} onCheckedChange={(value) => { setDataUrl(value); setOutput(""); }} label="Include Data URL prefix" /><Button onClick={() => void process()} disabled={!files.length || processing}>Encode file</Button></div><ResultPanel output={output} /></LocalFileWorkspace>;
}

export function Base64ToFileTool() {
  const [input, setInput] = React.useState(""); const [filename, setFilename] = React.useState("decoded-file.bin"); const [mimeType, setMimeType] = React.useState("application/octet-stream"); const [output, setOutput] = React.useState<LocalFileOutput | null>(null); const [message, setMessage] = React.useState(""); const [error, setError] = React.useState(""); const [processing, setProcessing] = React.useState(false);
  const reset = () => { setInput(""); setOutput(null); setMessage(""); setError(""); setFilename("decoded-file.bin"); setMimeType("application/octet-stream"); };
  const process = () => { setError(""); setOutput(null); setMessage(""); if (!input.trim()) { setError("Enter Base64 data or a Base64 Data URL."); return; } if (input.length > TOOL_LIMITS.base64InputMaxChars) { setError(`Base64 input exceeds the ${TOOL_LIMITS.base64InputMaxChars.toLocaleString()} character browser limit.`); return; } setProcessing(true); try { const decoded = base64ToFile(input, mimeType.trim() || "application/octet-stream"); const safe = safeFilename(filename, "decoded-file.bin"); setOutput({ blob: decoded.blob, filename: safe, label: "Download decoded file" }); setMessage(`Ready: ${safe}\nMIME type: ${decoded.mimeType}\nSize: ${formatFileSize(decoded.bytes.byteLength, { base: 1024 })}`); } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to decode Base64 data."); } finally { setProcessing(false); } };
  return <LocalFileWorkspace files={[]} onFilesChange={() => undefined} onReset={reset} showPicker={false} processing={processing} error={error} output={output}><div className="grid gap-3 sm:grid-cols-2"><label className="text-xs font-medium">Output filename<Input value={filename} onChange={(event) => { setFilename(event.target.value); setOutput(null); }} className="mt-1" /></label><label className="text-xs font-medium">MIME type<Input value={mimeType} onChange={(event) => { setMimeType(event.target.value); setOutput(null); }} className="mt-1 font-mono" /></label></div><label className="block text-xs font-medium">Base64 or Data URL<Textarea value={input} onChange={(event) => { setInput(event.target.value); setOutput(null); setMessage(""); setError(""); }} className="mt-1 min-h-[280px] font-mono text-xs" spellCheck={false} placeholder="SGVsbG8sIERldkJpdGUh" /></label><Button onClick={process} disabled={processing}>Decode to file</Button><ResultPanel output={message} placeholder="Validated file details will appear here." /></LocalFileWorkspace>;
}
