export interface HexEncodeOptions {
  uppercase?: boolean;
  separator?: "" | " " | ":" | "-";
}

export function encodeHex(input: string | Uint8Array, options: HexEncodeOptions = {}): string {
  const { uppercase = false, separator = "" } = options;
  const bytes = typeof input === "string" ? new TextEncoder().encode(input) : input;
  const values = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0"));
  const output = values.join(separator);
  return uppercase ? output.toUpperCase() : output;
}

export function decodeHex(input: string, strictUtf8 = false): {
  success: boolean;
  output: string;
  bytes: Uint8Array;
  error?: string;
} {
  const compact = input.replace(/[\s:-]/g, "");
  if (!compact) return { success: true, output: "", bytes: new Uint8Array() };
  if (!/^[0-9a-f]+$/i.test(compact)) return { success: false, output: "", bytes: new Uint8Array(), error: "Hex input contains characters outside 0–9 and A–F." };
  if (compact.length % 2 !== 0) return { success: false, output: "", bytes: new Uint8Array(), error: "Hex input must contain an even number of digits (two per byte)." };
  const bytes = new Uint8Array(compact.length / 2);
  for (let index = 0; index < compact.length; index += 2) bytes[index / 2] = Number.parseInt(compact.slice(index, index + 2), 16);
  try {
    return { success: true, output: new TextDecoder("utf-8", { fatal: strictUtf8 }).decode(bytes), bytes };
  } catch {
    return { success: false, output: "", bytes, error: "Decoded bytes are not valid UTF-8." };
  }
}
