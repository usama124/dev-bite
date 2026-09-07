import { safeFilename } from "./validation";

export function createDownloadBlob(content: BlobPart | BlobPart[], mimeType = "application/octet-stream") {
  return new Blob(Array.isArray(content) ? content : [content], { type: mimeType });
}

export function createObjectURL(blob: Blob) {
  return URL.createObjectURL(blob);
}

export function revokeObjectURL(url: string) {
  URL.revokeObjectURL(url);
}

export function downloadBlob(blob: Blob, filename: string) {
  const objectUrl = createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = objectUrl; anchor.download = safeFilename(filename); anchor.style.display = "none";
  document.body.appendChild(anchor); anchor.click(); anchor.remove();
  window.setTimeout(() => revokeObjectURL(objectUrl), 0);
}
