"use client";

import React, { ChangeEvent, useMemo, useState } from "react";
import { Download, Upload } from "lucide-react";
import { decodeBase64, decodeBase64ToBytes, encodeBase64 } from "@/lib/engines/encoding/base64";
import { ToolWorkspace } from "../shared/ToolWorkspace";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "../shared/CopyButton";
import { DownloadButton } from "../shared/DownloadButton";
import { ClearButton } from "../shared/ClearButton";
import { SampleButton } from "../shared/SampleButton";
import { ErrorMessage } from "../shared/ErrorMessage";

type Base64Mode = "decode" | "url-encode" | "url-decode";
const TEXT_SAMPLE = "DevBite encoding tools — 日本語 🚀";
const BASE64_SAMPLE = "RGV2Qml0ZSBlbmNvZGluZyB0b29scyDigJQg5pel5pys6KqeIPCfmoA=";
const BASE64_URL_SAMPLE = "RGV2Qml0ZSBlbmNvZGluZyB0b29scyDigJQg5pel5pys6KqeIPCfmoA";

export function Base64CodecTool({ mode }: { mode: Base64Mode }) {
  const isEncode = mode === "url-encode";
  const isUrlSafe = mode !== "decode";
  const sample = isEncode ? TEXT_SAMPLE : isUrlSafe ? BASE64_URL_SAMPLE : BASE64_SAMPLE;
  const [input, setInput] = useState(sample);
  const [fileBytes, setFileBytes] = useState<Uint8Array | null>(null);
  const [fileName, setFileName] = useState("");
  const [padding, setPadding] = useState(false);
  const [lineWrap, setLineWrap] = useState(0);
  const [outputMode, setOutputMode] = useState<"text" | "binary">("text");

  const result = useMemo(() => {
    if (isEncode) {
      const encoded = encodeBase64(fileBytes ?? input, { urlSafe: true, padding, lineWrap });
      return { success: encoded.success, output: encoded.output, bytes: new Uint8Array(), error: encoded.error, byteSize: encoded.byteSize };
    }
    const decoded = decodeBase64(input, { urlSafe: isUrlSafe });
    const binary = decodeBase64ToBytes(input);
    const bytes = binary.success ? binary.bytes : new Uint8Array();
    const output = outputMode === "binary"
      ? Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join(" ")
      : decoded.output;
    return { success: decoded.success && binary.success, output, bytes, error: decoded.error ?? binary.error, byteSize: bytes.length };
  }, [fileBytes, input, isEncode, isUrlSafe, lineWrap, outputMode, padding]);

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (isEncode) setFileBytes(new Uint8Array(reader.result as ArrayBuffer));
      else { setFileBytes(null); setInput(String(reader.result ?? "")); }
    };
    if (isEncode) reader.readAsArrayBuffer(file); else reader.readAsText(file);
    event.target.value = "";
  };

  const downloadBinary = () => {
    if (!result.bytes.length) return;
    const blob = new Blob([result.bytes.slice().buffer as ArrayBuffer]);
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName ? fileName.replace(/\.(b64|base64|txt)$/i, "") || "decoded.bin" : "decoded.bin";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const loadSample = () => { setInput(sample); setFileBytes(null); setFileName(""); };
  const clear = () => { setInput(""); setFileBytes(null); setFileName(""); };

  return (
    <ToolWorkspace className="space-y-5">
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border/50 bg-muted/20 p-4">
        {isEncode ? <><Switch id="base64url-padding" checked={padding} onCheckedChange={setPadding} label="Include padding (=)" /><label className="flex items-center gap-2 text-xs text-muted-foreground">Line wrap<Select value={lineWrap} onChange={(event) => setLineWrap(Number(event.target.value))} className="h-8 w-28 text-xs"><option value={0}>None</option><option value={64}>64 chars</option><option value={76}>76 chars</option></Select></label></> : <label className="flex items-center gap-2 text-xs text-muted-foreground">Output mode<Select value={outputMode} onChange={(event) => setOutputMode(event.target.value as "text" | "binary")} className="h-8 w-36 text-xs"><option value="text">UTF-8 text</option><option value="binary">Binary bytes</option></Select></label>}
        <span className="ml-auto text-xs text-muted-foreground">{isUrlSafe ? "Base64URL alphabet (- and _)" : "Standard and URL-safe alphabets accepted"}</span>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2"><span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{isEncode ? "UTF-8 text or file" : "Base64 input"}</span><div className="flex gap-1"><label className="inline-flex h-8 cursor-pointer items-center rounded-md border border-input bg-background/50 px-3 text-xs font-medium hover:bg-accent"><Upload className="mr-1.5 h-3.5 w-3.5" />Upload<input type="file" onChange={handleFile} accept={isEncode ? undefined : ".txt,.b64,.base64,text/plain"} className="sr-only" /></label><SampleButton onLoadSample={loadSample} /><ClearButton onClear={clear} disabled={!input && !fileBytes} /></div></div>
          {isEncode && fileBytes ? <div className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/70 bg-muted/10 p-6 text-center"><Upload className="mb-3 h-8 w-8 text-primary" /><p className="font-semibold">{fileName}</p><p className="mt-1 text-xs text-muted-foreground">{fileBytes.length.toLocaleString()} bytes loaded locally</p><Button variant="outline" size="sm" className="mt-4" onClick={clear}>Remove file</Button></div> : <Textarea value={input} onChange={(event) => { setInput(event.target.value); setFileBytes(null); setFileName(""); }} className="min-h-[320px] font-mono text-xs" spellCheck={false} />}
        </div>
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2"><span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{isEncode ? "Base64URL output" : outputMode === "binary" ? `Decoded bytes · ${result.byteSize}` : "Decoded UTF-8 text"}</span><div className="flex gap-1"><CopyButton textToCopy={result.output} label="Copy" />{!isEncode && outputMode === "binary" ? <Button variant="outline" size="sm" onClick={downloadBinary} disabled={!result.bytes.length}><Download className="mr-1.5 h-3.5 w-3.5" />Download binary</Button> : <DownloadButton content={result.output} filename={isEncode ? "encoded-base64url.txt" : "decoded-base64.txt"} label="Download" />}</div></div>
          {!result.success ? <ErrorMessage title="Base64 Error" message={result.error ?? "Unable to process input."} /> : <Textarea value={result.output} readOnly className="min-h-[320px] bg-muted/10 font-mono text-xs" spellCheck={false} />}
        </div>
      </div>
    </ToolWorkspace>
  );
}
