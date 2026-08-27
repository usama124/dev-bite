import { describe, expect, it } from "vitest";
import { webcrypto } from "node:crypto";
import { aesDecrypt, aesEncrypt, checksum, fernetDecrypt, fernetEncrypt, generateAesKey, generateFernetKeys, generateHmac, generateJwt, generateRsaKeyPair, generateRsaSigningKeyPair, randomBytesOutput, rsaDecrypt, rsaEncrypt, rsaSign, rsaVerify, validateHmac, validateJwt } from "../src/lib/engines/security";

Object.defineProperty(globalThis, "crypto", { value: webcrypto, configurable: true });

describe("Phase 2 advanced security engine", () => {
  it("matches an HMAC-SHA256 reference vector and validates without early equality checks", async () => {
    const signature = await generateHmac("The quick brown fox jumps over the lazy dog", "key", "SHA-256", "hex");
    expect(signature).toBe("f7bc83f430538424b13298e6aa6fb143ef4d59a14946175997479dbc2d1a3cd8");
    expect((await validateHmac("The quick brown fox jumps over the lazy dog", "key", signature, "SHA-256", "hex")).valid).toBe(true);
    expect((await validateHmac("changed", "key", signature, "SHA-256", "hex")).valid).toBe(false);
  });

  it("generates and validates only explicitly selected JWT HMAC algorithms", async () => {
    const token = await generateJwt('{"typ":"JWT"}', '{"sub":"123"}', "secret", "HS256");
    expect((await validateJwt(token, "secret", "HS256")).valid).toBe(true);
    await expect(validateJwt(token, "secret", "HS512")).rejects.toThrow(/declares HS256/);
  });

  it("round-trips Fernet and rejects modified authentication data", async () => {
    const key = generateFernetKeys(1)[0]; const token = await fernetEncrypt("private message", key);
    expect(await fernetDecrypt(token, key)).toBe("private message");
    await expect(fernetDecrypt(`${token.slice(0, -2)}AA`, key)).rejects.toThrow();
  });

  it("decrypts a token produced by Python cryptography's Fernet implementation", async () => {
    const key = "0Lo5OmCx7ANQCe37TgawASo9OLNOjW8YG3iBokRQeH4=";
    const token = "gAAAAABqkHOGacpwr02_RNcbjzE1FOhsJ_5PMnLKhPP5arKA0rZaZo0lf9oROnuNujADOwLBhINNH0vJHdJUvSnQILV0AbBpX3UgnvrX_9hgXpo-O6qikhI=";
    expect(await fernetDecrypt(token, key)).toBe("DevBite Fernet compatibility");
  });

  it("round-trips authenticated AES-GCM with AAD", async () => {
    const key = generateAesKey(); const encrypted = await aesEncrypt("private message", key, "context");
    expect(await aesDecrypt(JSON.stringify(encrypted), key)).toBe("private message");
    await expect(aesDecrypt(JSON.stringify({ ...encrypted, aad: "changed" }), key)).rejects.toThrow();
  });

  it("round-trips RSA-OAEP and RSA-PSS using local generated keys", async () => {
    const encryption = await generateRsaKeyPair(2048); const ciphertext = await rsaEncrypt("short message", encryption.publicKey);
    expect(await rsaDecrypt(ciphertext, encryption.privateKey)).toBe("short message");
    const signing = await generateRsaSigningKeyPair(2048); const signature = await rsaSign("signed message", signing.privateKey);
    expect(await rsaVerify("signed message", signature, signing.publicKey)).toBe(true);
    expect(await rsaVerify("changed", signature, signing.publicKey)).toBe(false);
  }, 15_000);

  it("generates exact random-byte output lengths and known checksums", async () => {
    expect(randomBytesOutput(16, "hex")).toMatch(/^[0-9a-f]{32}$/);
    expect(await checksum("123456789", "CRC32")).toBe("cbf43926");
  });
});
