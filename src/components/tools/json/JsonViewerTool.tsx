"use client";

import React, { useEffect, useMemo, useState } from "react";
import { validateJson } from "@/lib/engines/json/validator";
import { ToolWorkspace } from "../shared/ToolWorkspace";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { CopyButton } from "../shared/CopyButton";
import { ClearButton } from "../shared/ClearButton";
import { SampleButton } from "../shared/SampleButton";
import { ChevronRight, ChevronDown, ChevronsDownUp, ChevronsUpDown, Search } from "lucide-react";

const SAMPLE = `{
  "name": "DevBite",
  "version": "1.0.0",
  "tools": 48,
  "categories": ["text", "json", "developer", "encoding"],
  "meta": {
    "seo": true,
    "adsEnabled": false,
    "private": true,
    "nested": { "deep": { "value": 42 } }
  }
}`;

interface JsonNodeProps {
  value: unknown;
  keyName?: string;
  depth?: number;
  defaultOpen?: boolean;
  path?: string;
  searchTerm?: string;
  showPaths?: boolean;
  expansionCommand?: { open: boolean; version: number };
}

function JsonNode({
  value,
  keyName,
  depth = 0,
  defaultOpen = true,
  path = "$",
  searchTerm = "",
  showPaths = false,
  expansionCommand,
}: JsonNodeProps) {
  const [open, setOpen] = useState(defaultOpen && depth < 2);
  const isArray = Array.isArray(value);
  const isObject = value !== null && typeof value === "object";
  const isExpandable = isObject;
  const normalizedSearch = searchTerm.trim().toLowerCase();

  useEffect(() => {
    if (expansionCommand) setOpen(expansionCommand.open);
  }, [expansionCommand]);

  const typeColor = (v: unknown): string => {
    if (v === null) return "text-rose-500";
    if (typeof v === "string") return "text-emerald-600 dark:text-emerald-400";
    if (typeof v === "number") return "text-blue-500 dark:text-blue-400";
    if (typeof v === "boolean") return "text-purple-500 dark:text-purple-400";
    return "text-foreground";
  };

  const renderPrimitive = (v: unknown) => {
    if (v === null) return <span className="text-rose-500 text-xs">null</span>;
    if (typeof v === "string") return <span className="text-emerald-600 dark:text-emerald-400 text-xs">&quot;{String(v)}&quot;</span>;
    if (typeof v === "boolean") return <span className="text-purple-500 dark:text-purple-400 text-xs">{String(v)}</span>;
    return <span className={`${typeColor(v)} text-xs font-mono`}>{String(v)}</span>;
  };

  const entries: Array<[string, unknown]> = isObject
    ? isArray
      ? (value as unknown[]).map((item, index): [string, unknown] => [String(index), item])
      : Object.entries(value as Record<string, unknown>)
    : [];
  const filteredEntries = normalizedSearch
    ? entries.filter(([key, child]) => {
        const searchable = `${key} ${JSON.stringify(child) ?? String(child)}`.toLowerCase();
        return searchable.includes(normalizedSearch);
      })
    : entries;
  const bracketOpen = isArray ? "[" : "{";
  const bracketClose = isArray ? "]" : "}";
  const displayOpen = normalizedSearch ? true : open;
  const valueForCopy = typeof value === "string" ? value : JSON.stringify(value, null, 2) ?? String(value);

  return (
    <div className="font-mono text-xs leading-relaxed" style={{ paddingLeft: depth > 0 ? "1.25rem" : 0 }}>
      <span
        className="group inline-flex items-center gap-0.5 cursor-pointer select-none"
        onClick={() => isExpandable && setOpen((o) => !o)}
      >
        {keyName !== undefined && (
          <span className="text-indigo-600 dark:text-indigo-400">&quot;{keyName}&quot;</span>
        )}
        {keyName !== undefined && <span className="text-muted-foreground mx-0.5">:</span>}

        {isExpandable ? (
          <>
            {displayOpen ? (
              <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" />
            ) : (
              <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0" />
            )}
            <span className="text-muted-foreground">{bracketOpen}</span>
            {!displayOpen && (
              <>
                <span className="text-muted-foreground/60 text-[10px] px-1">
                  {entries.length} {isArray ? "items" : "keys"}
                </span>
                <span className="text-muted-foreground">{bracketClose}</span>
              </>
            )}
          </>
        ) : (
          renderPrimitive(value)
        )}
        {showPaths && <span className="ml-2 text-[10px] text-muted-foreground/60">{path}</span>}
        <span className="ml-2 inline-flex gap-1 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100" onClick={(event) => event.stopPropagation()}>
          <CopyButton textToCopy={valueForCopy} label="Value" className="h-6 px-2 text-[10px]" />
          {showPaths && <CopyButton textToCopy={path} label="Path" className="h-6 px-2 text-[10px]" />}
        </span>
      </span>

      {isExpandable && displayOpen && (
        <div>
          {filteredEntries.map(([k, v], idx) => {
            const childPath = isArray ? `${path}[${k}]` : `${path}.${k}`;
            return (
            <div key={k} className="flex">
              <JsonNode
                value={v}
                keyName={isArray ? undefined : k}
                depth={depth + 1}
                defaultOpen={depth < 1}
                path={childPath}
                searchTerm={searchTerm}
                showPaths={showPaths}
                expansionCommand={expansionCommand}
              />
              {idx < filteredEntries.length - 1 && <span className="text-muted-foreground/50">,</span>}
            </div>
          )})}
          <span className="text-muted-foreground">{bracketClose}</span>
        </div>
      )}
    </div>
  );
}

