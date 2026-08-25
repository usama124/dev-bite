"use client";

import React from "react";
import dynamic from "next/dynamic";
import { Tool } from "@/lib/registry/types";
import { ToolWorkspace } from "./shared/ToolWorkspace";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

// 1. Text Category Tools (12/12 Live)
const WordCounterTool = dynamic(
  () => import("./text/WordCounterTool").then((m) => m.WordCounterTool),
  { ssr: false }
);

const CharacterCounterTool = dynamic(
  () => import("./text/CharacterCounterTool").then((m) => m.CharacterCounterTool),
  { ssr: false }
);

const TextStatisticsTool = dynamic(
  () => import("./text/TextStatisticsTool").then((m) => m.TextStatisticsTool),
  { ssr: false }
);

const WhitespaceRemoverTool = dynamic(
  () => import("./text/WhitespaceRemoverTool").then((m) => m.WhitespaceRemoverTool),
  { ssr: false }
);

const TextCleanerTool = dynamic(
  () => import("./text/TextCleanerTool").then((m) => m.TextCleanerTool),
  { ssr: false }
);

const CaseConverterTool = dynamic(
  () => import("./text/CaseConverterTool").then((m) => m.CaseConverterTool),
  { ssr: false }
);

const FindReplaceTool = dynamic(
  () => import("./text/FindReplaceTool").then((m) => m.FindReplaceTool),
  { ssr: false }
);

const FindRemoveTool = dynamic(
  () => import("./text/FindRemoveTool").then((m) => m.FindRemoveTool),
  { ssr: false }
);

const RemoveDuplicateLinesTool = dynamic(
  () => import("./text/RemoveDuplicateLinesTool").then((m) => m.RemoveDuplicateLinesTool),
  { ssr: false }
);

const SortLinesTool = dynamic(
  () => import("./text/SortLinesTool").then((m) => m.SortLinesTool),
  { ssr: false }
);

const TextDiffTool = dynamic(
  () => import("./text/TextDiffTool").then((m) => m.TextDiffTool),
  { ssr: false }
);

const TextJoinerSplitterTool = dynamic(
  () => import("./text/TextJoinerSplitterTool").then((m) => m.TextJoinerSplitterTool),
  { ssr: false }
);

// 2. JSON Category Tools (14/14 Live)
const JsonFormatterTool = dynamic(
  () => import("./json/JsonFormatterTool").then((m) => m.JsonFormatterTool),
  { ssr: false }
);

const JsonValidatorTool = dynamic(
  () => import("./json/JsonValidatorTool").then((m) => m.JsonValidatorTool),
  { ssr: false }
);

const JsonMinifierTool = dynamic(
  () => import("./json/JsonMinifierTool").then((m) => m.JsonMinifierTool),
  { ssr: false }
);

const JsonViewerTool = dynamic(
  () => import("./json/JsonViewerTool").then((m) => m.JsonViewerTool),
  { ssr: false }
);

const JsonSorterTool = dynamic(
  () => import("./json/JsonSorterTool").then((m) => m.JsonSorterTool),
  { ssr: false }
);

const JsonFlattenTool = dynamic(
  () => import("./json/JsonFlattenTool").then((m) => m.JsonFlattenTool),
  { ssr: false }
);

const JsonDiffTool = dynamic(
  () => import("./json/JsonDiffTool").then((m) => m.JsonDiffTool),
  { ssr: false }
);

const JsonPathTesterTool = dynamic(
  () => import("./json/JsonPathTesterTool").then((m) => m.JsonPathTesterTool),
  { ssr: false }
);

const JsonKeyTool = dynamic(
  () => import("./json/JsonKeyTool").then((m) => m.JsonKeyTool),
  { ssr: false }
);

const JsonCsvConverterTool = dynamic(
  () => import("./json/JsonCsvConverterTool").then((m) => m.JsonCsvConverterTool),
  { ssr: false }
);

// 3. Developer Representative
const UuidGeneratorTool = dynamic(
  () => import("./developer/UuidGeneratorTool").then((m) => m.UuidGeneratorTool),
  { ssr: false }
);

