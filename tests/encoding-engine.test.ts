import { describe, it, expect } from "vitest";
import { encodeBase64, decodeBase64 } from "../src/lib/engines/encoding/base64";

describe("Encoding Engine — Base64 Encoder & Decoder", () => {
  it("should encode and decode ASCII text", () => {
    const text = "DevBite - Free Developer Utilities";
    const encoded = encodeBase64(text);

    expect(encoded.success).toBe(true);
    expect(encoded.output).toBe("RGV2Qml0ZSAtIEZyZWUgRGV2ZWxvcGVyIFV0aWxpdGllcw==");

    const decoded = decodeBase64(encoded.output);
    expect(decoded.success).toBe(true);
    expect(decoded.output).toBe(text);
  });

  it("should handle UTF-8 multibyte characters and emojis without corrupting", () => {
    const unicodeText = "Hello 世界 🚀 Café & Crème 🥑";
    const encoded = encodeBase64(unicodeText);

    expect(encoded.success).toBe(true);

    const decoded = decodeBase64(encoded.output);
    expect(decoded.success).toBe(true);
    expect(decoded.output).toBe(unicodeText);
  });

  it("should support URL-safe Base64 without plus and slash", () => {
    const special = ">>>???~~~";
    const std = encodeBase64(special, { urlSafe: false });
    const urlSafe = encodeBase64(special, { urlSafe: true, padding: false });

    expect(urlSafe.output).not.toContain("+");
    expect(urlSafe.output).not.toContain("/");
    expect(urlSafe.output).not.toContain("=");

    const decoded = decodeBase64(urlSafe.output);
    expect(decoded.success).toBe(true);
    expect(decoded.output).toBe(special);
  });

  it("should handle invalid Base64 input gracefully", () => {
    const invalid = "This is not valid base64!@#$";
    const decoded = decodeBase64(invalid);

    expect(decoded.success).toBe(false);
    expect(decoded.error).toBeDefined();
  });
});
