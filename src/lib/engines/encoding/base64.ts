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
    let sanitized = input.trim().replace(/\s+/g, "");

    // Convert URL-safe characters back to standard Base64
    sanitized = sanitized.replace(/-/g, "+").replace(/_/g, "/");

    // Add back missing padding if necessary
    const padLength = (4 - (sanitized.length % 4)) % 4;
    if (padLength > 0 && padLength < 4) {
      sanitized += "=".repeat(padLength);
    }

    // Validate Base64 characters
    if (!/^[A-Za-z0-9+/]+={0,2}$/.test(sanitized)) {
      return {
        success: false,
        output: "",
        error: "Invalid Base64 string. Input contains characters outside the Base64 alphabet.",
        byteSize: 0,
        charCount: 0,
      };
    }

    const bytes = base64ToBytes(sanitized);
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
