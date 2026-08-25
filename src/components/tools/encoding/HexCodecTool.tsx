"use client";

import React, { ChangeEvent, useMemo, useState } from "react";
import { Download, Upload } from "lucide-react";
import { decodeHex, encodeHex } from "@/lib/engines/encoding/hex";
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

const TEXT_SAMPLE = "DevBite Hex — UTF-8 🚀";
const HEX_SAMPLE = "44 65 76 42 69 74 65 20 48 65 78 20 e2 80 94 20 55 54 46 2d 38 20 f0 9f 9a 80";

export function HexCodecTool({ operation }: { operation: "encode" | "decode" }) {
  const [input, setInput] = useState(operation === "encode" ? TEXT_SAMPLE : HEX_SAMPLE);
  const [fileBytes, setFileBytes] = useState<Uint8Array | null>(null);
  const [fileName, setFileName] = useState("");
  const [uppercase, setUppercase] = useState(false);
  const [separator, setSeparator] = useState<"" | " " | ":" | "-">(" ");
  const [strictUtf8, setStrictUtf8] = useState(false);
  const [outputMode, setOutputMode] = useState<"text" | "binary">("text");
  const result = useMemo(() => {
    if (operation === "encode") return { success: true, output: encodeHex(fileBytes ?? input, { uppercase, separator }), bytes: new Uint8Array(), error: undefined };
    const decoded = decodeHex(input, strictUtf8);
    return { ...decoded, output: outputMode === "binary" && decoded.success ? Array.from(decoded.bytes, (byte) => byte.toString(16).padStart(2, "0")).join(" ") : decoded.output };
  }, [fileBytes, input, operation, outputMode, separator, strictUtf8, uppercase]);
  const sample = operation === "encode" ? TEXT_SAMPLE : HEX_SAMPLE;

  const handleFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => setFileBytes(new Uint8Array(reader.result as ArrayBuffer));
    reader.readAsArrayBuffer(file);
    event.target.value = "";
  };
  const clear = () => { setInput(""); setFileBytes(null); setFileName(""); };
  const downloadBinary = () => {
    if (!result.bytes.length) return;
    const blob = new Blob([result.bytes.slice().buffer as ArrayBuffer]);
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "decoded.bin";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolWorkspace className="space-y-5">
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border/50 bg-muted/20 p-4">
        {operation === "encode" ? <><Switch id="hex-uppercase" checked={uppercase} onCheckedChange={setUppercase} label="Uppercase A–F" /><label className="flex items-center gap-2 text-xs text-muted-foreground">Byte grouping<Select value={separator} onChange={(event) => setSeparator(event.target.value as "" | " " | ":" | "-")} className="h-8 w-36 text-xs"><option value="">None</option><option value=" ">Spaces</option><option value=":">Colons</option><option value="-">Hyphens</option></Select></label></> : <><Switch id="hex-strict" checked={strictUtf8} onCheckedChange={setStrictUtf8} label="Require valid UTF-8" /><label className="flex items-center gap-2 text-xs text-muted-foreground">Output mode<Select value={outputMode} onChange={(event) => setOutputMode(event.target.value as "text" | "binary")} className="h-8 w-36 text-xs"><option value="text">UTF-8 text</option><option value="binary">Binary bytes</option></Select></label></>}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2"><span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{operation === "encode" ? "UTF-8 text or file" : "Hexadecimal input"}</span><div className="flex gap-1">{operation === "encode" && <label className="inline-flex h-8 cursor-pointer items-center rounded-md border border-input bg-background/50 px-3 text-xs font-medium hover:bg-accent"><Upload className="mr-1.5 h-3.5 w-3.5" />Upload<input type="file" onChange={handleFile} className="sr-only" /></label>}<SampleButton onLoadSample={() => { setInput(sample); setFileBytes(null); setFileName(""); }} /><ClearButton onClear={clear} disabled={!input && !fileBytes} /></div></div>
          {operation === "encode" && fileBytes ? <div className="flex min-h-[320px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/70 bg-muted/10 p-6 text-center"><Upload className="mb-3 h-8 w-8 text-primary" /><p className="font-semibold">{fileName}</p><p className="mt-1 text-xs text-muted-foreground">{fileBytes.length.toLocaleString()} bytes loaded locally</p><Button variant="outline" size="sm" className="mt-4" onClick={clear}>Remove file</Button></div> : <Textarea value={input} onChange={(event) => { setInput(event.target.value); setFileBytes(null); setFileName(""); }} className="min-h-[320px] font-mono text-xs" spellCheck={false} />}
        </div>
        <div className="space-y-2"><div className="flex flex-wrap items-center justify-between gap-2"><span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{operation === "encode" ? "Hex output" : outputMode === "binary" ? `Decoded bytes · ${result.bytes.length}` : "Decoded UTF-8 text"}</span><div className="flex gap-1"><CopyButton textToCopy={result.output} label="Copy" />{operation === "decode" && outputMode === "binary" ? <Button variant="outline" size="sm" onClick={downloadBinary} disabled={!result.bytes.length}><Download className="mr-1.5 h-3.5 w-3.5" />Download binary</Button> : <DownloadButton content={result.output} filename={operation === "encode" ? "encoded-hex.txt" : "decoded-hex.txt"} label="Download" />}</div></div>{result.success ? <Textarea value={result.output} readOnly className="min-h-[320px] bg-muted/10 font-mono text-xs" /> : <ErrorMessage title="Hexadecimal Error" message={result.error ?? "Unable to process hexadecimal input."} />}</div>
      </div>
      <p className="text-xs text-muted-foreground">Hex decoding accepts compact values and bytes separated by spaces, colons, hyphens, or line breaks.</p>
    </ToolWorkspace>
  );
}
