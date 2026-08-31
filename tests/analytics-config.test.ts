import { describe, expect, it } from "vitest";
import { normalizeGoogleAnalyticsId } from "../src/config/analytics";

describe("Google Analytics configuration", () => {
  it("keeps analytics disabled when the environment value is absent or blank", () => {
    expect(normalizeGoogleAnalyticsId(undefined)).toBeNull();
    expect(normalizeGoogleAnalyticsId("   ")).toBeNull();
  });

  it("normalizes valid GA4 measurement IDs", () => {
    expect(normalizeGoogleAnalyticsId(" g-ab12cd34ef ")).toBe("G-AB12CD34EF");
  });

  it("rejects malformed or non-GA4 identifiers", () => {
    expect(normalizeGoogleAnalyticsId("UA-123456-1")).toBeNull();
    expect(normalizeGoogleAnalyticsId("G-invalid value")).toBeNull();
  });
});
