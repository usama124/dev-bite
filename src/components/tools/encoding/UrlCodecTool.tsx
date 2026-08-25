"use client";

import React, { useMemo, useState } from "react";
import { decodeUrl, encodeUrl, UrlCodecMode } from "@/lib/engines/encoding/url-codec";
import { ToolWorkspace } from "../shared/ToolWorkspace";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "../shared/CopyButton";
import { DownloadButton } from "../shared/DownloadButton";
import { ClearButton } from "../shared/ClearButton";
import { SampleButton } from "../shared/SampleButton";
import { ErrorMessage } from "../shared/ErrorMessage";

const PLAIN_SAMPLE = "https://devbite.tools/search?q=JSON tools&language=日本語#results";
const ENCODED_SAMPLE = "https://devbite.tools/search?q=JSON%20tools&language=%E6%97%A5%E6%9C%AC%E8%AA%9E#results";

export function UrlCodecTool({ operation }: { operation: "encode" | "decode" }) {
  const [input, setInput] = useState(operation === "encode" ? PLAIN_SAMPLE : ENCODED_SAMPLE);
  const [mode, setMode] = useState<UrlCodecMode>("full-url");
  const [plusAsSpace, setPlusAsSpace] = useState(false);
  const result = useMemo(() => operation === "encode" ? encodeUrl(input, mode) : decodeUrl(input, mode, plusAsSpace), [input, mode, operation, plusAsSpace]);
  const sample = operation === "encode" ? PLAIN_SAMPLE : ENCODED_SAMPLE;

  return (
    <ToolWorkspace className="space-y-5">
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border/50 bg-muted/20 p-4">
        <label className="flex items-center gap-2 text-xs text-muted-foreground">Encoding scope<Select value={mode} onChange={(event) => setMode(event.target.value as UrlCodecMode)} className="h-8 w-52 text-xs"><option value="component">URL component / parameter</option><option value="full-url">Complete URL</option></Select></label>
        {operation === "decode" && <Switch id="url-plus-space" checked={plusAsSpace} onCheckedChange={setPlusAsSpace} label="Decode + as a space" />}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-2"><div className="flex items-center justify-between"><span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{operation === "encode" ? "Plain text or URL" : "Percent-encoded input"}</span><div className="flex gap-1"><SampleButton onLoadSample={() => setInput(sample)} /><ClearButton onClear={() => setInput("")} disabled={!input} /></div></div><Textarea value={input} onChange={(event) => setInput(event.target.value)} className="min-h-[340px] font-mono text-xs" spellCheck={false} /></div>
        <div className="space-y-2"><div className="flex items-center justify-between"><span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{operation === "encode" ? "Percent-encoded output" : "Decoded output"}</span><div className="flex gap-1"><CopyButton textToCopy={result.output} label="Copy" /><DownloadButton content={result.output} filename={`url-${operation}d.txt`} label="Download" /></div></div>{result.success ? <Textarea value={result.output} readOnly className="min-h-[340px] bg-muted/10 font-mono text-xs" /> : <ErrorMessage title="URL Encoding Error" message={result.error ?? "Unable to process input."} />}</div>
      </div>
      <p className="text-xs text-muted-foreground">Component mode encodes reserved URL characters. Complete URL mode preserves structural characters such as <code>:/?#[]@</code>.</p>
    </ToolWorkspace>
  );
}
