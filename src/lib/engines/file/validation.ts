import type { FileLike, FileValidationOptions, FileValidationResult } from "./types";

function extensionOf(name: string) {
  const match = name.toLowerCase().match(/(?:^|\.)([^./]+)$/);
  return match && name.includes(".") ? `.${match[1]}` : "";
}

function matchesAllowedType(file: FileLike, allowed: string) {
  const rule = allowed.trim().toLowerCase();
  if (!rule) return false;
  if (rule.startsWith(".")) return extensionOf(file.name) === rule;
  if (rule.endsWith("/*")) return file.type.toLowerCase().startsWith(rule.slice(0, -1));
  return file.type.toLowerCase() === rule;
}

export function validateFile(file: FileLike, options: FileValidationOptions = {}): FileValidationResult {
  const errors: string[] = [];
  if (!options.allowEmpty && file.size === 0) errors.push("The selected file is empty.");
  if (options.maxSizeBytes !== undefined && file.size > options.maxSizeBytes) errors.push(`The selected file exceeds the ${formatFileSize(options.maxSizeBytes, { base: 1024 })} limit.`);
  if (options.allowedTypes?.length && !options.allowedTypes.some((allowed) => matchesAllowedType(file, allowed))) errors.push(`Unsupported file type. Allowed: ${options.allowedTypes.join(", ")}.`);
  return { valid: errors.length === 0, errors };
}

export function safeFilename(input: string, fallback = "download") {
  const normalized = input.normalize("NFKC").trim().replace(/[\u0000-\u001f\u007f<>:"/\\|?*]+/g, "-").replace(/\s+/g, " ").replace(/-+/g, "-").replace(/^[. -]+|[. -]+$/g, "");
  const safe = normalized || fallback;
  if (safe.length <= 180) return safe;
  const extensionIndex = safe.lastIndexOf(".");
  const extension = extensionIndex > 0 && safe.length - extensionIndex <= 16 ? safe.slice(extensionIndex) : "";
  return `${safe.slice(0, 180 - extension.length).trimEnd()}${extension}`;
}

export function formatFileSize(bytes: number, options: { base?: 1000 | 1024; decimals?: number } = {}) {
  if (!Number.isFinite(bytes) || bytes < 0) throw new Error("File size must be a non-negative finite number.");
  const base = options.base ?? 1024; const decimals = Math.max(0, options.decimals ?? 2);
  const units = base === 1000 ? ["B", "KB", "MB", "GB", "TB"] : ["B", "KiB", "MiB", "GiB", "TiB"];
  if (bytes === 0) return "0 B";
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(base)), units.length - 1);
  const value = bytes / base ** exponent;
  return `${Number(value.toFixed(decimals)).toLocaleString("en-US", { maximumFractionDigits: decimals })} ${units[exponent]}`;
}

export function convertFileSize(bytes: number, base: 1000 | 1024 = 1024) {
  if (!Number.isFinite(bytes) || bytes < 0) throw new Error("File size must be a non-negative finite number.");
  const names = base === 1000 ? ["bytes", "KB", "MB", "GB", "TB"] : ["bytes", "KiB", "MiB", "GiB", "TiB"];
  return Object.fromEntries(names.map((unit, index) => [unit, bytes / base ** index]));
}
