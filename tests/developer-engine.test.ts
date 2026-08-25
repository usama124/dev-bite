import { describe, it, expect } from "vitest";
import {
  generateUuids,
  validateUuid,
  generateUuidV4,
  generateUuidV7,
} from "../src/lib/engines/developer/uuid";

describe("Developer Utilities Engine — UUID Generator & Validator", () => {
  it("should generate valid RFC 4122 v4 UUIDs", () => {
    const uuid = generateUuidV4();
    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);

    const validation = validateUuid(uuid);
    expect(validation.valid).toBe(true);
    expect(validation.version).toContain("v4");
  });

  it("should generate valid RFC 9562 v7 time-ordered UUIDs", () => {
    const uuid = generateUuidV7();
    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);

    const validation = validateUuid(uuid);
    expect(validation.valid).toBe(true);
    expect(validation.version).toContain("v7");
    expect(validation.timestamp).toBeInstanceOf(Date);
  });

  it("should generate multiple UUIDs in batch with custom formatting", () => {
    const list = generateUuids({ quantity: 5, uppercase: true, hyphens: false });
    expect(list.length).toBe(5);
    for (const u of list) {
      expect(u).toMatch(/^[0-9A-F]{32}$/);
    }
  });

  it("should correctly validate and identify invalid UUIDs", () => {
    expect(validateUuid("").valid).toBe(false);
    expect(validateUuid("not-a-uuid").valid).toBe(false);
    expect(validateUuid("12345678-1234-1234-1234-12345678901z").valid).toBe(false);
  });
});
