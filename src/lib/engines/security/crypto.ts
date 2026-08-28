import { decodeJwt } from "./jwt";
import { hashBytes, hashText } from "./hash";
import { formatSecret, secureRandomBytes } from "./random";

export type HmacAlgorithm = "SHA-256" | "SHA-384" | "SHA-512";
export type OutputEncoding = "hex" | "base64" | "base64url";

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const asBuffer = (bytes: Uint8Array): ArrayBuffer => Uint8Array.from(bytes).buffer;
const concat = (...parts: Uint8Array[]) => { const output = new Uint8Array(parts.reduce((sum, part) => sum + part.length, 0)); let offset = 0; parts.forEach((part) => { output.set(part, offset); offset += part.length; }); return output; };
export const bytesToBase64 = (bytes: Uint8Array) => { let binary = ""; bytes.forEach((byte) => { binary += String.fromCharCode(byte); }); return btoa(binary); };
export const bytesToBase64Url = (bytes: Uint8Array) => bytesToBase64(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
export const base64ToBytes = (value: string) => { const normalized = value.trim().replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.trim().length / 4) * 4, "="); if (!/^[A-Za-z0-9+/]*={0,2}$/.test(normalized)) throw new Error("Invalid Base64/Base64URL input."); return Uint8Array.from(atob(normalized), (char) => char.charCodeAt(0)); };
export const bytesToHex = (bytes: Uint8Array) => Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
export const hexToBytes = (value: string) => { const clean = value.trim(); if (!/^(?:[0-9a-f]{2})+$/i.test(clean)) throw new Error("Expected an even-length hexadecimal value."); return Uint8Array.from(clean.match(/../g)!, (pair) => Number.parseInt(pair, 16)); };
const encodeOutput = (bytes: Uint8Array, encoding: OutputEncoding) => encoding === "hex" ? bytesToHex(bytes) : encoding === "base64" ? bytesToBase64(bytes) : bytesToBase64Url(bytes);
const decodeOutput = (value: string, encoding: OutputEncoding) => encoding === "hex" ? hexToBytes(value) : base64ToBytes(value);

export async function generateHmac(message: string, secret: string, algorithm: HmacAlgorithm = "SHA-256", encoding: OutputEncoding = "hex"): Promise<string> {
  if (!secret) throw new Error("Secret is required.");
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: algorithm }, false, ["sign"]);
  return encodeOutput(new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(message))), encoding);
}

export async function validateHmac(message: string, secret: string, expected: string, algorithm: HmacAlgorithm = "SHA-256", encoding: OutputEncoding = "hex") {
  const generated = await generateHmac(message, secret, algorithm, encoding);
  let left: Uint8Array; let right: Uint8Array;
  try { left = decodeOutput(generated, encoding); right = decodeOutput(expected, encoding); } catch { return { valid: false, generated }; }
  let difference = left.length ^ right.length;
  const max = Math.max(left.length, right.length);
  for (let index = 0; index < max; index++) difference |= (left[index] ?? 0) ^ (right[index] ?? 0);
  return { valid: difference === 0, generated };
}

const jwtAlgorithm: Record<"HS256" | "HS384" | "HS512", HmacAlgorithm> = { HS256: "SHA-256", HS384: "SHA-384", HS512: "SHA-512" };
export async function generateJwt(headerText: string, payloadText: string, secret: string, algorithm: keyof typeof jwtAlgorithm) {
  const header = JSON.parse(headerText) as Record<string, unknown>; const payload = JSON.parse(payloadText);
  if (header.alg && header.alg !== algorithm) throw new Error(`Header alg must match ${algorithm}.`);
  const encodedHeader = bytesToBase64Url(encoder.encode(JSON.stringify({ ...header, alg: algorithm, typ: header.typ ?? "JWT" })));
  const encodedPayload = bytesToBase64Url(encoder.encode(JSON.stringify(payload)));
  const body = `${encodedHeader}.${encodedPayload}`;
  return `${body}.${await generateHmac(body, secret, jwtAlgorithm[algorithm], "base64url")}`;
}

