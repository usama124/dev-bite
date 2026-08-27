"use client";

import React from "react";
import { decodeJwt } from "@/lib/engines/security";
import { ToolWorkspace } from "../shared/ToolWorkspace";
import { PrivacyNotice } from "../shared/PrivacyNotice";
import { CopyButton } from "../shared/CopyButton";
import { ClearButton } from "../shared/ClearButton";
import { SampleButton } from "../shared/SampleButton";
import { ErrorMessage } from "../shared/ErrorMessage";
import { Textarea } from "@/components/ui/textarea";

const sample = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJuYW1lIjoiVXNhbWEiLCJpYXQiOjE3MDAwMDAwMDB9.demo-signature";
export function JwtDecoderTool() {
  const [token, setToken] = React.useState(sample); const result = React.useMemo(() => decodeJwt(token), [token]); const output = result.error ? "" : JSON.stringify({ header: result.header, payload: result.payload, signature: result.signature, issuedAt: result.issuedAt, expiresAt: result.expiresAt }, null, 2);
  return <ToolWorkspace className="space-y-5"><PrivacyNotice /><div role="note" className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-700 dark:text-amber-300"><strong>Decoding does not verify the JWT signature.</strong> Treat claims as untrusted until signature verification succeeds in an appropriate validator.</div><div className="flex flex-wrap justify-between gap-2"><span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">JWT input</span><div className="flex gap-1"><SampleButton onLoadSample={() => setToken(sample)} /><ClearButton onClear={() => setToken("")} disabled={!token} /></div></div><Textarea value={token} onChange={(event) => setToken(event.target.value)} className="min-h-36 font-mono text-xs" spellCheck={false} />{token && result.error ? <ErrorMessage title="Invalid JWT" message={result.error} /> : <div className="grid gap-4 lg:grid-cols-2"><section className="space-y-2"><div className="flex justify-between"><h3 className="text-xs font-semibold uppercase text-muted-foreground">Header</h3><CopyButton textToCopy={JSON.stringify(result.header, null, 2)} /></div><pre className="min-h-40 overflow-auto rounded-xl border border-border/70 bg-muted/10 p-4 font-mono text-xs">{result.header ? JSON.stringify(result.header, null, 2) : "Decoded header"}</pre></section><section className="space-y-2"><div className="flex justify-between"><h3 className="text-xs font-semibold uppercase text-muted-foreground">Payload & claims</h3><CopyButton textToCopy={output} /></div><pre className="min-h-40 overflow-auto rounded-xl border border-border/70 bg-muted/10 p-4 font-mono text-xs">{result.payload ? JSON.stringify(result.payload, null, 2) : "Decoded payload"}</pre>{(result.issuedAt || result.expiresAt) && <p className="text-xs text-muted-foreground">Issued: {result.issuedAt ?? "not provided"} · Expires: {result.expiresAt ?? "not provided"}</p>}</section></div>}</ToolWorkspace>;
}
