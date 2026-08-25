"use client";

import React, { useMemo, useState } from "react";
import { CalendarClock } from "lucide-react";
import { describeCron } from "@/lib/engines/developer/cron";
import { getSupportedTimezones } from "@/lib/engines/developer/timezone";
import { ToolWorkspace } from "../shared/ToolWorkspace";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CopyButton } from "../shared/CopyButton";
import { ErrorMessage } from "../shared/ErrorMessage";

const EXAMPLES = [
  ["Weekdays at 09:00", "0 9 * * 1-5"],
  ["Every 15 minutes", "*/15 * * * *"],
  ["Daily at midnight", "0 0 * * *"],
  ["Monday at 08:30", "30 8 * * 1"],
];

export function CronHumanReadableTool() {
  const [expression, setExpression] = useState("0 9 * * 1-5");
  const [includeSeconds, setIncludeSeconds] = useState(false);
  const [timezone, setTimezone] = useState("UTC");
  const timezones = useMemo(() => getSupportedTimezones(), []);
  const result = useMemo(() => describeCron(expression, includeSeconds), [expression, includeSeconds]);
  const output = result.success ? `${result.description} (${timezone})\n${result.fields?.map((field) => `${field.name}: ${field.value}`).join("\n")}` : "";

  return (
    <ToolWorkspace className="space-y-5">
      <div className="space-y-3 rounded-xl border border-border/50 bg-muted/20 p-4">
        <label className="space-y-1.5 text-xs font-medium text-muted-foreground"><span>Cron expression</span><div className="relative"><CalendarClock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" /><Input value={expression} onChange={(event) => setExpression(event.target.value)} className="pl-9 font-mono text-base" placeholder="0 9 * * 1-5" spellCheck={false} /></div></label>
        <div className="flex flex-wrap items-center gap-4"><Switch id="cron-seconds" checked={includeSeconds} onCheckedChange={(checked) => { setIncludeSeconds(checked); setExpression(checked ? "0 0 9 * * 1-5" : "0 9 * * 1-5"); }} label="Six-field dialect with seconds" /><label className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">Timezone<Select value={timezone} onChange={(event) => setTimezone(event.target.value)} className="h-8 w-48 text-xs">{timezones.map((zone) => <option key={zone}>{zone}</option>)}</Select></label></div>
      </div>
      <div className="flex flex-wrap gap-2">{EXAMPLES.map(([label, value]) => <button key={value} onClick={() => { setIncludeSeconds(false); setExpression(value); }} className="rounded-lg border border-border/60 bg-background/50 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground">{label}</button>)}</div>
      {!result.success ? <ErrorMessage title="Cron Validation Error" message={result.error ?? "Invalid expression."} /> : (
        <div className="space-y-4 rounded-xl border border-primary/20 bg-primary/5 p-5">
          <div className="flex flex-wrap items-start justify-between gap-3"><div><span className="text-xs font-semibold uppercase tracking-wider text-primary">Human-readable schedule</span><h3 className="mt-2 text-xl font-bold">{result.description}</h3><p className="mt-1 text-xs text-muted-foreground">Interpreted in {timezone}</p></div><CopyButton textToCopy={output} label="Copy schedule" /></div>
          <div className={`grid gap-2 ${includeSeconds ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6" : "grid-cols-2 sm:grid-cols-5"}`}>{result.fields?.map((field) => <div key={field.name} className="rounded-lg border border-border/50 bg-background/60 p-3"><span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{field.name}</span><p className="mt-1 font-mono text-lg font-bold text-primary">{field.value}</p><p className="mt-1 text-[10px] text-muted-foreground">{field.allowed}</p></div>)}</div>
        </div>
      )}
      <p className="text-xs text-muted-foreground">Supported syntax: wildcards, values, comma lists, ranges, and step values. Five-field Unix cron and optional six-field seconds dialects are supported.</p>
    </ToolWorkspace>
  );
}