export async function validateJwt(token: string, secret: string, algorithm: keyof typeof jwtAlgorithm) {
  const decoded = decodeJwt(token); if (decoded.error) throw new Error(decoded.error);
  const header = decoded.header as Record<string, unknown>;
  if (header.alg !== algorithm) throw new Error(`Token declares ${String(header.alg)} but ${algorithm} was selected.`);
  const parts = token.trim().split(".");
  const signature = await generateHmac(`${parts[0]}.${parts[1]}`, secret, jwtAlgorithm[algorithm], "base64url");
  const comparison = await validateHmac(`${parts[0]}.${parts[1]}`, secret, parts[2], jwtAlgorithm[algorithm], "base64url");
  return { valid: comparison.valid && signature === comparison.generated, decoded };
}

const bytesToFernetBase64 = (bytes: Uint8Array) => bytesToBase64(bytes).replace(/\+/g, "-").replace(/\//g, "_");
export function generateFernetKeys(count: number): string[] { if (!Number.isInteger(count) || count < 1 || count > 20) throw new Error("Key count must be between 1 and 20."); return Array.from({ length: count }, () => bytesToFernetBase64(secureRandomBytes(32))); }
function timestampBytes(timestamp = Math.floor(Date.now() / 1000)) { const bytes = new Uint8Array(8); let value = BigInt(timestamp); for (let index = 7; index >= 0; index--) { bytes[index] = Number(value & 255n); value >>= 8n; } return bytes; }
async function fernetMac(key: Uint8Array, data: Uint8Array) { const imported = await crypto.subtle.importKey("raw", asBuffer(key), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]); return new Uint8Array(await crypto.subtle.sign("HMAC", imported, asBuffer(data))); }
export async function fernetEncrypt(plaintext: string, encodedKey: string) {
  const key = base64ToBytes(encodedKey); if (key.length !== 32) throw new Error("Fernet key must decode to exactly 32 bytes.");
  const iv = secureRandomBytes(16); const aes = await crypto.subtle.importKey("raw", asBuffer(key.slice(16)), "AES-CBC", false, ["encrypt"]);
  const ciphertext = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-CBC", iv: asBuffer(iv) }, aes, encoder.encode(plaintext)));
  const signed = concat(new Uint8Array([0x80]), timestampBytes(), iv, ciphertext); return bytesToFernetBase64(concat(signed, await fernetMac(key.slice(0, 16), signed)));
}
export async function fernetDecrypt(token: string, encodedKey: string) {
  const key = base64ToBytes(encodedKey); const bytes = base64ToBytes(token); if (key.length !== 32 || bytes.length < 73 || bytes[0] !== 0x80) throw new Error("Invalid Fernet key or token.");
  const signed = bytes.slice(0, -32); const expected = bytes.slice(-32); const actual = await fernetMac(key.slice(0, 16), signed); let difference = 0; actual.forEach((value, index) => { difference |= value ^ expected[index]; }); if (difference) throw new Error("Fernet authentication failed.");
  const aes = await crypto.subtle.importKey("raw", asBuffer(key.slice(16)), "AES-CBC", false, ["decrypt"]); const plaintext = await crypto.subtle.decrypt({ name: "AES-CBC", iv: asBuffer(bytes.slice(9, 25)) }, aes, asBuffer(bytes.slice(25, -32))); return decoder.decode(plaintext);
}

export interface AesPackage { version: 1; algorithm: "AES-GCM"; iv: string; ciphertext: string; aad?: string }
export async function aesEncrypt(plaintext: string, keyValue: string, aad = ""): Promise<AesPackage> { const keyBytes = base64ToBytes(keyValue); if (![16, 24, 32].includes(keyBytes.length)) throw new Error("AES key must decode to 16, 24 or 32 bytes."); const iv = secureRandomBytes(12); const key = await crypto.subtle.importKey("raw", asBuffer(keyBytes), "AES-GCM", false, ["encrypt"]); const params: AesGcmParams = { name: "AES-GCM", iv: asBuffer(iv) }; if (aad) params.additionalData = encoder.encode(aad); const ciphertext = new Uint8Array(await crypto.subtle.encrypt(params, key, encoder.encode(plaintext))); return { version: 1, algorithm: "AES-GCM", iv: bytesToBase64Url(iv), ciphertext: bytesToBase64Url(ciphertext), ...(aad ? { aad } : {}) }; }
export async function aesDecrypt(packageText: string, keyValue: string) { const value = JSON.parse(packageText) as AesPackage; if (value.algorithm !== "AES-GCM" || value.version !== 1) throw new Error("Only DevBite AES-GCM version 1 packages are supported."); const keyBytes = base64ToBytes(keyValue); const key = await crypto.subtle.importKey("raw", asBuffer(keyBytes), "AES-GCM", false, ["decrypt"]); const params: AesGcmParams = { name: "AES-GCM", iv: asBuffer(base64ToBytes(value.iv)) }; if (value.aad) params.additionalData = encoder.encode(value.aad); return decoder.decode(await crypto.subtle.decrypt(params, key, asBuffer(base64ToBytes(value.ciphertext)))); }

