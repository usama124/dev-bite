"use client";

import React, { useState, useMemo } from "react";
import { validateJson } from "@/lib/engines/json/validator";
import { ToolWorkspace } from "../shared/ToolWorkspace";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "../shared/CopyButton";
import { DownloadButton } from "../shared/DownloadButton";
import { ClearButton } from "../shared/ClearButton";
import { SampleButton } from "../shared/SampleButton";
import { ErrorMessage } from "../shared/ErrorMessage";
import { Minimize2 } from "lucide-react";

const SAMPLE = `{
  "tool": "JSON Minifier",
  "features": ["fast", "private", "free"],
  "author": {
    "name": "DevBite",
    "url": "https://devbite.dev"
  },
  "version": 1
}`;

export function JsonMinifierTool() {
  const [input, setInput] = useState(SAMPLE);

  const { output, error, savings } = useMemo(() => {
    if (!input.trim()) return { output: "", savings: 0 };
    const res = validateJson(input);
    if (!res.valid) return { output: "", error: res.error, savings: 0 };
    const minified = JSON.stringify(res.parsed);
    const savings = Math.max(0, input.length - minified.length);
    return { output: minified, savings };
  }, [input]);

  const savingsPct = input.length > 0 ? Math.round((savings / input.length) * 100) : 0;

  return (
    <ToolWorkspace className="space-y-5">
      {/* Savings Badge */}
      {output && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-primary/5 border border-primary/20 text-xs">
          <span className="text-muted-foreground">Size reduction:</span>
          <span className="font-bold text-primary">{savings} chars removed ({savingsPct}% smaller)</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Pretty JSON Input ({input.length} chars)
            </span>
            <div className="flex items-center gap-1">
              <SampleButton onLoadSample={() => setInput(SAMPLE)} />
              <ClearButton onClear={() => setInput("")} disabled={!input} />
            </div>
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste formatted JSON to minify..."
            className="min-h-[320px] text-xs font-mono"
            spellCheck={false}
          />
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Minified Output ({output.length} chars)
            </span>
            <div className="flex items-center gap-1">
              <CopyButton textToCopy={output} label="Copy" />
              <DownloadButton content={output} filename="minified.json" label="Download" />
            </div>
          </div>
          {error ? (
            <ErrorMessage title="Invalid JSON" message={error} />
          ) : (
            <Textarea
              value={output}
              readOnly
              placeholder="Minified output appears here..."
              className="min-h-[320px] text-xs font-mono bg-muted/10 break-all"
              spellCheck={false}
            />
          )}
        </div>
      </div>
    </ToolWorkspace>
  );
}
