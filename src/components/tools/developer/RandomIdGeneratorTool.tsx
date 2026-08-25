"use client";

import React, { useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import { generateRandomIds, RandomIdAlphabet } from "@/lib/engines/developer/random-id";
import { ToolWorkspace } from "../shared/ToolWorkspace";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "../shared/CopyButton";
import { DownloadButton } from "../shared/DownloadButton";
import { ErrorMessage } from "../shared/ErrorMessage";

export function RandomIdGeneratorTool() {
  const [length, setLength] = useState(16);
  const [quantity, setQuantity] = useState(10);
  const [alphabet, setAlphabet] = useState<RandomIdAlphabet | "custom">("alphanumeric");
  const [customAlphabet, setCustomAlphabet] = useState("abcdef0123456789");
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false);
  const [generation, setGeneration] = useState(0);
  const result = useMemo(() => {
    try {
      return { output: generateRandomIds({ length, quantity, alphabet: alphabet === "custom" ? "alphanumeric" : alphabet, customAlphabet: alphabet === "custom" ? customAlphabet : undefined, prefix, suffix, excludeAmbiguous }).join("\n") };
    } catch (error) {
      return { output: "", error: (error as Error).message };
    }
  }, [alphabet, customAlphabet, excludeAmbiguous, generation, length, prefix, quantity, suffix]);

  return (
    <ToolWorkspace className="space-y-5">
      <div className="grid grid-cols-1 gap-4 rounded-xl border border-border/50 bg-muted/20 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="space-y-1.5 text-xs text-muted-foreground"><span>Length</span><Input type="number" min={1} max={256} value={length} onChange={(event) => setLength(Number(event.target.value) || 1)} /></label>
        <label className="space-y-1.5 text-xs text-muted-foreground"><span>Quantity</span><Input type="number" min={1} max={100} value={quantity} onChange={(event) => setQuantity(Number(event.target.value) || 1)} /></label>
        <label className="space-y-1.5 text-xs text-muted-foreground"><span>Alphabet</span><Select value={alphabet} onChange={(event) => setAlphabet(event.target.value as RandomIdAlphabet | "custom")}><option value="alphanumeric">Alphanumeric</option><option value="letters">Letters</option><option value="lowercase">Lowercase + numbers</option><option value="uppercase">Uppercase + numbers</option><option value="numeric">Numbers</option><option value="hexadecimal">Hexadecimal</option><option value="custom">Custom</option></Select></label>
        <div className="flex items-end"><Switch id="random-ambiguous" checked={excludeAmbiguous} onCheckedChange={setExcludeAmbiguous} label="Exclude 0, O, 1, l, I" /></div>
        {alphabet === "custom" && <label className="space-y-1.5 text-xs text-muted-foreground sm:col-span-2"><span>Custom alphabet</span><Input value={customAlphabet} onChange={(event) => setCustomAlphabet(event.target.value)} className="font-mono" /></label>}
        <label className="space-y-1.5 text-xs text-muted-foreground"><span>Prefix</span><Input value={prefix} onChange={(event) => setPrefix(event.target.value)} placeholder="Optional" /></label>
        <label className="space-y-1.5 text-xs text-muted-foreground"><span>Suffix</span><Input value={suffix} onChange={(event) => setSuffix(event.target.value)} placeholder="Optional" /></label>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button size="sm" onClick={() => setGeneration((value) => value + 1)}><RefreshCw className="mr-1.5 h-3.5 w-3.5" />Generate new IDs</Button>
        <div className="flex gap-1"><CopyButton textToCopy={result.output} label="Copy all" /><DownloadButton content={result.output} filename="random-ids.txt" label="Download" /></div>
      </div>
      {result.error ? <ErrorMessage message={result.error} /> : <Textarea value={result.output} readOnly className="min-h-[320px] bg-muted/10 font-mono text-xs" />}
      <p className="text-xs text-muted-foreground">ID length applies to the generated random portion; optional prefix and suffix are added afterward.</p>
    </ToolWorkspace>
  );
}
