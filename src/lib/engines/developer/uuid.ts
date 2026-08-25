export type UuidVersion = "v4" | "v7" | "v1" | "nil";

export type UuidFormat = "plain" | "braces" | "quotes" | "array" | "csv";

export interface UuidGenerateOptions {
  version?: UuidVersion;
  quantity?: number;
  uppercase?: boolean;
  hyphens?: boolean;
  format?: UuidFormat;
}

export interface UuidValidationResult {
  valid: boolean;
  version?: string;
  variant?: string;
  timestamp?: Date;
  error?: string;
}

// Generate random bytes using Web Crypto API or Node crypto
function getRandomBytes(length: number): Uint8Array {
  const bytes = new Uint8Array(length);
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    crypto.getRandomValues(bytes);
  } else {
    // Fallback for environments where crypto is not directly global
    for (let i = 0; i < length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
  }
  return bytes;
}

// Generate UUID v4
export function generateUuidV4(): string {
  const bytes = getRandomBytes(16);
  // Set version 4 (0100) at bits 48..51
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  // Set variant RFC 4122 (10..) at bits 64..65
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  return bytesToHex(bytes);
}

// Generate UUID v7 (RFC 9562)
export function generateUuidV7(timestampMs = Date.now()): string {
  const bytes = getRandomBytes(16);

  // 48-bit timestamp
  const ts = BigInt(timestampMs);
  bytes[0] = Number((ts >> 40n) & 0xffn);
  bytes[1] = Number((ts >> 32n) & 0xffn);
  bytes[2] = Number((ts >> 24n) & 0xffn);
  bytes[3] = Number((ts >> 16n) & 0xffn);
  bytes[4] = Number((ts >> 8n) & 0xffn);
  bytes[5] = Number(ts & 0xffn);

  // Set version 7 (0111)
  bytes[6] = (bytes[6] & 0x0f) | 0x70;
  // Set variant RFC 4122 (10..)
  bytes[8] = (bytes[8] & 0x3f) | 0x80;

  return bytesToHex(bytes);
}

// Generate UUID v1 (Time-based RFC 4122)
let v1LastTime = 0;
let v1ClockSeq = Math.floor(Math.random() * 0x3fff);

export function generateUuidV1(): string {
  let msecs = Date.now();
  if (msecs <= v1LastTime) {
    v1ClockSeq = (v1ClockSeq + 1) & 0x3fff;
  } else {
    v1LastTime = msecs;
  }

  // UUID v1 uses 100-nanosecond intervals since Oct 15, 1582
  const uuidEpoch = 12219292800000n;
  const timeNanoseconds = (BigInt(msecs) + uuidEpoch) * 10000n;

  const timeLow = Number(timeNanoseconds & 0xffffffffn);
  const timeMid = Number((timeNanoseconds >> 32n) & 0xffffn);
  const timeHiAndVersion = Number((timeNanoseconds >> 48n) & 0x0fffn) | 0x1000;

  const clockSeqHi = (v1ClockSeq >> 8) | 0x80;
  const clockSeqLow = v1ClockSeq & 0xff;

  const nodeBytes = getRandomBytes(6);
  nodeBytes[0] |= 0x01; // Multicast bit for random node

  const bytes = new Uint8Array(16);
  bytes[0] = (timeLow >> 24) & 0xff;
  bytes[1] = (timeLow >> 16) & 0xff;
  bytes[2] = (timeLow >> 8) & 0xff;
  bytes[3] = timeLow & 0xff;
  bytes[4] = (timeMid >> 8) & 0xff;
  bytes[5] = timeMid & 0xff;
  bytes[6] = (timeHiAndVersion >> 8) & 0xff;
  bytes[7] = timeHiAndVersion & 0xff;
  bytes[8] = clockSeqHi;
  bytes[9] = clockSeqLow;
  bytes.set(nodeBytes, 10);

  return bytesToHex(bytes);
}

function bytesToHex(bytes: Uint8Array): string {
  const hex = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

export function generateUuids(options: UuidGenerateOptions = {}): string[] {
  const {
    version = "v4",
    quantity = 1,
    uppercase = false,
    hyphens = true,
    format = "plain",
  } = options;

  const count = Math.min(Math.max(1, quantity), 1000);
  const rawList: string[] = [];

  for (let i = 0; i < count; i++) {
    let raw = "";
    if (version === "nil") {
      raw = "00000000-0000-0000-0000-000000000000";
    } else if (version === "v7") {
      raw = generateUuidV7();
    } else if (version === "v1") {
      raw = generateUuidV1();
    } else {
      raw = generateUuidV4();
    }

    if (!hyphens) {
      raw = raw.replace(/-/g, "");
    }

    if (uppercase) {
      raw = raw.toUpperCase();
    }

    rawList.push(raw);
  }

  return rawList;
}

export function formatUuidOutput(uuids: string[], format: UuidFormat): string {
  if (format === "braces") {
    return uuids.map((u) => `{${u}}`).join("\n");
  }
  if (format === "quotes") {
    return uuids.map((u) => `"${u}"`).join(",\n");
  }
  if (format === "array") {
    return JSON.stringify(uuids, null, 2);
  }
  if (format === "csv") {
    return uuids.join(", ");
  }
  return uuids.join("\n");
}

export function validateUuid(input: string): UuidValidationResult {
  if (!input || input.trim() === "") {
    return { valid: false, error: "Input is empty." };
  }

  const clean = input.trim().replace(/[{}]/g, "");
  const standardPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-([1-8])[0-9a-f]{3}-([89ab])[0-9a-f]{3}-[0-9a-f]{12}$/i;
  const compactPattern = /^[0-9a-f]{8}[0-9a-f]{4}([1-8])[0-9a-f]{3}([89ab])[0-9a-f]{3}[0-9a-f]{12}$/i;

  let match = clean.match(standardPattern);
  if (!match) {
    match = clean.match(compactPattern);
  }

  if (clean === "00000000-0000-0000-0000-000000000000" || clean === "00000000000000000000000000000000") {
    return { valid: true, version: "Nil (All Zeros)", variant: "RFC 4122" };
  }

  if (!match) {
    return { valid: false, error: "Not a valid RFC 4122 or RFC 9562 UUID." };
  }

  const verDigit = match[1];
  const variantDigit = match[2].toLowerCase();
  const versionMap: Record<string, string> = {
    "1": "v1 (Gregorian time)",
    "2": "v2 (DCE Security)",
    "3": "v3 (MD5 hash)",
    "4": "v4 (Random)",
    "5": "v5 (SHA-1 hash)",
    "7": "v7 (Unix Epoch time)",
    "8": "v8 (Custom)",
  };

  let timestamp: Date | undefined;
  if (verDigit === "7") {
    const hexClean = clean.replace(/-/g, "");
    const timeHex = hexClean.slice(0, 12);
    const ms = parseInt(timeHex, 16);
    if (!isNaN(ms)) {
      timestamp = new Date(ms);
    }
  }

  return {
    valid: true,
    version: versionMap[verDigit] || `v${verDigit}`,
    variant: `RFC 4122 (Variant ${variantDigit})`,
    timestamp,
  };
}
