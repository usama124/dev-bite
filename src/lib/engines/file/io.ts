import { bytesToBase64 } from "../encoding/base64";
import type { FileLike, FileReadProgress } from "./types";

export async function readFileAsArrayBuffer(file: Blob, onProgress?: FileReadProgress) {
  const reader = file.stream().getReader(); const chunks: Uint8Array[] = []; let loaded = 0;
  while (true) { const { done, value } = await reader.read(); if (done) break; chunks.push(value); loaded += value.byteLength; onProgress?.(file.size ? Math.round((loaded / file.size) * 100) : 100); }
  const bytes = new Uint8Array(loaded); let offset = 0; chunks.forEach((chunk) => { bytes.set(chunk, offset); offset += chunk.byteLength; }); onProgress?.(100); return bytes.buffer;
}

export async function readFileAsText(file: Blob, onProgress?: FileReadProgress) {
  const reader = file.stream().getReader(); const decoder = new TextDecoder(); const chunks: string[] = []; let loaded = 0;
  while (true) { const { done, value } = await reader.read(); if (done) break; chunks.push(decoder.decode(value, { stream: true })); loaded += value.byteLength; onProgress?.(file.size ? Math.round((loaded / file.size) * 100) : 100); }
  chunks.push(decoder.decode()); onProgress?.(100); return chunks.join("");
}

export async function readFileAsDataURL(file: FileLike, onProgress?: FileReadProgress) {
  const buffer = await readFileAsArrayBuffer(file, onProgress);
  return `data:${file.type || "application/octet-stream"};base64,${bytesToBase64(new Uint8Array(buffer))}`;
}
