"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  generateUuids,
  formatUuidOutput,
  validateUuid,
  UuidVersion,
  UuidFormat,
  UuidValidationResult,
} from "@/lib/engines/developer/uuid";
import { ToolWorkspace } from "../shared/ToolWorkspace";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "../shared/CopyButton";
import { DownloadButton } from "../shared/DownloadButton";
import { RefreshCw, CheckCircle2, AlertCircle, Copy, Key, ShieldCheck } from "lucide-react";

export function UuidGeneratorTool() {
  const [activeTab, setActiveTab] = useState<"generate" | "validate">("generate");

  // Generator states
  const [version, setVersion] = useState<UuidVersion>("v4");
  const [quantity, setQuantity] = useState<number>(1);
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [format, setFormat] = useState<UuidFormat>("plain");
  const [generatedList, setGeneratedList] = useState<string[]>([]);

  // Validator states
  const [validateInput, setValidateInput] = useState("");
  const [validationResult, setValidationResult] = useState<UuidValidationResult | null>(null);

  const handleGenerate = useCallback(() => {
    const list = generateUuids({
      version,
      quantity,
      uppercase,
      hyphens,
      format,
    });
    setGeneratedList(list);
  }, [format, hyphens, quantity, uppercase, version]);

  useEffect(() => {
    handleGenerate();
  }, [handleGenerate]);

  const formattedOutput = formatUuidOutput(generatedList, format);

  const handleValidate = (val: string) => {
    setValidateInput(val);
    if (!val.trim()) {
      setValidationResult(null);
    } else {
      setValidationResult(validateUuid(val));
    }
  };

  const quantityPresets = [1, 5, 10, 25, 50, 100];

  return (
    <ToolWorkspace className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-border/50 pb-3">
        <button
          onClick={() => setActiveTab("generate")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === "generate"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <Key className="h-4 w-4" />
          UUID Generator
        </button>
        <button
          onClick={() => setActiveTab("validate")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === "validate"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          UUID Validator & Inspector
        </button>
      </div>

      {activeTab === "generate" ? (
        <div className="space-y-6">
          {/* Options Toolbar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl bg-muted/20 border border-border/50">
            {/* Version */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Version</label>
              <Select
                value={version}
                onChange={(e) => setVersion(e.target.value as UuidVersion)}
                className="h-9 text-xs bg-background"
              >
                <option value="v4">UUID v4 (Random - RFC 4122)</option>
                <option value="v7">UUID v7 (Time-Ordered - RFC 9562)</option>
                <option value="v1">UUID v1 (Time-Based - RFC 4122)</option>
                <option value="nil">Nil UUID (All Zeros)</option>
              </Select>
            </div>

            {/* Quantity */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Quantity (1 - 100)</label>
              <div className="flex items-center gap-1.5">
                <Input
                  type="number"
                  min={1}
                  max={100}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(100, parseInt(e.target.value, 10) || 1)))}
                  className="h-9 text-xs bg-background w-20"
                />
                <div className="flex items-center gap-1 overflow-x-auto">
                  {[1, 5, 10, 25].map((q) => (
                    <button
                      key={q}
                      onClick={() => setQuantity(q)}
                      className={`px-2 py-1 text-xs rounded-md border transition-colors ${
                        quantity === q
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background text-muted-foreground border-border hover:bg-muted"
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Output Format */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Output Format</label>
              <Select
                value={format}
                onChange={(e) => setFormat(e.target.value as UuidFormat)}
                className="h-9 text-xs bg-background"
              >
                <option value="plain">Plain (Line by Line)</option>
                <option value="array">JSON Array [&quot;...&quot;]</option>
                <option value="quotes">Quoted &amp; Comma (&quot;...&quot;,)</option>
                <option value="braces">Braces {`{...}`}</option>
                <option value="csv">Comma-Separated (CSV)</option>
              </Select>
            </div>

            {/* Toggles */}
            <div className="flex flex-col justify-center gap-2 pt-2">
              <Switch
                checked={uppercase}
                onCheckedChange={setUppercase}
                id="uuid-uppercase"
                label="Uppercase Letters"
              />
              <Switch
                checked={hyphens}
                onCheckedChange={setHyphens}
                id="uuid-hyphens"
                label="Include Hyphens (-)"
              />
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button onClick={handleGenerate} size="sm" className="h-9">
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              Regenerate {quantity} UUID{quantity > 1 ? "s" : ""}
            </Button>
            <div className="flex items-center gap-2">
              <CopyButton textToCopy={formattedOutput} label="Copy All" />
              <DownloadButton
                content={formattedOutput}
                filename="uuids.txt"
                label="Download"
              />
            </div>
          </div>

          {/* Generated UUIDs Display List */}
          <div className="space-y-2">
            <Textarea
              value={formattedOutput}
              readOnly
              className="min-h-[260px] text-xs font-mono bg-muted/10 leading-relaxed"
            />
            <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
              <span>Generated {generatedList.length} UUID identifiers</span>
              <span>Web Crypto API &bull; Cryptographically Strong</span>
            </div>
          </div>
        </div>
      ) : (
        /* Validator View */
        <div className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Enter UUID to Validate &amp; Inspect
            </label>
            <Input
              value={validateInput}
              onChange={(e) => handleValidate(e.target.value)}
              placeholder="Paste a UUID (e.g. 550e8400-e29b-41d4-a716-446655440000 or v7 UUID)..."
              className="h-11 font-mono text-sm"
              autoFocus
            />
          </div>

          {validationResult && (
            <div className="p-4 rounded-xl border border-border/70 bg-muted/20 space-y-3">
              <div className="flex items-center gap-2">
                {validationResult.valid ? (
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                    <CheckCircle2 className="h-4 w-4" />
                    Valid RFC UUID
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-destructive font-semibold text-sm">
                    <AlertCircle className="h-4 w-4" />
                    {validationResult.error || "Invalid UUID"}
                  </div>
                )}
              </div>

              {validationResult.valid && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-border/40 text-xs">
                  <div>
                    <span className="text-muted-foreground block">Version:</span>
                    <span className="font-semibold font-mono text-foreground">{validationResult.version}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Variant:</span>
                    <span className="font-semibold font-mono text-foreground">{validationResult.variant}</span>
                  </div>
                  {validationResult.timestamp && (
                    <div>
                      <span className="text-muted-foreground block">Extracted Timestamp (UTC):</span>
                      <span className="font-semibold font-mono text-foreground">
                        {validationResult.timestamp.toISOString()}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </ToolWorkspace>
  );
}
