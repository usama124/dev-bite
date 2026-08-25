"use client";

import React, { useState, useMemo } from "react";
import { convertCase, CaseType } from "@/lib/engines/text/case-converter";
import { ToolWorkspace } from "../shared/ToolWorkspace";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CopyButton } from "../shared/CopyButton";
import { DownloadButton } from "../shared/DownloadButton";
import { ClearButton } from "../shared/ClearButton";
import { SampleButton } from "../shared/SampleButton";

const SAMPLE_TEXT = `DevBite case converter transforms your developer strings and titles into camelCase, snake_case, PascalCase, and more!`;

export function CaseConverterTool() {
  const [input, setInput] = useState(SAMPLE_TEXT);
  const [selectedCase, setSelectedCase] = useState<CaseType>("camelcase");

  const caseOptions: { id: CaseType; label: string; preview: string }[] = [
    { id: "uppercase", label: "UPPERCASE", preview: "HELLO WORLD" },
    { id: "lowercase", label: "lowercase", preview: "hello world" },
    { id: "titlecase", label: "Title Case", preview: "Hello World" },
    { id: "sentencecase", label: "Sentence case", preview: "Hello world" },
    { id: "camelcase", label: "camelCase", preview: "helloWorld" },
    { id: "pascalcase", label: "PascalCase", preview: "HelloWorld" },
    { id: "snakecase", label: "snake_case", preview: "hello_world" },
    { id: "kebabcase", label: "kebab-case", preview: "hello-world" },
    { id: "constantcase", label: "CONSTANT_CASE", preview: "HELLO_WORLD" },
    { id: "dotcase", label: "dot.case", preview: "hello.world" },
    { id: "pathcase", label: "path/case", preview: "hello/world" },
    { id: "alternatingcase", label: "aLtErNaTiNg", preview: "hElLo WoRlD" },
    { id: "inversecase", label: "InVeRsE", preview: "hELLO wORLD" },
  ];

  const output = useMemo(() => convertCase(input, selectedCase), [input, selectedCase]);

  return (
    <ToolWorkspace className="space-y-6">
      {/* 1-Click Case Converters Grid */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Choose Target Case
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {caseOptions.map((opt) => {
            const isSelected = selectedCase === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setSelectedCase(opt.id)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-muted/20 border-border/60 hover:bg-muted/40 text-foreground"
                }`}
              >
                <div className="font-semibold text-xs truncate">{opt.label}</div>
                <div
                  className={`text-[11px] font-mono mt-0.5 truncate ${
                    isSelected ? "text-primary-foreground/80" : "text-muted-foreground"
                  }`}
                >
                  {opt.preview}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Input / Output Panes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Input Text
            </span>
            <div className="flex items-center gap-1">
              <SampleButton onLoadSample={() => setInput(SAMPLE_TEXT)} />
              <ClearButton onClear={() => setInput("")} disabled={!input} />
            </div>
          </div>
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste text to convert..."
            className="min-h-[260px] text-sm leading-relaxed"
          />
        </div>

        {/* Output */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Converted Output ({selectedCase})
            </span>
            <div className="flex items-center gap-1">
              <CopyButton textToCopy={output} label="Copy Output" />
              <DownloadButton
                content={output}
                filename={`converted-${selectedCase}.txt`}
                label="Download"
              />
            </div>
          </div>
          <Textarea
            value={output}
            readOnly
            placeholder="Converted text appears here..."
            className="min-h-[260px] text-sm leading-relaxed bg-muted/10 font-mono"
          />
        </div>
      </div>
    </ToolWorkspace>
  );
}