export function JsonViewerTool({ isTree = false }: { isTree?: boolean }) {
  const [input, setInput] = useState(SAMPLE);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPaths, setShowPaths] = useState(isTree);
  const [expansionCommand, setExpansionCommand] = useState({ open: true, version: 0 });

  const result = useMemo(() => validateJson(input), [input]);

  return (
    <ToolWorkspace className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border/50 bg-muted/20 p-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search keys or values..."
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="sm" onClick={() => setExpansionCommand((command) => ({ open: true, version: command.version + 1 }))}>
          <ChevronsUpDown className="mr-1.5 h-3.5 w-3.5" /> Expand all
        </Button>
        <Button variant="outline" size="sm" onClick={() => setExpansionCommand((command) => ({ open: false, version: command.version + 1 }))}>
          <ChevronsDownUp className="mr-1.5 h-3.5 w-3.5" /> Collapse all
        </Button>
        <Switch id="viewer-paths" checked={showPaths} onCheckedChange={setShowPaths} label="Show JSON paths" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              JSON Input
            </span>
            <div className="flex items-center gap-1">
              <SampleButton onLoadSample={() => setInput(SAMPLE)} />
              <ClearButton onClear={() => setInput("")} disabled={!input} />
            </div>
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste JSON to view its interactive tree structure..."
            className="min-h-[380px] text-xs font-mono"
            spellCheck={false}
          />
        </div>

        {/* Tree / Viewer Output */}
        <div className="space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {isTree ? "Interactive Tree View" : "Readable Structure"}
          </span>
          <div className="min-h-[380px] p-4 rounded-xl border border-border/70 bg-muted/5 overflow-auto text-xs">
            {!input.trim() ? (
              <p className="text-muted-foreground text-center mt-8">
                Paste JSON on the left to view its structure.
              </p>
            ) : !result.valid ? (
              <div className="text-rose-500 text-xs font-mono space-y-1">
                <div className="font-semibold">⚠ Invalid JSON</div>
                <div>{result.error}</div>
                {result.line && <div>Line {result.line}, Col {result.column}</div>}
              </div>
            ) : (
              <JsonNode
                value={result.parsed}
                defaultOpen
                searchTerm={searchTerm}
                showPaths={showPaths}
                expansionCommand={expansionCommand}
              />
            )}
          </div>
        </div>
      </div>
    </ToolWorkspace>
  );
}
