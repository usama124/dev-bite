"use client";

import React, { useMemo, useState } from "react";
import { decodeHtmlEntities, encodeHtmlEntities, HtmlEntityStyle } from "@/lib/engines/encoding/html-entities";
import { ToolWorkspace } from "../shared/ToolWorkspace";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "../shared/CopyButton";
import { DownloadButton } from "../shared/DownloadButton";
import { ClearButton } from "../shared/ClearButton";
import { SampleButton } from "../shared/SampleButton";
import { ErrorMessage } from "../shared/ErrorMessage";

const PLAIN_SAMPLE = `<section class="notice">Tom & Jerry's © 2026 — "DevBite"</section>`;
const ENTITY_SAMPLE = `&lt;section class=&quot;notice&quot;&gt;Tom &amp; Jerry&apos;s &copy; 2026 &mdash; &quot;DevBite&quot;&lt;/section&gt;`;

export function HtmlEntityTool({ operation }: { operation: "encode" | "decode" }) {
  const [input, setInput] = useState(operation === "encode" ? PLAIN_SAMPLE : ENTITY_SAMPLE);
  const [style, setStyle] = useState<HtmlEntityStyle>("named");
  const [encodeNonAscii, setEncodeNonAscii] = useState(false);
  const [strict, setStrict] = useState(false);
  const result = useMemo(() => operation === "encode"
    ? { success: true, output: encodeHtmlEntities(input, style, encodeNonAscii) }
    : decodeHtmlEntities(input, strict), [encodeNonAscii, input, operation, strict, style]);
  const sample = operation === "encode" ? PLAIN_SAMPLE : ENTITY_SAMPLE;

  return (
    <ToolWorkspace className="space-y-5">
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border/50 bg-muted/20 p-4">
        {operation === "encode" ? <><label className="flex items-center gap-2 text-xs text-muted-foreground">Entity style<Select value={style} onChange={(event) => setStyle(event.target.value as HtmlEntityStyle)} className="h-8 w-44 text-xs"><option value="named">Named when available</option><option value="decimal">Numeric decimal</option><option value="hexadecimal">Numeric hexadecimal</option></Select></label><Switch id="html-non-ascii" checked={encodeNonAscii} onCheckedChange={setEncodeNonAscii} label="Encode non-ASCII characters" /></> : <Switch id="html-strict" checked={strict} onCheckedChange={setStrict} label="Strict known-entity validation" />}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-2"><div className="flex items-center justify-between"><span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{operation === "encode" ? "HTML or plain text" : "HTML entities"}</span><div className="flex gap-1"><SampleButton onLoadSample={() => setInput(sample)} /><ClearButton onClear={() => setInput("")} disabled={!input} /></div></div><Textarea value={input} onChange={(event) => setInput(event.target.value)} className="min-h-[340px] font-mono text-xs" spellCheck={false} /></div>
        <div className="space-y-2"><div className="flex items-center justify-between"><span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{operation === "encode" ? "Encoded entities" : "Decoded text"}</span><div className="flex gap-1"><CopyButton textToCopy={result.output} label="Copy" /><DownloadButton content={result.output} filename={`html-${operation}d.txt`} label="Download" /></div></div>{result.success ? <Textarea value={result.output} readOnly className="min-h-[340px] bg-muted/10 font-mono text-xs" /> : <ErrorMessage title="HTML Entity Error" message={result.error ?? "Unable to process entities."} />}</div>
      </div>
      <p className="text-xs text-muted-foreground">This tool transforms text only. It does not render or execute supplied HTML.</p>
    </ToolWorkspace>
  );
}
