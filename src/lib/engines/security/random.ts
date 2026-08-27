export type SecretFormat = "hex" | "base64" | "base64url" | "alphanumeric" | "url-safe";

function randomIndex(max: number): number {
  if (!Number.isInteger(max) || max < 1 || max > 256) throw new Error("Random alphabet must contain between 1 and 256 characters.");
  const limit = 256 - (256 % max);
  const byte = new Uint8Array(1);
  do crypto.getRandomValues(byte); while (byte[0] >= limit);
  return byte[0] % max;
}

export function secureRandomBytes(length: number): Uint8Array {
  if (!Number.isInteger(length) || length < 1 || length > 65_536) {
    throw new Error("Byte length must be a whole number between 1 and 65,536.");
  }
  const output = new Uint8Array(length);
  for (let offset = 0; offset < length; offset += 65_536) {
    crypto.getRandomValues(output.subarray(offset, Math.min(offset + 65_536, length)));
  }
  return output;
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary);
}

export function formatSecret(bytes: Uint8Array, format: SecretFormat): string {
  if (format === "hex") return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  if (format === "base64") return bytesToBase64(bytes);
  if (format === "base64url") return bytesToBase64(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
  const alphabet = format === "url-safe"
    ? "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~"
    : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length: bytes.length }, () => alphabet[randomIndex(alphabet.length)]).join("");
}

export function generateSecrets(length: number, count: number, format: SecretFormat): string[] {
  if (!Number.isInteger(count) || count < 1 || count > 100) throw new Error("Count must be between 1 and 100.");
  return Array.from({ length: count }, () => formatSecret(secureRandomBytes(length), format));
}

export interface PasswordOptions {
  length: number;
  count: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  excludeAmbiguous: boolean;
}

export function generatePasswords(options: PasswordOptions): string[] {
  if (!Number.isInteger(options.length) || options.length < 4 || options.length > 256) throw new Error("Password length must be between 4 and 256.");
  if (!Number.isInteger(options.count) || options.count < 1 || options.count > 100) throw new Error("Password count must be between 1 and 100.");
  const groups = [
    options.uppercase ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : "",
    options.lowercase ? "abcdefghijklmnopqrstuvwxyz" : "",
    options.numbers ? "0123456789" : "",
    options.symbols ? "!@#$%^&*()-_=+[]{};:,.?/" : "",
  ].filter(Boolean).map((group) => options.excludeAmbiguous ? group.replace(/[Il1O0o|]/g, "") : group);
  if (!groups.length) throw new Error("Select at least one character class.");
  if (options.length < groups.length) throw new Error("Password length must accommodate every selected character class.");
  const alphabet = groups.join("");

  return Array.from({ length: options.count }, () => {
    const chars = groups.map((group) => group[randomIndex(group.length)]);
    while (chars.length < options.length) chars.push(alphabet[randomIndex(alphabet.length)]);
    for (let index = chars.length - 1; index > 0; index--) {
      const swap = randomIndex(index + 1);
      [chars[index], chars[swap]] = [chars[swap], chars[index]];
    }
    return chars.join("");
  });
}
