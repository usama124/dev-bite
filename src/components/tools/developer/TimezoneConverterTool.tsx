"use client";

import React, { useMemo, useState } from "react";
import { ArrowRightLeft } from "lucide-react";
import { convertTimezone, getSupportedTimezones } from "@/lib/engines/developer/timezone";
import { ToolWorkspace } from "../shared/ToolWorkspace";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { CopyButton } from "../shared/CopyButton";
import { ErrorMessage } from "../shared/ErrorMessage";

export function TimezoneConverterTool() {
  const [dateTime, setDateTime] = useState("2026-01-15T09:00");
  const [sourceZone, setSourceZone] = useState("UTC");
  const [targetZone, setTargetZone] = useState("Asia/Karachi");
  const [hour12, setHour12] = useState(false);
  const [includeSeconds, setIncludeSeconds] = useState(false);
  const timezones = useMemo(() => getSupportedTimezones(), []);
  const result = useMemo(() => convertTimezone(dateTime, sourceZone, targetZone, { hour12, includeSeconds }), [dateTime, hour12, includeSeconds, sourceZone, targetZone]);
  const output = result.success ? `${result.source}\n${result.target}\n${result.iso}` : "";

  const zoneSelect = (value: string, onChange: (value: string) => void, label: string) => (
    <label className="space-y-1.5 text-xs font-medium text-muted-foreground"><span>{label}</span><Select value={value} onChange={(event) => onChange(event.target.value)}>{timezones.map((zone) => <option key={zone} value={zone}>{zone}</option>)}</Select></label>
  );

  return (
    <ToolWorkspace className="space-y-5">
      <div className="grid grid-cols-1 items-end gap-4 rounded-xl border border-border/50 bg-muted/20 p-4 lg:grid-cols-[1fr_1fr_auto_1fr]">
        <label className="space-y-1.5 text-xs font-medium text-muted-foreground"><span>Source date and time</span><Input type="datetime-local" step={includeSeconds ? "1" : "60"} value={dateTime} onChange={(event) => setDateTime(event.target.value)} /></label>
        {zoneSelect(sourceZone, setSourceZone, "Source timezone")}
        <Button variant="outline" size="icon" aria-label="Swap timezones" onClick={() => { setSourceZone(targetZone); setTargetZone(sourceZone); }}><ArrowRightLeft className="h-4 w-4" /></Button>
        {zoneSelect(targetZone, setTargetZone, "Target timezone")}
      </div>
      <div className="flex flex-wrap gap-4"><Switch id="timezone-12h" checked={hour12} onCheckedChange={setHour12} label="12-hour clock" /><Switch id="timezone-seconds" checked={includeSeconds} onCheckedChange={setIncludeSeconds} label="Show seconds" /></div>
      {!result.success ? <ErrorMessage title="Timezone Conversion Error" message={result.error ?? "Unable to convert this time."} /> : (
        <div className="space-y-4 rounded-xl border border-border/70 bg-muted/10 p-4">
          <div className="flex justify-end"><CopyButton textToCopy={output} label="Copy conversion" /></div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
            <div className="rounded-xl border border-border/60 bg-background/60 p-4"><span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{sourceZone}</span><p className="mt-2 text-lg font-bold">{result.source}</p></div>
            <ArrowRightLeft className="mx-auto h-5 w-5 text-primary" />
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-4"><span className="text-xs font-semibold uppercase tracking-wider text-primary">{targetZone}</span><p className="mt-2 text-lg font-bold">{result.target}</p></div>
          </div>
          <p className="text-center font-mono text-xs text-muted-foreground">Instant: {result.iso}</p>
        </div>
      )}
      <p className="text-xs text-muted-foreground">Conversion uses the browser’s DST-aware IANA timezone database. Nonexistent daylight-saving transition times are rejected.</p>
    </ToolWorkspace>
  );
}
