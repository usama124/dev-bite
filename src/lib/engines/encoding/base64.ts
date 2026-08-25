export interface Base64EncodeOptions {
  urlSafe?: boolean;
  padding?: boolean;
  lineWrap?: number; // 0 for no wrap, 64 or 76
}

export interface Base64DecodeOptions {
  urlSafe?: boolean;
}

export interface Base64Result {
  success: boolean;
  output: string;
  error?: string;
  byteSize: number;
  charCount: number;
}

export interface Base64BytesResult {
  success: boolean;
  bytes: Uint8Array;
  error?: string;
}

// Convert Uint8Array to standard Base64 string
export function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Convert Base64 string to Uint8Array
export function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

function normalizeBase64(input: string): { value?: string; error?: string } {
  let sanitized = input.trim().replace(/\s+/g, "").replace(/-/g, "+").replace(/_/g, "/");
  if (sanitized.length % 4 === 1) {
    return { error: "Invalid Base64 length. The encoded value cannot have a remainder of one character." };
  }
  const padLength = (4 - (sanitized.length % 4)) % 4;
  sanitized += "=".repeat(padLength);
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(sanitized) || /=/.test(sanitized.slice(0, -2))) {
    return { error: "Invalid Base64 string. Input contains characters outside the Base64 alphabet or misplaced padding." };
  }
  return { value: sanitized };
}

export function decodeBase64ToBytes(input: string): Base64BytesResult {
  if (!input.trim()) return { success: true, bytes: new Uint8Array() };
  try {
    const normalized = normalizeBase64(input);
    if (!normalized.value) return { success: false, bytes: new Uint8Array(), error: normalized.error };
    return { success: true, bytes: base64ToBytes(normalized.value) };
  } catch {
    return { success: false, bytes: new Uint8Array(), error: "Unable to decode Base64 data. Check the input and padding." };
  }
}

export function encodeBase64(
  input: string | Uint8Array,
  options: Base64EncodeOptions = {}
): Base64Result {
  const { urlSafe = false, padding = true, lineWrap = 0 } = options;

  if (typeof input === "string" && input.length === 0) {
    return {
      success: true,
      output: "",
      byteSize: 0,
      charCount: 0,
    };
  }

  try {
    let bytes: Uint8Array;
    if (typeof input === "string") {
      bytes = new TextEncoder().encode(input);
    } else {
      bytes = input;
    }

    let encoded = bytesToBase64(bytes);

    if (urlSafe) {
      encoded = encoded.replace(/\+/g, "-").replace(/\//g, "_");
      if (!padding) {
        encoded = encoded.replace(/=+$/, "");
      }
    } else if (!padding) {
      encoded = encoded.replace(/=+$/, "");
    }

    if (lineWrap > 0) {
      const regex = new RegExp(`.{1,${lineWrap}}`, "g");
      encoded = encoded.match(regex)?.join("\n") || encoded;
    }

    return {
      success: true,
      output: encoded,
      byteSize: bytes.byteLength,
      charCount: encoded.length,
    };
  } catch (err) {
    return {
      success: false,
      output: "",
      error: (err as Error).message || "Failed to encode data.",
      byteSize: 0,
      charCount: 0,
    };
  }
}

export function decodeBase64(
  input: string,
  options: Base64DecodeOptions = {}
): Base64Result {
  if (!input || input.trim() === "") {
    return {
      success: true,
      output: "",
      byteSize: 0,
      charCount: 0,
    };
  }

  try {
    const decoded = decodeBase64ToBytes(input);
    if (!decoded.success) {
      return {
        success: false,
        output: "",
        error: decoded.error,
        byteSize: 0,
        charCount: 0,
      };
    }
    const bytes = decoded.bytes;
    const decodedText = new TextDecoder("utf-8", { fatal: false }).decode(bytes);

    return {
      success: true,
      output: decodedText,
      byteSize: bytes.byteLength,
      charCount: Array.from(decodedText).length,
    };
  } catch (err) {
    return {
      success: false,
      output: "",
      error: "Unable to decode Base64 string. Please check the input formatting.",
      byteSize: 0,
      charCount: 0,
    };
  }
}
