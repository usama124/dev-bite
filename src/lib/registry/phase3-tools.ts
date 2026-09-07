import type { Tool, ToolPriority } from "./types";

type FileSeed = {
  id: string;
  slug: string;
  name: string;
  priority: ToolPriority;
  purpose: string;
  input: string;
  output: string;
  related: string[];
};

const fileSeeds: FileSeed[] = [
  { id: "FILE01", slug: "file-hash-calculator", name: "File Hash Calculator", priority: "P1", purpose: "Calculate MD5 and SHA-family hashes for a local file", input: "One local file and a hash algorithm", output: "Hexadecimal file hash", related: ["S03", "S18", "FILE03", "FILE06"] },
  { id: "FILE02", slug: "file-size-converter", name: "File Size Converter", priority: "P1", purpose: "Inspect a local file size using decimal and binary units", input: "One local file and a unit system", output: "Converted file sizes", related: ["FILE03", "FILE01", "FILE06"] },
  { id: "FILE03", slug: "file-metadata-viewer", name: "File Metadata Viewer", priority: "P1", purpose: "Inspect browser-visible metadata for a local file", input: "One local file", output: "Name, type, extension, size and modification metadata", related: ["FILE02", "FILE01", "FILE06"] },
  { id: "FILE06", slug: "file-to-base64", name: "File to Base64", priority: "P1", purpose: "Encode local binary or text files as Base64", input: "One local file and output mode", output: "Raw Base64 or a Data URL", related: ["FILE07", "E01", "E03", "FILE01"] },
  { id: "FILE07", slug: "base64-to-file", name: "Base64 to File", priority: "P1", purpose: "Decode Base64 or a Data URL into a downloadable local file", input: "Base64 data, filename and MIME type", output: "Validated downloadable file", related: ["FILE06", "E02", "E04", "FILE03"] },
];

export const PHASE3_STEP1_TOOLS: Tool[] = fileSeeds.map((seed) => ({
  id: seed.id,
  slug: seed.slug,
  name: seed.name,
  category: "file",
  priority: seed.priority,
  shortDescription: `${seed.purpose}.`,
  description: `${seed.purpose}. Processing happens entirely in your browser; file contents are never uploaded to DevBite servers.`,
  keywords: [seed.name.toLowerCase(), `${seed.name.toLowerCase()} online`, `private ${seed.name.toLowerCase()}`, "local file tool", seed.slug],
  seoTitle: `${seed.name} — Free Private Online Tool`,
  seoDescription: `Use DevBite's ${seed.name.toLowerCase()} to ${seed.purpose.toLowerCase()}. Files stay private in your browser with no installation required.`,
  inputLabel: seed.input,
  outputLabel: seed.output,
  supportsCopy: true,
  supportsDownload: true,
  supportsClear: true,
  supportsSample: false,
  downloadFilename: `${seed.slug}-output.txt`,
  clientSide: true,
  execution: "client",
  phase: 3,
  relatedToolIds: seed.related,
  faqs: [
    { question: `Does ${seed.name} upload my file?`, answer: `No. ${seed.name} reads and processes the selected file locally with browser APIs. File bytes are not sent to a DevBite backend.` },
    { question: `What limits apply to ${seed.name}?`, answer: "The tool validates input before processing and applies a configurable browser-safety size limit. Larger files should be handled with a desktop utility." },
    { question: `Does ${seed.name} work on mobile?`, answer: "Yes, when the browser permits local file selection. The workspace adapts to mobile, tablet and desktop screens." },
  ],
  examples: [{ title: "Local file workflow", description: `Choose a local file, select the available options, process it in the browser, and review the ${seed.output.toLowerCase()}.` }],
  features: ["Local browser-only processing", "File type and size validation", "Progress and actionable errors", "Copy or local download where applicable"],
  howToUse: [`Choose ${seed.input.toLowerCase()}.`, "Review the file details and configure the available options.", "Process the file locally and review the result.", "Copy or download the result, then reset the workspace when finished."],
  status: "active",
}));
