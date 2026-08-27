"use client";

import React from "react";
import { RefreshCw } from "lucide-react";
import { generateSecrets, SecretFormat } from "@/lib/engines/security";
import { ToolWorkspace } from "../shared/ToolWorkspace";
import { PrivacyNotice } from "../shared/PrivacyNotice";
import { CopyButton } from "../shared/CopyButton";
import { DownloadButton } from "../shared/DownloadButton";
import { ErrorMessage } from "../shared/ErrorMessage";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function SecretTokenGeneratorTool() {
  const [length, setLength] = React.useState(32); const [count, setCount] = React.useState(5); const [format, setFormat] = React.useState<SecretFormat>("base64url"); const [generation, setGeneration] = React.useState(0);
  const result = React.useMemo(() => { void generation; try { return { output: generateSecrets(length, count, format).join("\n") }; } catch (error) { return { output: "", error: error instanceof Error ? error.message : "Unable to generate secrets." }; } }, [count, format, generation, length]);
  return <ToolWorkspace className="space-y-5"><PrivacyNotice cryptographic /><div className="grid gap-4 rounded-xl border border-border/60 bg-muted/20 p-4 sm:grid-cols-3"><label className="space-y-1 text-xs font-medium">Length (bytes/characters)<Input type="number" min={1} max={65536} value={length} onChange={(event) => setLength(Number(event.target.value))} /></label><label className="space-y-1 text-xs font-medium">Count<Input type="number" min={1} max={100} value={count} onChange={(event) => setCount(Number(event.target.value))} /></label><label className="space-y-1 text-xs font-medium">Format<Select value={format} onChange={(event) => setFormat(event.target.value as SecretFormat)}><option value="hex">Hex</option><option value="base64">Base64</option><option value="base64url">Base64URL</option><option value="alphanumeric">Alphanumeric</option><option value="url-safe">URL-safe</option></Select></label></div>{result.error ? <ErrorMessage title="Generation Error" message={result.error} /> : <div className="space-y-2"><div className="flex flex-wrap justify-between gap-2"><span className="text-xs font-semibold uppercase text-muted-foreground">Generated secrets</span><div className="flex flex-wrap gap-1"><Button size="sm" onClick={() => setGeneration((value) => value + 1)}><RefreshCw className="mr-1.5 h-3.5 w-3.5" />Generate new</Button><CopyButton textToCopy={result.output} /><DownloadButton content={result.output} filename="secure-tokens.txt" /></div></div><pre className="min-h-48 overflow-auto whitespace-pre-wrap break-all rounded-xl border border-border/70 bg-muted/10 p-4 font-mono text-xs leading-7">{result.output}</pre></div>}</ToolWorkspace>;
}
