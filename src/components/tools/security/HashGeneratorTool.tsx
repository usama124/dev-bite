"use client";

import React from "react";
import { HashAlgorithm, hashText } from "@/lib/engines/security";
import { ToolWorkspace } from "../shared/ToolWorkspace";
import { PrivacyNotice } from "../shared/PrivacyNotice";
import { CopyButton } from "../shared/CopyButton";
import { DownloadButton } from "../shared/DownloadButton";
import { ClearButton } from "../shared/ClearButton";
import { SampleButton } from "../shared/SampleButton";
import { ErrorMessage } from "../shared/ErrorMessage";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";

const algorithms: HashAlgorithm[] = ["MD5", "SHA-1", "SHA-256", "SHA-384", "SHA-512"];
export function HashGeneratorTool() {
  const [input, setInput] = React.useState("DevBite"); const [algorithm, setAlgorithm] = React.useState<HashAlgorithm>("SHA-256"); const [output, setOutput] = React.useState(""); const [error, setError] = React.useState("");
  React.useEffect(() => { let active = true; if (!input) { setOutput(""); setError(""); return; } hashText(input, algorithm).then((value) => { if (active) { setOutput(value); setError(""); } }).catch((reason) => { if (active) { setOutput(""); setError(reason instanceof Error ? reason.message : "Hashing failed."); } }); return () => { active = false; }; }, [algorithm, input]);
  return <ToolWorkspace className="space-y-5"><PrivacyNotice cryptographic /><div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 text-xs text-amber-700 dark:text-amber-300"><strong>Hashing is one-way and is not encryption.</strong> MD5 and SHA-1 are included for compatibility checks, not for new security designs.</div><div className="flex flex-wrap items-center gap-2"><label className="text-xs font-semibold">Algorithm <Select value={algorithm} onChange={(event) => setAlgorithm(event.target.value as HashAlgorithm)} className="ml-2 h-8 w-32 text-xs">{algorithms.map((item) => <option key={item}>{item}</option>)}</Select></label><div className="ml-auto flex gap-1"><SampleButton onLoadSample={() => setInput("DevBite")} /><ClearButton onClear={() => setInput("")} disabled={!input} /></div></div><Textarea value={input} onChange={(event) => setInput(event.target.value)} className="min-h-48 font-mono text-xs" placeholder="Enter text to hash" />{error ? <ErrorMessage title="Hash Error" message={error} /> : <div className="space-y-2"><div className="flex justify-between gap-2"><span className="text-xs font-semibold uppercase text-muted-foreground">{algorithm} hash</span><div className="flex gap-1"><CopyButton textToCopy={output} /><DownloadButton content={output} filename={`${algorithm.toLowerCase()}-hash.txt`} /></div></div><pre className="overflow-auto break-all whitespace-pre-wrap rounded-xl border border-border/70 bg-muted/10 p-4 font-mono text-xs">{output || "Hash output will appear here."}</pre></div>}</ToolWorkspace>;
}