const pem = (label: string, bytes: ArrayBuffer) => { const body = bytesToBase64(new Uint8Array(bytes)).match(/.{1,64}/g)?.join("\n") ?? ""; return `-----BEGIN ${label}-----\n${body}\n-----END ${label}-----`; };
const unpem = (text: string) => asBuffer(base64ToBytes(text.replace(/-----[^-]+-----/g, "").replace(/\s/g, "")));
export async function generateRsaKeyPair(size: 2048 | 3072 | 4096 = 2048) { const keys = await crypto.subtle.generateKey({ name: "RSA-OAEP", modulusLength: size, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" }, true, ["encrypt", "decrypt"]); return { publicKey: pem("PUBLIC KEY", await crypto.subtle.exportKey("spki", keys.publicKey)), privateKey: pem("PRIVATE KEY", await crypto.subtle.exportKey("pkcs8", keys.privateKey)) }; }
export async function rsaEncrypt(plaintext: string, publicPem: string) { const key = await crypto.subtle.importKey("spki", unpem(publicPem), { name: "RSA-OAEP", hash: "SHA-256" }, false, ["encrypt"]); return bytesToBase64Url(new Uint8Array(await crypto.subtle.encrypt({ name: "RSA-OAEP" }, key, encoder.encode(plaintext)))); }
export async function rsaDecrypt(ciphertext: string, privatePem: string) { const key = await crypto.subtle.importKey("pkcs8", unpem(privatePem), { name: "RSA-OAEP", hash: "SHA-256" }, false, ["decrypt"]); return decoder.decode(await crypto.subtle.decrypt({ name: "RSA-OAEP" }, key, base64ToBytes(ciphertext))); }
export async function generateRsaSigningKeyPair(size: 2048 | 3072 | 4096 = 2048) { const keys = await crypto.subtle.generateKey({ name: "RSA-PSS", modulusLength: size, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" }, true, ["sign", "verify"]); return { publicKey: pem("PUBLIC KEY", await crypto.subtle.exportKey("spki", keys.publicKey)), privateKey: pem("PRIVATE KEY", await crypto.subtle.exportKey("pkcs8", keys.privateKey)) }; }
export async function rsaSign(message: string, privatePem: string) { const key = await crypto.subtle.importKey("pkcs8", unpem(privatePem), { name: "RSA-PSS", hash: "SHA-256" }, false, ["sign"]); return bytesToBase64Url(new Uint8Array(await crypto.subtle.sign({ name: "RSA-PSS", saltLength: 32 }, key, encoder.encode(message)))); }
export async function rsaVerify(message: string, signature: string, publicPem: string) { const key = await crypto.subtle.importKey("spki", unpem(publicPem), { name: "RSA-PSS", hash: "SHA-256" }, false, ["verify"]); return crypto.subtle.verify({ name: "RSA-PSS", saltLength: 32 }, key, base64ToBytes(signature), encoder.encode(message)); }

export function crc32(input: string | Uint8Array) { const bytes = typeof input === "string" ? encoder.encode(input) : input; let crc = 0xffffffff; bytes.forEach((byte) => { crc ^= byte; for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0); }); return ((crc ^ 0xffffffff) >>> 0).toString(16).padStart(8, "0"); }
export async function checksum(input: string, algorithm: "CRC32" | "MD5" | "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512") { return algorithm === "CRC32" ? crc32(input) : hashText(input, algorithm); }
export async function checksumBytes(input: Uint8Array, algorithm: "CRC32" | "MD5" | "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512") { return algorithm === "CRC32" ? crc32(input) : hashBytes(input, algorithm); }
export function randomBytesOutput(length: number, encoding: OutputEncoding) { return encodeOutput(secureRandomBytes(length), encoding); }
export function generateAesKey(bytes: 16 | 24 | 32 = 32) { return formatSecret(secureRandomBytes(bytes), "base64url"); }
