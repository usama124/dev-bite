"use client";

import React, { useMemo, useState } from "react";
import { Link2 } from "lucide-react";
import { parseUrl } from "@/lib/engines/developer/url-parser";
import { ToolWorkspace } from "../shared/ToolWorkspace";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { CopyButton } from "../shared/CopyButton";
import { ClearButton } from "../shared/ClearButton";
import { SampleButton } from "../shared/SampleButton";
import { ErrorMessage } from "../shared/ErrorMessage";

const SAMPLE = "https://alice:secret@example.com:8443/api/users/42?active=true&tag=dev%20tools&tag=json#profile";

export function UrlParserTool() {
  const [input, setInput] = useState(SAMPLE);
  const [decode, setDecode] = useState(true);
  const result = useMemo(() => parseUrl(input, decode), [decode, input]);
  const output = result.success ? JSON.stringify({ ...result.components, queryParameters: result.query }, null, 2) : "";

  return (
    <ToolWorkspace className="space-y-5">
      <div className="space-y-2">
        <div className="flex items-center justify-between"><label htmlFor="url-input" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Absolute URL</label><div className="flex gap-1"><SampleButton onLoadSample={() => setInput(SAMPLE)} /><ClearButton onClear={() => setInput("")} disabled={!input} /></div></div>
        <div className="relative"><Link2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input id="url-input" value={input} onChange={(event) => setInput(event.target.value)} className="pl-9 font-mono" placeholder="https://example.com/path?key=value#section" spellCheck={false} /></div>
      </div>
      <div className="flex items-center justify-between"><Switch id="url-decode" checked={decode} onCheckedChange={setDecode} label="Decode percent-encoded components" /><CopyButton textToCopy={output} label="Copy as JSON" /></div>
      {!result.success ? <ErrorMessage title="URL Parse Error" message={result.error ?? "Invalid URL."} /> : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="overflow-hidden rounded-xl border border-border/70">
            <div className="bg-muted/30 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">URL components</div>
            <dl className="divide-y divide-border/50">{Object.entries(result.components ?? {}).map(([key, value]) => <div key={key} className="grid grid-cols-[110px_1fr] gap-3 px-4 py-2.5 text-xs"><dt className="font-semibold text-muted-foreground">{key}</dt><dd className="break-all font-mono">{value || "—"}</dd></div>)}</dl>
          </div>
          <div className="overflow-hidden rounded-xl border border-border/70">
            <div className="bg-muted/30 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Query parameters · {result.query?.length ?? 0}</div>
            <div className="divide-y divide-border/50">{result.query?.length ? result.query.map((parameter, index) => <div key={`${parameter.key}-${index}`} className="grid grid-cols-2 gap-3 px-4 py-2.5 text-xs"><code className="break-all font-semibold text-primary">{parameter.key}</code><code className="break-all">{parameter.value}</code></div>) : <p className="p-6 text-center text-xs text-muted-foreground">No query parameters.</p>}</div>
          </div>
        </div>
      )}
    </ToolWorkspace>
  );
}
