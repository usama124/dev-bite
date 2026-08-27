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

// 3. Developer Category Tools (12/12 Live)
const UuidGeneratorTool = dynamic(
  () => import("./developer/UuidGeneratorTool").then((m) => m.UuidGeneratorTool),
  { ssr: false }
);

const UuidValidatorTool = dynamic(
  () => import("./developer/UuidValidatorTool").then((m) => m.UuidValidatorTool),
  { ssr: false }
);

const UuidVersionGeneratorTool = dynamic(
  () => import("./developer/UuidVersionGeneratorTool").then((m) => m.UuidVersionGeneratorTool),
  { ssr: false }
);

const RandomIdGeneratorTool = dynamic(
  () => import("./developer/RandomIdGeneratorTool").then((m) => m.RandomIdGeneratorTool),
  { ssr: false }
);

const RegexTool = dynamic(
  () => import("./developer/RegexTool").then((m) => m.RegexTool),
  { ssr: false }
);

const TimestampConverterTool = dynamic(
  () => import("./developer/TimestampConverterTool").then((m) => m.TimestampConverterTool),
  { ssr: false }
);

const TimezoneConverterTool = dynamic(
  () => import("./developer/TimezoneConverterTool").then((m) => m.TimezoneConverterTool),
  { ssr: false }
);

const UrlParserTool = dynamic(
  () => import("./developer/UrlParserTool").then((m) => m.UrlParserTool),
  { ssr: false }
);

const CronHumanReadableTool = dynamic(
  () => import("./developer/CronHumanReadableTool").then((m) => m.CronHumanReadableTool),
  { ssr: false }
);

// 4. Encoding Category Tools (10/10 Live)
const Base64EncoderTool = dynamic(
  () => import("./encoding/Base64EncoderTool").then((m) => m.Base64EncoderTool),
  { ssr: false }
);

const Base64CodecTool = dynamic(
  () => import("./encoding/Base64CodecTool").then((m) => m.Base64CodecTool),
  { ssr: false }
);

const UrlCodecTool = dynamic(
  () => import("./encoding/UrlCodecTool").then((m) => m.UrlCodecTool),
  { ssr: false }
);

const HtmlEntityTool = dynamic(
  () => import("./encoding/HtmlEntityTool").then((m) => m.HtmlEntityTool),
  { ssr: false }
);

const HexCodecTool = dynamic(
  () => import("./encoding/HexCodecTool").then((m) => m.HexCodecTool),
  { ssr: false }
);

// Phase 2 Security tools
const PasswordGeneratorTool = dynamic(() => import("./security/PasswordGeneratorTool").then((m) => m.PasswordGeneratorTool), { ssr: false });
const PasswordStrengthCheckerTool = dynamic(() => import("./security/PasswordStrengthCheckerTool").then((m) => m.PasswordStrengthCheckerTool), { ssr: false });
const HashGeneratorTool = dynamic(() => import("./security/HashGeneratorTool").then((m) => m.HashGeneratorTool), { ssr: false });
const JwtDecoderTool = dynamic(() => import("./security/JwtDecoderTool").then((m) => m.JwtDecoderTool), { ssr: false });
const SecretTokenGeneratorTool = dynamic(() => import("./security/SecretTokenGeneratorTool").then((m) => m.SecretTokenGeneratorTool), { ssr: false });
const SecurityAdvancedTool = dynamic(() => import("./security/SecurityAdvancedTool").then((m) => m.SecurityAdvancedTool), { ssr: false });

// Phase 2 Data tools
const CsvViewerTool = dynamic(() => import("./data/CsvViewerTool").then((m) => m.CsvViewerTool), { ssr: false });
const CsvCoreTool = dynamic(() => import("./data/CsvCoreTool").then((m) => m.CsvCoreTool), { ssr: false });
const JsonlTool = dynamic(() => import("./data/JsonlTool").then((m) => m.JsonlTool), { ssr: false });
const DataTransformTool = dynamic(() => import("./data/DataTransformTool").then((m) => m.DataTransformTool), { ssr: false });

