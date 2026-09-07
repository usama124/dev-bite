import { decodeBase64ToBytes, encodeBase64 } from "../encoding/base64";
import { createDownloadBlob } from "./download";
import type { FileLike, FileReadProgress } from "./types";
import { readFileAsArrayBuffer } from "./io";

export async function fileToBase64(file: FileLike, dataUrl = false, onProgress?: FileReadProgress) {
  const bytes = new Uint8Array(await readFileAsArrayBuffer(file, onProgress));
  const result = encodeBase64(bytes);
  if (!result.success) throw new Error(result.error || "Unable to encode the file.");
  return dataUrl ? `data:${file.type || "application/octet-stream"};base64,${result.output}` : result.output;
}

export function base64ToFile(input: string, mimeType = "application/octet-stream") {
  const trimmed = input.trim(); let encoded = trimmed; let detectedMimeType = mimeType;
  const dataUrl = trimmed.match(/^data:([^;,]+)?;base64,([\s\S]*)$/i);
  if (dataUrl) { detectedMimeType = dataUrl[1] || mimeType; encoded = dataUrl[2]; }
  const result = decodeBase64ToBytes(encoded);
  if (!result.success) throw new Error(result.error || "Unable to decode Base64 data.");
  return { blob: createDownloadBlob(Uint8Array.from(result.bytes).buffer, detectedMimeType), bytes: result.bytes, mimeType: detectedMimeType };
}