// 4. Encoding Representative
const Base64EncoderTool = dynamic(
  () => import("./encoding/Base64EncoderTool").then((m) => m.Base64EncoderTool),
  { ssr: false }
);

interface ToolRendererProps {
  tool: Tool;
}

export function ToolRenderer({ tool }: ToolRendererProps) {
  switch (tool.slug) {
    // Text Category (12 tools)
    case "word-counter":
      return <WordCounterTool />;
    case "character-counter":
      return <CharacterCounterTool />;
    case "text-statistics":
      return <TextStatisticsTool />;
    case "whitespace-remover":
      return <WhitespaceRemoverTool />;
    case "text-cleaner":
      return <TextCleanerTool />;
    case "case-converter":
      return <CaseConverterTool />;
    case "find-and-replace":
      return <FindReplaceTool />;
    case "find-and-remove":
      return <FindRemoveTool />;
    case "remove-duplicate-lines":
      return <RemoveDuplicateLinesTool />;
    case "sort-lines":
      return <SortLinesTool />;
    case "text-diff":
      return <TextDiffTool />;
    case "text-joiner-splitter":
      return <TextJoinerSplitterTool />;

    // JSON Category (14 tools)
    case "json-formatter":
      return <JsonFormatterTool />;
    case "json-validator":
      return <JsonValidatorTool />;
    case "json-minifier":
      return <JsonMinifierTool />;
    case "json-viewer":
      return <JsonViewerTool />;
    case "json-tree-viewer":
      return <JsonViewerTool isTree />;
    case "json-sorter":
      return <JsonSorterTool />;
    case "json-flatten":
      return <JsonFlattenTool mode="flatten" />;
    case "json-unflatten":
      return <JsonFlattenTool mode="unflatten" />;
    case "json-diff":
      return <JsonDiffTool />;
    case "json-path-tester":
      return <JsonPathTesterTool />;
    case "json-key-extractor":
      return <JsonKeyTool mode="extract" />;
    case "json-key-remover":
      return <JsonKeyTool mode="remove" />;
    case "json-to-csv":
      return <JsonCsvConverterTool mode="json-to-csv" />;
    case "csv-to-json":
      return <JsonCsvConverterTool mode="csv-to-json" />;

    // Representative Tools
    case "uuid-generator":
      return <UuidGeneratorTool />;
    case "base64-encoder":
      return <Base64EncoderTool />;

    // Remaining upcoming tools
    default:
      return (
        <ToolWorkspace className="text-center py-12 px-6 space-y-6">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <Sparkles className="h-6 w-6" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-lg font-bold text-foreground">
              {tool.name} Engine Initialized
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              This utility is part of Phase 1 launch matrix ({tool.id}). The dedicated workspace is being finalized in the next release batch.
            </p>
          </div>

          <div className="pt-4 border-t border-border/50 max-w-lg mx-auto">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Try our live tools now:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <Link
                href="/tools/word-counter"
                className="p-2.5 rounded-lg border border-border/70 bg-muted/20 hover:bg-muted/40 font-medium text-foreground flex items-center justify-between"
              >
                <span>Word Counter</span>
                <ArrowRight className="h-3 w-3 text-primary" />
              </Link>
              <Link
                href="/tools/case-converter"
                className="p-2.5 rounded-lg border border-border/70 bg-muted/20 hover:bg-muted/40 font-medium text-foreground flex items-center justify-between"
              >
                <span>Case Converter</span>
                <ArrowRight className="h-3 w-3 text-primary" />
              </Link>
              <Link
                href="/tools/json-formatter"
                className="p-2.5 rounded-lg border border-border/70 bg-muted/20 hover:bg-muted/40 font-medium text-foreground flex items-center justify-between"
              >
                <span>JSON Formatter</span>
                <ArrowRight className="h-3 w-3 text-primary" />
              </Link>
              <Link
                href="/tools/uuid-generator"
                className="p-2.5 rounded-lg border border-border/70 bg-muted/20 hover:bg-muted/40 font-medium text-foreground flex items-center justify-between"
              >
                <span>UUID Generator</span>
                <ArrowRight className="h-3 w-3 text-primary" />
              </Link>
            </div>
          </div>
        </ToolWorkspace>
      );
  }
}
