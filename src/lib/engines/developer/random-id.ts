export const RANDOM_ID_ALPHABETS = {
  alphanumeric: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  letters: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  lowercase: "abcdefghijklmnopqrstuvwxyz0123456789",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  numeric: "0123456789",
  hexadecimal: "0123456789abcdef",
} as const;

export type RandomIdAlphabet = keyof typeof RANDOM_ID_ALPHABETS;

export interface RandomIdOptions {
  length?: number;
  quantity?: number;
  alphabet?: RandomIdAlphabet;
  customAlphabet?: string;
  prefix?: string;
  suffix?: string;
  excludeAmbiguous?: boolean;
}

function secureRandomIndex(max: number): number {
  if (max < 1 || max > 256) throw new Error("Alphabet must contain between 1 and 256 unique characters.");
  const limit = 256 - (256 % max);
  const byte = new Uint8Array(1);
  do {
    if (typeof globalThis.crypto !== "undefined" && typeof globalThis.crypto.getRandomValues === "function") {
      globalThis.crypto.getRandomValues(byte);
    } else {
      byte[0] = Math.floor(Math.random() * 256);
    }
  } while (byte[0] >= limit);
  return byte[0] % max;
}

export function generateRandomIds(options: RandomIdOptions = {}): string[] {
  const {
    length = 16,
    quantity = 1,
    alphabet = "alphanumeric",
    customAlphabet,
    prefix = "",
    suffix = "",
    excludeAmbiguous = false,
  } = options;

  if (!Number.isInteger(length) || length < 1 || length > 256) {
    throw new Error("ID length must be a whole number between 1 and 256.");
  }
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 1000) {
    throw new Error("Quantity must be a whole number between 1 and 1000.");
  }

  const source = customAlphabet !== undefined ? customAlphabet : RANDOM_ID_ALPHABETS[alphabet];
  const uniqueCharacters = Array.from(new Set(Array.from(source)));
  const characters = excludeAmbiguous
    ? uniqueCharacters.filter((character) => !"0O1lI".includes(character))
    : uniqueCharacters;

  if (characters.length < 2) throw new Error("The selected alphabet must contain at least two usable characters.");
  if (characters.length > 256) throw new Error("The selected alphabet cannot contain more than 256 unique characters.");

  return Array.from({ length: quantity }, () => {
    let value = "";
    for (let index = 0; index < length; index++) value += characters[secureRandomIndex(characters.length)];
    return `${prefix}${value}${suffix}`;
  });
}
