import { describe, expect, it } from "vitest";
import { generateRandomIds } from "../src/lib/engines/developer/random-id";
import { extractRegex, replaceRegex, testRegex } from "../src/lib/engines/developer/regex";
import { dateToTimestamp, timestampToDate } from "../src/lib/engines/developer/timestamp";
import { convertTimezone } from "../src/lib/engines/developer/timezone";
import { parseUrl } from "../src/lib/engines/developer/url-parser";
import { describeCron } from "../src/lib/engines/developer/cron";

describe("Remaining Developer processing engines", () => {
  it("generates random IDs from configurable alphabets with affixes", () => {
    const ids = generateRandomIds({ length: 12, quantity: 5, alphabet: "hexadecimal", prefix: "id_", suffix: "_x" });
    expect(ids).toHaveLength(5);
    ids.forEach((id) => expect(id).toMatch(/^id_[0-9a-f]{12}_x$/));
    expect(new Set(ids).size).toBe(5);
  });

  it("rejects unusable random ID configurations", () => {
    expect(() => generateRandomIds({ length: 0 })).toThrow(/length/i);
    expect(() => generateRandomIds({ customAlphabet: "a" })).toThrow(/alphabet/i);
  });

  it("tests regex matches and reports groups and positions", () => {
    const result = testRegex("([a-z]+)@(example\\.com)", "a@example.com b@example.com", "g");
    expect(result.success).toBe(true);
    expect(result.matches).toHaveLength(2);
    expect(result.matches[0].groups).toEqual(["a", "example.com"]);
    expect(result.matches[1].index).toBeGreaterThan(result.matches[0].index);
  });

  it("replaces and extracts regular expression matches", () => {
    const replaced = replaceRegex("(\\d+)", "a1 b22", "[$1]", "g");
    expect(replaced.output).toBe("a[1] b[22]");
    expect(replaced.replacementCount).toBe(2);
    const extracted = extractRegex("([a-z]+)@(example\\.com)", "a@example.com b@example.com", "g", 1);
    expect(extracted.values).toEqual(["a", "b"]);
    expect(testRegex("[", "text").success).toBe(false);
  });

  it("converts Unix seconds, milliseconds, and ISO dates", () => {
    const fromSeconds = timestampToDate("1700000000", "seconds");
    expect(fromSeconds.iso).toBe("2023-11-14T22:13:20.000Z");
    expect(timestampToDate("1700000000000", "milliseconds").iso).toBe(fromSeconds.iso);
    expect(dateToTimestamp("2023-11-14T22:13:20.000Z").seconds).toBe(1700000000);
  });

  it("converts wall times using DST-aware IANA timezones", () => {
    const result = convertTimezone("2026-01-15T09:00", "UTC", "Asia/Karachi");
    expect(result.success).toBe(true);
    expect(result.iso).toBe("2026-01-15T09:00:00.000Z");
    expect(result.target).toContain("14:00");
  });

  it("parses URL components and repeated query parameters", () => {
    const result = parseUrl("https://user:pass@example.com:8443/a%20b?tag=one&tag=two#top");
    expect(result.success).toBe(true);
    expect(result.components?.hostname).toBe("example.com");
    expect(result.components?.pathname).toBe("/a b");
    expect(result.query).toEqual([{ key: "tag", value: "one" }, { key: "tag", value: "two" }]);
    expect(parseUrl("not a url").success).toBe(false);
  });

  it("validates and describes five- and six-field cron expressions", () => {
    expect(describeCron("0 9 * * 1-5").description).toBe("Every weekday at 09:00");
    expect(describeCron("*/15 * * * *").description).toBe("Every 15 minutes");
    expect(describeCron("0 0 9 * * 1-5", true).success).toBe(true);
    expect(describeCron("61 9 * * *").success).toBe(false);
    expect(describeCron("0 9 * *").success).toBe(false);
  });
});
