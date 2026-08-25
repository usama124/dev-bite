"use client";

import React, { useEffect, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import { formatUuidOutput, generateUuids, UuidFormat, UuidVersion } from "@/lib/engines/developer/uuid";
import { ToolWorkspace } from "../shared/ToolWorkspace";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "../shared/CopyButton";
import { DownloadButton } from "../shared/DownloadButton";

export function UuidVersionGeneratorTool({ version }: { version: Extract<UuidVersion, "v4" | "v7"> }) {
  const [quantity, setQuantity] = useState(10);
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [format, setFormat] = useState<UuidFormat>("plain");
  const [generation, setGeneration] = useState(0);
  const values = useMemo(
    () => generateUuids({ version, quantity, uppercase, hyphens }),
    [generation, hyphens, quantity, uppercase, version]
  );
  const output = formatUuidOutput(values, format);

  useEffect(() => setGeneration((value) => value + 1), [version]);

  return (
    <ToolWorkspace className="space-y-5">
      <div className="grid grid-cols-1 gap-4 rounded-xl border border-border/50 bg-muted/20 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <label className="space-y-1.5 text-xs font-medium text-muted-foreground">
          <span>Quantity</span>
          <Input type="number" min={1} max={100} value={quantity} onChange={(event) => setQuantity(Math.max(1, Math.min(100, Number(event.target.value) || 1)))} />
        </label>
        <label className="space-y-1.5 text-xs font-medium text-muted-foreground">
          <span>Output format</span>
          <Select value={format} onChange={(event) => setFormat(event.target.value as UuidFormat)}>
            <option value="plain">One per line</option>
            <option value="array">JSON array</option>
            <option value="quotes">Quoted list</option>
            <option value="braces">Braces</option>
            <option value="csv">Comma-separated</option>
          </Select>
        </label>
        <div className="flex flex-col justify-center gap-2">
          <Switch id={`${version}-uppercase`} checked={uppercase} onCheckedChange={setUppercase} label="Uppercase letters" />
          <Switch id={`${version}-hyphens`} checked={hyphens} onCheckedChange={setHyphens} label="Include hyphens" />
        </div>
        <div className="flex items-center lg:justify-end">
          <Button size="sm" onClick={() => setGeneration((value) => value + 1)}>
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" /> Generate new UUIDs
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">UUID {version.slice(1)} output · {values.length} identifiers</span>
        <div className="flex gap-1">
          <CopyButton textToCopy={output} label="Copy all" />
          <DownloadButton content={output} filename={`uuid-${version}.txt`} label="Download" />
        </div>
      </div>
      <Textarea value={output} readOnly className="min-h-[320px] bg-muted/10 font-mono text-xs" />
      <p className="text-xs text-muted-foreground">Generated locally with the Web Crypto API. UUID {version.slice(1)} version and RFC variant bits are set automatically.</p>
    </ToolWorkspace>
  );
}