// Phase 2 SQL tools
const SqlTool = dynamic(() => import("./sql/SqlTool").then((m) => m.SqlTool), { ssr: false });

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

    // Developer Category (12 tools)
    case "uuid-generator":
      return <UuidGeneratorTool />;
    case "uuid-validator":
      return <UuidValidatorTool />;
    case "uuid-v4-generator":
      return <UuidVersionGeneratorTool version="v4" />;
    case "uuid-v7-generator":
      return <UuidVersionGeneratorTool version="v7" />;
    case "random-id-generator":
      return <RandomIdGeneratorTool />;
    case "regex-tester":
      return <RegexTool mode="test" />;
    case "regex-replace":
      return <RegexTool mode="replace" />;
    case "regex-extractor":
      return <RegexTool mode="extract" />;
    case "unix-timestamp-converter":
      return <TimestampConverterTool />;
    case "timezone-converter":
      return <TimezoneConverterTool />;
    case "url-parser":
      return <UrlParserTool />;
    case "cron-to-human-readable":
      return <CronHumanReadableTool />;

    // Encoding Category (10 tools)
    case "base64-encoder":
      return <Base64EncoderTool />;
    case "base64-decoder":
      return <Base64CodecTool mode="decode" />;
    case "base64-url-encoder":
      return <Base64CodecTool mode="url-encode" />;
    case "base64-url-decoder":
      return <Base64CodecTool mode="url-decode" />;
    case "url-encoder":
      return <UrlCodecTool operation="encode" />;
    case "url-decoder":
      return <UrlCodecTool operation="decode" />;
    case "html-encoder":
      return <HtmlEntityTool operation="encode" />;
    case "html-decoder":
      return <HtmlEntityTool operation="decode" />;
    case "hex-encoder":
      return <HexCodecTool operation="encode" />;
    case "hex-decoder":
      return <HexCodecTool operation="decode" />;

    // Phase 2 Security (18 tools)
    case "password-generator":
      return <PasswordGeneratorTool />;
    case "password-strength-checker":
      return <PasswordStrengthCheckerTool />;
    case "hash-generator":
      return <HashGeneratorTool />;
    case "jwt-decoder":
      return <JwtDecoderTool />;
    case "secret-token-generator":
      return <SecretTokenGeneratorTool />;
    case "hmac-generator":
      return <SecurityAdvancedTool mode="hmac-generate" />;
    case "hmac-validator":
      return <SecurityAdvancedTool mode="hmac-validate" />;
    case "jwt-generator":
      return <SecurityAdvancedTool mode="jwt-generate" />;
    case "jwt-validator":
      return <SecurityAdvancedTool mode="jwt-validate" />;
    case "fernet-key-generator":
      return <SecurityAdvancedTool mode="fernet-key" />;
    case "fernet-encrypt":
      return <SecurityAdvancedTool mode="fernet-encrypt" />;
    case "fernet-decrypt":
      return <SecurityAdvancedTool mode="fernet-decrypt" />;
    case "aes-encrypt-decrypt":
      return <SecurityAdvancedTool mode="aes" />;
    case "rsa-key-pair-generator":
      return <SecurityAdvancedTool mode="rsa-key" />;
    case "rsa-encrypt-decrypt":
      return <SecurityAdvancedTool mode="rsa-crypt" />;
    case "rsa-sign-verify":
      return <SecurityAdvancedTool mode="rsa-sign" />;
    case "random-bytes-generator":
      return <SecurityAdvancedTool mode="random-bytes" />;
    case "checksum-generator":
      return <SecurityAdvancedTool mode="checksum" />;

    // Phase 2 SQL (15 tools)
    case "sql-formatter": return <SqlTool mode="format" />;
    case "sql-minifier": return <SqlTool mode="minify" />;
    case "sql-validator": return <SqlTool mode="validate" />;
    case "sql-beautifier": return <SqlTool mode="beautify" />;
    case "sql-to-json": return <SqlTool mode="to-json" />;
    case "sql-to-csv": return <SqlTool mode="to-csv" />;
    case "sql-to-insert": return <SqlTool mode="to-insert" />;
    case "insert-to-sql": return <SqlTool mode="insert-parse" />;
    case "sql-in-clause-generator": return <SqlTool mode="in-clause" />;
    case "sql-where-clause-builder": return <SqlTool mode="where" />;
    case "sql-table-generator": return <SqlTool mode="table" />;
    case "sql-update-generator": return <SqlTool mode="update" />;
    case "sql-delete-generator": return <SqlTool mode="delete" />;
    case "sql-join-generator": return <SqlTool mode="join" />;
    case "sql-query-explainer": return <SqlTool mode="explain" />;

    // Phase 2 Data (24 tools)
    case "csv-viewer":
      return <CsvViewerTool />;
    case "csv-formatter":
      return <CsvCoreTool mode="format" />;
    case "csv-validator":
      return <CsvCoreTool mode="validate" />;
    case "data-csv-to-json":
      return <CsvCoreTool mode="csv-to-json" />;
    case "data-json-to-csv":
      return <CsvCoreTool mode="json-to-csv" />;
    case "jsonl-formatter":
      return <JsonlTool mode="format" />;
    case "jsonl-to-json":
      return <JsonlTool mode="jsonl-to-json" />;
    case "json-to-jsonl":
      return <JsonlTool mode="json-to-jsonl" />;
    case "csv-to-tsv": return <DataTransformTool mode="csv-to-tsv" />;
    case "tsv-to-csv": return <DataTransformTool mode="tsv-to-csv" />;
    case "csv-column-extractor": return <DataTransformTool mode="extract" />;
    case "csv-column-remover": return <DataTransformTool mode="remove" />;
    case "csv-column-renamer": return <DataTransformTool mode="rename" />;
    case "csv-sorter": return <DataTransformTool mode="sort" />;
    case "csv-filter": return <DataTransformTool mode="filter" />;
    case "csv-deduplicator": return <DataTransformTool mode="deduplicate" />;
    case "csv-merger": return <DataTransformTool mode="merge" />;
    case "csv-splitter": return <DataTransformTool mode="split" />;
    case "csv-transpose": return <DataTransformTool mode="transpose" />;
    case "csv-statistics": return <DataTransformTool mode="statistics" />;
    case "csv-to-markdown-table": return <DataTransformTool mode="markdown" />;
    case "delimited-text-converter": return <DataTransformTool mode="delimiter" />;
    case "data-cleaner": return <DataTransformTool mode="clean" />;
    case "column-row-counter": return <DataTransformTool mode="count" />;

    // Registry fallback for future additions
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
