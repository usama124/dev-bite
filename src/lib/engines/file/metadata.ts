import type { FileLike } from "./types";
import { formatFileSize, safeFilename } from "./validation";

export function getFileExtension(filename: string) {
  const basename = filename.split(/[\\/]/).at(-1) ?? filename;
  const index = basename.lastIndexOf(".");
  return index > 0 && index < basename.length - 1 ? basename.slice(index + 1).toLowerCase() : "";
}

export function getFileMetadata(file: FileLike) {
  const lastModified = Number.isFinite(file.lastModified) && file.lastModified > 0 ? new Date(file.lastModified).toISOString() : null;
  return {
    name: file.name,
    safeName: safeFilename(file.name),
    extension: getFileExtension(file.name) || null,
    mimeType: file.type || "application/octet-stream",
    sizeBytes: file.size,
    sizeDecimal: formatFileSize(file.size, { base: 1000 }),
    sizeBinary: formatFileSize(file.size, { base: 1024 }),
    lastModified,
  };
}
