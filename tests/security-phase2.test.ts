import { beforeAll, describe, expect, it } from "vitest";
import { webcrypto } from "node:crypto";
import { analyzePassword, decodeJwt, generatePasswords, generateSecrets, hashText } from "@/lib/engines/security";

beforeAll(() => {
  if (!globalThis.crypto) Object.defineProperty(globalThis, "crypto", { value: webcrypto });
  if (!globalThis.btoa) globalThis.btoa = (value) => Buffer.from(value, "binary").toString("base64");
  if (!globalThis.atob) globalThis.atob = (value) => Buffer.from(value, "base64").toString("binary");
});

describe("Phase 2 security fundamentals", () => {
  it("generates passwords that include every selected class", () => {
    const values = generatePasswords({ length: 24, count: 4, uppercase: true, lowercase: true, numbers: true, symbols: true, excludeAmbiguous: true });
    expect(values).toHaveLength(4);
    values.forEach((value) => { expect(value).toHaveLength(24); expect(value).toMatch(/[A-Z]/); expect(value).toMatch(/[a-z]/); expect(value).toMatch(/\d/); expect(value).toMatch(/[^A-Za-z0-9]/); expect(value).not.toMatch(/[Il1O0o|]/); });
  });

  it("rejects an invalid password configuration", () => {
    expect(() => generatePasswords({ length: 12, count: 1, uppercase: false, lowercase: false, numbers: false, symbols: false, excludeAmbiguous: false })).toThrow("Select at least one");
  });

  it("scores a long mixed password above a common weak password", () => {
    expect(analyzePassword("A-unique-long-passphrase-2026!").score).toBeGreaterThan(analyzePassword("password1234").score);
  });

  it("matches standard MD5 and SHA-256 vectors", async () => {
    await expect(hashText("hello", "MD5")).resolves.toBe("5d41402abc4b2a76b9719d911017c592");
    await expect(hashText("hello", "SHA-256")).resolves.toBe("2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824");
  });

  it("decodes JWT claims but rejects malformed token structure", () => {
    const token = `${Buffer.from('{"alg":"HS256"}').toString("base64url")}.${Buffer.from('{"sub":"123","iat":1700000000}').toString("base64url")}.signature`;
    expect(decodeJwt(token).payload).toEqual({ sub: "123", iat: 1700000000 });
    expect(decodeJwt("not-a-jwt").error).toContain("three");
  });

  it("generates distinct secrets in the requested format", () => {
    const values = generateSecrets(32, 3, "base64url");
    expect(new Set(values).size).toBe(3);
    values.forEach((value) => expect(value).toMatch(/^[A-Za-z0-9_-]+$/));
  });
});
