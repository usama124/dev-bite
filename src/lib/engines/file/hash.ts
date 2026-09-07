import { hashBytes, type HashAlgorithm } from "../security/hash";
import type { FileReadProgress } from "./types";
import { readFileAsArrayBuffer } from "./io";

export async function calculateFileHash(file: Blob, algorithm: HashAlgorithm, onProgress?: FileReadProgress) {
  const bytes = new Uint8Array(await readFileAsArrayBuffer(file, onProgress));
  return hashBytes(bytes, algorithm);
}
