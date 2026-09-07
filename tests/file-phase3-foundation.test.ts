import { webcrypto } from "node:crypto";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { base64ToFile, calculateFileHash, convertFileSize, createDownloadBlob, createObjectURL, fileToBase64, formatFileSize, getFileMetadata, readFileAsArrayBuffer, readFileAsDataURL, readFileAsText, revokeObjectURL, safeFilename, validateFile, type FileLike } from "../src/lib/engines/file";

const makeFile = (parts: BlobPart[], name: string, type = "application/octet-stream", lastModified = 1_700_000_000_000) => Object.assign(new Blob(parts, { type }), { name, lastModified }) as FileLike;

beforeAll(() => {
  if (!globalThis.crypto) Object.defineProperty(globalThis, "crypto", { value: webcrypto });
});

afterEach(() => vi.restoreAllMocks());

describe("Phase 3 local file foundation", () => {
  it("formats and converts exact file sizes in decimal and binary systems", () => {
    expect(formatFileSize(0)).toBe("0 B");
    expect(formatFileSize(1024, { base: 1024 })).toBe("1 KiB");
    expect(formatFileSize(1000, { base: 1000 })).toBe("1 KB");
    expect(convertFileSize(1_048_576, 1024).MiB).toBe(1);
    expect(() => formatFileSize(-1)).toThrow(/non-negative/);
  });

  it("validates file type, extension, emptiness and maximum size", () => {
    const image = makeFile([new Uint8Array([1, 2, 3])], "PHOTO.PNG", "image/png");
    expect(validateFile(image, { allowedTypes: ["image/*"], maxSizeBytes: 3 }).valid).toBe(true);
    expect(validateFile(image, { allowedTypes: [".png"] }).valid).toBe(true);
    expect(validateFile(image, { allowedTypes: ["application/pdf"] }).errors.join(" ")).toMatch(/Unsupported/);
    expect(validateFile(image, { maxSizeBytes: 2 }).errors.join(" ")).toMatch(/exceeds/);
    expect(validateFile(makeFile([], "empty.txt", "text/plain")).errors.join(" ")).toMatch(/empty/);
  });

  it("reads binary and UTF-8 files with completion progress", async () => {
    const binary = makeFile([new Uint8Array([0, 255, 1, 128])], "fixture.bin"); const progress: number[] = [];
    expect(Array.from(new Uint8Array(await readFileAsArrayBuffer(binary, (value) => progress.push(value))))).toEqual([0, 255, 1, 128]);
    expect(progress.at(-1)).toBe(100);
    expect(await readFileAsText(makeFile(["Hello, 世界"], "fixture.txt", "text/plain"))).toBe("Hello, 世界");
  });

  it("round-trips text and arbitrary binary files through the shared Base64 engine", async () => {
    const text = makeFile(["DevBite"], "hello.txt", "text/plain"); const encodedText = await fileToBase64(text); const decodedText = base64ToFile(encodedText, "text/plain");
    expect(new TextDecoder().decode(decodedText.bytes)).toBe("DevBite");
    const binary = makeFile([new Uint8Array([0, 255, 16, 128])], "fixture.bin"); const encodedBinary = await fileToBase64(binary); expect(Array.from(base64ToFile(encodedBinary).bytes)).toEqual([0, 255, 16, 128]);
    expect(await readFileAsDataURL(text)).toBe(`data:text/plain;base64,${encodedText}`);
  });

  it("decodes Data URLs and rejects malformed Base64", () => {
    const decoded = base64ToFile("data:text/plain;base64,SGVsbG8=");
    expect(decoded.mimeType).toBe("text/plain"); expect(new TextDecoder().decode(decoded.bytes)).toBe("Hello");
    expect(() => base64ToFile("%%%not-base64%%%")).toThrow(/Invalid Base64/);
  });

  it("hashes a known local fixture through the Phase 2 hash engine", async () => {
    expect(await calculateFileHash(makeFile(["abc"], "abc.txt"), "SHA-256")).toBe("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
  });

  it("creates safe filenames, metadata and non-empty download Blobs", () => {
    expect(safeFilename(" ../unsafe:<report>?.txt ")).toBe("unsafe-report-.txt");
    expect(safeFilename("...", "fallback.bin")).toBe("fallback.bin");
    const file = makeFile(["hello"], "report.TXT", "text/plain"); const metadata = getFileMetadata(file);
    expect(metadata.extension).toBe("txt"); expect(metadata.sizeBytes).toBe(5); expect(metadata.lastModified).toBe("2023-11-14T22:13:20.000Z");
    const blob = createDownloadBlob("hello", "text/plain"); expect(blob.size).toBe(5); expect(blob.type).toBe("text/plain");
  });

  it("uses the centralized object URL create/revoke lifecycle", () => {
    const create = vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:devbite-fixture"); const revoke = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined); const blob = createDownloadBlob("x");
    const url = createObjectURL(blob); revokeObjectURL(url);
    expect(create).toHaveBeenCalledWith(blob); expect(revoke).toHaveBeenCalledWith("blob:devbite-fixture");
  });
});
