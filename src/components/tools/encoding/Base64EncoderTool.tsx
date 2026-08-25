"use client";

import React, { useState, useEffect, useTransition, useCallback } from "react";
import Link from "next/link";
import { encodeBase64, decodeBase64, Base64Result } from "@/lib/engines/encoding/base64";
import { ToolWorkspace } from "../shared/ToolWorkspace";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select } from "@/components/ui/select";
import { CopyButton } from "../shared/CopyButton";
import { DownloadButton } from "../shared/DownloadButton";
import { ClearButton } from "../shared/ClearButton";
import { SampleButton } from "../shared/SampleButton";
import { formatBytes } from "@/lib/utils";
import { ArrowLeftRight, Upload, FileCode, CheckCircle2 } from "lucide-react";

const SAMPLE_TEXT = `Welcome to DevBite Base64 Encoder! 🚀
Supports full UTF-8 Unicode characters (e.g. 日本語, Español, العربية, 🎉) without data corruption.`;

export function Base64EncoderTool() {
  const [inputMode, setInputMode] = useState<"text" | "file">("text");
  const [inputText, setInputText] = useState(SAMPLE_TEXT);
  const [urlSafe, setUrlSafe] = useState(false);
  const [padding, setPadding] = useState(true);
  const [lineWrap, setLineWrap] = useState<number>(0);
  const [result, setResult] = useState<Base64Result | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [, startTransition] = useTransition();

  const handleEncode = useCallback(() => {
    startTransition(() => {
      const res = encodeBase64(inputText, {
        urlSafe,
        padding,
        lineWrap,
      });
      setResult(res);
    });
  }, [inputText, lineWrap, padding, urlSafe]);

  useEffect(() => {
    if (inputText) {
      handleEncode();
    } else {
      setResult(null);
    }
  }, [handleEncode, inputText]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const buffer = event.target?.result as ArrayBuffer;
      if (buffer) {
        const uint8 = new Uint8Array(buffer);
        const res = encodeBase64(uint8, { urlSafe, padding, lineWrap });
        setResult(res);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <ToolWorkspace className="space-y-5">
      {/* Mode and Switcher Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-muted/20 border border-border/50">
        {/* Input Format Tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setInputMode("text");
              setInputText(SAMPLE_TEXT);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              inputMode === "text"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            Text Mode
          </button>
          <button
            onClick={() => {
              setInputMode("file");
              setInputText("");
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              inputMode === "file"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            File Upload
          </button>
        </div>

        {/* Encoding Options */}
        <div className="flex flex-wrap items-center gap-3">
          <Switch
            checked={urlSafe}
            onCheckedChange={setUrlSafe}
            id="url-safe"
            label="URL-Safe (- _)"
          />
          <Switch
            checked={padding}
            onCheckedChange={setPadding}
            id="padding-toggle"
            label="Include Padding (=)"
          />
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>Wrap:</span>
            <Select
              value={String(lineWrap)}
              onChange={(e) => setLineWrap(parseInt(e.target.value, 10))}
              className="h-8 w-24 text-xs bg-background"
            >
              <option value="0">None</option>
              <option value="64">64 chars</option>
              <option value="76">76 chars</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Input / Output Panes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input Pane */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {inputMode === "text" ? "Plain Text Input (UTF-8)" : "Upload File"}
            </span>
            {inputMode === "text" && (
              <div className="flex items-center gap-1">
                <SampleButton onLoadSample={() => setInputText(SAMPLE_TEXT)} />
                <ClearButton onClear={() => setInputText("")} disabled={!inputText} />
              </div>
            )}
          </div>

          {inputMode === "text" ? (
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter text or string to encode to Base64..."
              className="min-h-[300px] text-xs font-mono"
            />
          ) : (
            <div className="min-h-[300px] flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border/80 bg-background/50 p-6 text-center">
              <Upload className="h-10 w-10 text-muted-foreground/60 mb-3" />
              <p className="text-sm font-medium text-foreground mb-1">
                Choose any file to encode into Base64
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Images, documents, audio, or binary data (processed 100% locally in memory)
              </p>
              <label className="cursor-pointer">
                <span className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground shadow-sm hover:bg-primary/90">
                  Select File
                </span>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              {fileName && (
                <div className="mt-3 text-xs font-mono text-emerald-600 dark:text-emerald-400">
                  Loaded: {fileName}
                </div>
              )}
            </div>
          )}

          <div className="text-[11px] text-muted-foreground font-mono px-1">
            Raw Size: {formatBytes(result?.byteSize || 0)}
          </div>
        </div>

        {/* Output Pane */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Base64 Encoded Output
            </span>
            <div className="flex items-center gap-1">
              <CopyButton textToCopy={result?.output || ""} label="Copy Base64" />
              <DownloadButton
                content={result?.output || ""}
                filename="encoded-base64.txt"
                label="Download"
              />
            </div>
          </div>
          <Textarea
            value={result?.output || ""}
            readOnly
            placeholder="Base64 output will appear here..."
            className="min-h-[300px] text-xs font-mono bg-muted/10"
            spellCheck={false}
          />
          <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono px-1">
            <span>Characters: {result?.charCount || 0}</span>
            <span>Encoded Size: {formatBytes(result?.output ? new TextEncoder().encode(result.output).length : 0)}</span>
          </div>
        </div>
      </div>
    </ToolWorkspace>
  );
}
