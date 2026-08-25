"use client";

import React, { useMemo, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { validateUuid } from "@/lib/engines/developer/uuid";
import { ToolWorkspace } from "../shared/ToolWorkspace";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { CopyButton } from "../shared/CopyButton";
import { ClearButton } from "../shared/ClearButton";
import { SampleButton } from "../shared/SampleButton";

const SAMPLE = `550e8400-e29b-41d4-a716-446655440000
01890f4c-7c00-7000-8000-000000000000
not-a-uuid`;

export function UuidValidatorTool() {
  const [input, setInput] = useState(SAMPLE);
  const [strict, setStrict] = useState(false);
  const [versionFilter, setVersionFilter] = useState("all");
  const rows = useMemo(() => input.split(/\r?\n/).map((value) => value.trim()).filter(Boolean).map((value) => {
    const validation = validateUuid(value);
    const strictValid = !strict || /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
    const versionValid = versionFilter === "all" || validation.version?.toLowerCase().startsWith(versionFilter);
    const valid = validation.valid && strictValid && versionValid;
    const reason = !validation.valid ? validation.error : !strictValid ? "Strict mode requires the standard hyphenated form." : !versionValid ? `UUID does not match the ${versionFilter} filter.` : undefined;
    return { value, ...validation, valid, error: reason };
  }), [input, strict, versionFilter]);
  const validCount = rows.filter((row) => row.valid).length;
  const output = rows.map((row) => `${row.valid ? "VALID" : "INVALID"}\t${row.value}\t${row.valid ? `${row.version}; ${row.variant}` : row.error}`).join("\n");

  return (
    <ToolWorkspace className="space-y-5">
      <div className="flex flex-wrap items-center gap-4 rounded-xl border border-border/50 bg-muted/20 p-4">
        <Switch id="uuid-strict" checked={strict} onCheckedChange={setStrict} label="Require standard hyphenated format" />
        <label className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
          Version filter
          <Select value={versionFilter} onChange={(event) => setVersionFilter(event.target.value)} className="h-8 w-36 text-xs">
            <option value="all">Any version</option>
            {[1, 2, 3, 4, 5, 7, 8].map((version) => <option key={version} value={`v${version}`}>UUID v{version}</option>)}
          </Select>
        </label>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">UUIDs · one per line</span>
            <div className="flex gap-1"><SampleButton onLoadSample={() => setInput(SAMPLE)} /><ClearButton onClear={() => setInput("")} disabled={!input} /></div>
          </div>
          <Textarea value={input} onChange={(event) => setInput(event.target.value)} className="min-h-[340px] font-mono text-xs" spellCheck={false} />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Results · {validCount}/{rows.length} valid</span>
            <CopyButton textToCopy={output} label="Copy results" />
          </div>
          <div className="min-h-[340px] space-y-2 rounded-xl border border-border/70 bg-muted/10 p-3">
            {rows.length === 0 ? <p className="p-6 text-center text-xs text-muted-foreground">Enter one or more UUIDs to validate.</p> : rows.map((row, index) => (
              <div key={`${row.value}-${index}`} className={`rounded-lg border p-3 text-xs ${row.valid ? "border-emerald-500/20 bg-emerald-500/5" : "border-destructive/20 bg-destructive/5"}`}>
                <div className="flex items-start gap-2">
                  {row.valid ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" /> : <XCircle className="h-4 w-4 shrink-0 text-destructive" />}
                  <div className="min-w-0"><p className="break-all font-mono font-semibold">{row.value}</p><p className="mt-1 text-muted-foreground">{row.valid ? `${row.version} · ${row.variant}` : row.error}</p>{row.timestamp && <p className="mt-1 text-muted-foreground">Timestamp: {row.timestamp.toISOString()}</p>}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolWorkspace>
  );
}
