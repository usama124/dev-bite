"use client";

import React, { useMemo, useState } from "react";
import { Clock3 } from "lucide-react";
import { dateToTimestamp, timestampToDate, TimestampUnit } from "@/lib/engines/developer/timestamp";
import { ToolWorkspace } from "../shared/ToolWorkspace";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { CopyButton } from "../shared/CopyButton";
import { ErrorMessage } from "../shared/ErrorMessage";

function localDateTimeValue(date = new Date()): string {
  const shifted = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return shifted.toISOString().slice(0, 19);
}

export function TimestampConverterTool() {
  const [mode, setMode] = useState<"timestamp" | "date">("timestamp");
  const [timestamp, setTimestamp] = useState(String(Math.floor(Date.now() / 1000)));
  const [unit, setUnit] = useState<TimestampUnit>("seconds");
  const [dateInput, setDateInput] = useState(localDateTimeValue());
  const result = useMemo(() => mode === "timestamp" ? timestampToDate(timestamp, unit) : dateToTimestamp(dateInput), [dateInput, mode, timestamp, unit]);
  const output = result.success ? [`ISO: ${result.iso}`, `UTC: ${result.utc}`, `Local: ${result.local}`, `Unix seconds: ${result.seconds}`, `Unix milliseconds: ${result.milliseconds}`].join("\n") : "";

  return (
    <ToolWorkspace className="space-y-5">
      <div className="flex gap-2 border-b border-border/50 pb-3">
        <Button size="sm" variant={mode === "timestamp" ? "default" : "outline"} onClick={() => setMode("timestamp")}>Timestamp → Date</Button>
        <Button size="sm" variant={mode === "date" ? "default" : "outline"} onClick={() => setMode("date")}>Date → Timestamp</Button>
      </div>
      <div className="rounded-xl border border-border/50 bg-muted/20 p-4">
        {mode === "timestamp" ? <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_180px_auto]"><Input value={timestamp} onChange={(event) => setTimestamp(event.target.value)} className="font-mono" placeholder="1700000000" /><Select value={unit} onChange={(event) => setUnit(event.target.value as TimestampUnit)}><option value="seconds">Seconds</option><option value="milliseconds">Milliseconds</option></Select><Button variant="outline" onClick={() => { setTimestamp(String(unit === "seconds" ? Math.floor(Date.now() / 1000) : Date.now())); }}><Clock3 className="mr-1.5 h-4 w-4" />Now</Button></div> : <Input type="datetime-local" step="1" value={dateInput} onChange={(event) => setDateInput(event.target.value)} />}
      </div>
      {!result.success ? <ErrorMessage title="Conversion Error" message={result.error ?? "Invalid input."} /> : (
        <div className="space-y-3 rounded-xl border border-border/70 bg-muted/10 p-4">
          <div className="flex items-center justify-between"><span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Converted values</span><CopyButton textToCopy={output} label="Copy all" /></div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[['ISO 8601', result.iso], ['UTC', result.utc], ['Local time', result.local], ['Unix seconds', result.seconds], ['Unix milliseconds', result.milliseconds], ['Relative', result.relative]].map(([label, value]) => <div key={String(label)} className="rounded-lg border border-border/50 bg-background/50 p-3"><span className="text-xs text-muted-foreground">{label}</span><p className="mt-1 break-all font-mono text-sm font-semibold">{String(value)}</p></div>)}
          </div>
        </div>
      )}
      {mode === "date" && <p className="text-xs text-muted-foreground">The date/time field is interpreted in your browser’s local timezone.</p>}
    </ToolWorkspace>
  );
}
