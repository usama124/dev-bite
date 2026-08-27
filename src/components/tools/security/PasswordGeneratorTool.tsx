"use client";

import React from "react";
import { RefreshCw } from "lucide-react";
import { generatePasswords, PasswordOptions } from "@/lib/engines/security";
import { ToolWorkspace } from "../shared/ToolWorkspace";
import { PrivacyNotice } from "../shared/PrivacyNotice";
import { CopyButton } from "../shared/CopyButton";
import { DownloadButton } from "../shared/DownloadButton";
import { ErrorMessage } from "../shared/ErrorMessage";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const defaults: PasswordOptions = { length: 20, count: 5, uppercase: true, lowercase: true, numbers: true, symbols: true, excludeAmbiguous: true };

export function PasswordGeneratorTool() {
  const [options, setOptions] = React.useState(defaults);
  const [generation, setGeneration] = React.useState(0);
  const result = React.useMemo(() => { void generation; try { return { output: generatePasswords(options).join("\n") }; } catch (error) { return { output: "", error: error instanceof Error ? error.message : "Unable to generate passwords." }; } }, [generation, options]);
  const toggle = (key: keyof PasswordOptions) => (checked: boolean) => setOptions((current) => ({ ...current, [key]: checked }));
  return <ToolWorkspace className="space-y-5">
    <PrivacyNotice cryptographic />
    <div className="grid gap-4 rounded-xl border border-border/60 bg-muted/20 p-4 sm:grid-cols-2 lg:grid-cols-4">
      <label className="space-y-1 text-xs font-medium">Length<Input type="number" min={4} max={256} value={options.length} onChange={(event) => setOptions({ ...options, length: Number(event.target.value) })} /></label>
      <label className="space-y-1 text-xs font-medium">Passwords<Input type="number" min={1} max={100} value={options.count} onChange={(event) => setOptions({ ...options, count: Number(event.target.value) })} /></label>
      <div className="space-y-2"><Switch checked={options.uppercase} onCheckedChange={toggle("uppercase")} label="Uppercase" /><Switch checked={options.lowercase} onCheckedChange={toggle("lowercase")} label="Lowercase" /><Switch checked={options.numbers} onCheckedChange={toggle("numbers")} label="Numbers" /></div>
      <div className="space-y-2"><Switch checked={options.symbols} onCheckedChange={toggle("symbols")} label="Symbols" /><Switch checked={options.excludeAmbiguous} onCheckedChange={toggle("excludeAmbiguous")} label="Exclude I/l/1/O/0" /></div>
    </div>
    {result.error ? <ErrorMessage title="Generation Error" message={result.error} /> : <div className="space-y-2"><div className="flex flex-wrap justify-between gap-2"><span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Generated passwords</span><div className="flex flex-wrap gap-1"><Button size="sm" onClick={() => setGeneration((value) => value + 1)}><RefreshCw className="mr-1.5 h-3.5 w-3.5" />Generate new</Button><CopyButton textToCopy={result.output} /><DownloadButton content={result.output} filename="secure-passwords.txt" /></div></div><pre className="min-h-48 overflow-auto rounded-xl border border-border/70 bg-muted/10 p-4 font-mono text-sm leading-7">{result.output}</pre></div>}
  </ToolWorkspace>;
}
