"use client";

import React, { useMemo, useState } from "react";
import { extractRegex, replaceRegex, testRegex } from "@/lib/engines/developer/regex";
import { ToolWorkspace } from "../shared/ToolWorkspace";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select } from "@/components/ui/select";
import { CopyButton } from "../shared/CopyButton";
import { DownloadButton } from "../shared/DownloadButton";
import { ClearButton } from "../shared/ClearButton";
import { SampleButton } from "../shared/SampleButton";
import { ErrorMessage } from "../shared/ErrorMessage";

type RegexMode = "test" | "replace" | "extract";
const SAMPLE_PATTERN = "([\\w.+-]+)@([\\w.-]+\\.[A-Za-z]{2,})";
const SAMPLE_TEXT = "Contact alice@example.com or support@devbite.tools for help.";

export function RegexTool({ mode }: { mode: RegexMode }) {
  const [pattern, setPattern] = useState(SAMPLE_PATTERN);
  const [text, setText] = useState(SAMPLE_TEXT);
  const [replacement, setReplacement] = useState("$1@[redacted]");
  const [global, setGlobal] = useState(true);
  const [caseInsensitive, setCaseInsensitive] = useState(false);
  const [multiline, setMultiline] = useState(false);
  const [dotAll, setDotAll] = useState(false);
  const [unicode, setUnicode] = useState(false);
  const [group, setGroup] = useState(0);
  const flags = `${global ? "g" : ""}${caseInsensitive ? "i" : ""}${multiline ? "m" : ""}${dotAll ? "s" : ""}${unicode ? "u" : ""}`;
  const result = useMemo(() => {
    if (mode === "replace") return replaceRegex(pattern, text, replacement, flags);
    if (mode === "extract") return extractRegex(pattern, text, flags, group);
    return testRegex(pattern, text, flags);
  }, [flags, group, mode, pattern, replacement, text]);

  const output = mode === "replace"
    ? ("output" in result && typeof result.output === "string" ? result.output : "")
    : mode === "extract"
      ? ("values" in result && Array.isArray(result.values) ? result.values.join("\n") : "")
      : ("matches" in result && Array.isArray(result.matches) ? result.matches.map((match) => `${match.value}\t[${match.index}, ${match.end})`).join("\n") : "");
  const matchCount = "matches" in result && Array.isArray(result.matches)
    ? result.matches.length
    : "replacementCount" in result && typeof result.replacementCount === "number"
      ? result.replacementCount
      : 0;
  const loadSample = () => { setPattern(SAMPLE_PATTERN); setText(SAMPLE_TEXT); setReplacement("$1@[redacted]"); };

  return (
    <ToolWorkspace className="space-y-5">
      <div className="space-y-3 rounded-xl border border-border/50 bg-muted/20 p-4">
        <label className="space-y-1.5 text-xs font-medium text-muted-foreground">
          <span>Regular expression pattern</span>
          <div className="flex items-center rounded-lg border border-input bg-background/60 font-mono"><span className="px-3 text-muted-foreground">/</span><Input value={pattern} onChange={(event) => setPattern(event.target.value)} className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0" spellCheck={false} /><span className="px-3 text-primary">/{flags}</span></div>
        </label>
        {mode === "replace" && <label className="space-y-1.5 text-xs font-medium text-muted-foreground"><span>Replacement · supports $1, $2, $&amp;, and named groups</span><Input value={replacement} onChange={(event) => setReplacement(event.target.value)} className="font-mono" /></label>}
        <div className="flex flex-wrap items-center gap-4">
          <Switch id={`${mode}-global`} checked={global} onCheckedChange={setGlobal} label="Global (g)" />
          <Switch id={`${mode}-case`} checked={caseInsensitive} onCheckedChange={setCaseInsensitive} label="Ignore case (i)" />
          <Switch id={`${mode}-multiline`} checked={multiline} onCheckedChange={setMultiline} label="Multiline (m)" />
          <Switch id={`${mode}-dotall`} checked={dotAll} onCheckedChange={setDotAll} label="Dot all (s)" />
          <Switch id={`${mode}-unicode`} checked={unicode} onCheckedChange={setUnicode} label="Unicode (u)" />
          {mode === "extract" && <label className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">Extract group<Select value={group} onChange={(event) => setGroup(Number(event.target.value))} className="h-8 w-32 text-xs"><option value={0}>Full match</option>{[1, 2, 3, 4, 5].map((value) => <option key={value} value={value}>Group {value}</option>)}</Select></label>}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between"><span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Test text</span><div className="flex gap-1"><SampleButton onLoadSample={loadSample} /><ClearButton onClear={() => setText("")} disabled={!text} /></div></div>
          <Textarea value={text} onChange={(event) => setText(event.target.value)} className="min-h-[340px] font-mono text-xs" spellCheck={false} />
        </div>
        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2"><span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{mode === "replace" ? "Transformed text" : mode === "extract" ? "Extracted values" : "Matches and positions"} · {matchCount}</span><div className="flex gap-1"><CopyButton textToCopy={output} label="Copy" /><DownloadButton content={output} filename={`regex-${mode}-output.txt`} label="Download" /></div></div>
          {!result.success ? <ErrorMessage title="Regular Expression Error" message={result.error ?? "Invalid expression."} /> : mode === "test" && "matches" in result ? (
            <div className="min-h-[340px] space-y-2 overflow-auto rounded-xl border border-border/70 bg-muted/10 p-3">
              {result.matches.length === 0 ? <p className="p-6 text-center text-xs text-muted-foreground">No matches found.</p> : result.matches.map((match, index) => <div key={`${match.index}-${index}`} className="rounded-lg border border-border/60 bg-background/60 p-3 text-xs"><div className="flex justify-between gap-3"><code className="break-all font-semibold text-primary">{match.value || "(empty match)"}</code><span className="shrink-0 text-muted-foreground">{match.index}–{match.end}</span></div>{match.groups.length > 0 && <div className="mt-2 space-y-1 border-t border-border/40 pt-2 text-muted-foreground">{match.groups.map((value, groupIndex) => <p key={groupIndex}>Group {groupIndex + 1}: <code>{value ?? "unmatched"}</code></p>)}</div>}</div>)}
            </div>
          ) : <Textarea value={output} readOnly className="min-h-[340px] bg-muted/10 font-mono text-xs" />}
        </div>
      </div>
    </ToolWorkspace>
  );
}
