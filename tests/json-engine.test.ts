import { describe, it, expect } from "vitest";
import { formatJson } from "../src/lib/engines/json/formatter";

describe("JSON Processing Engine — Formatter", () => {
  it("should format valid compact JSON with 2-space indentation", () => {
    const raw = '{"name":"DevBite","active":true,"tags":["tools","fast"]}';
    const res = formatJson(raw, { indent: 2 });

    expect(res.success).toBe(true);
    expect(res.output).toContain('  "name": "DevBite"');
    expect(res.lineCount).toBe(8);
  });

  it("should support 4 spaces and tab indentation", () => {
    const raw = '{"a":1}';
    const res4 = formatJson(raw, { indent: 4 });
    expect(res4.output).toBe('{\n    "a": 1\n}');

    const resTab = formatJson(raw, { indent: "tab" });
    expect(resTab.output).toBe('{\n\t"a": 1\n}');
  });

  it("should support key sorting recursively", () => {
    const raw = '{"z":1,"a":2,"m":{"y":3,"b":4}}';
    const res = formatJson(raw, { sortKeys: true, indent: 2 });

    expect(res.success).toBe(true);
    const keysInOrder = Object.keys(JSON.parse(res.output));
    expect(keysInOrder).toEqual(["a", "m", "z"]);
    const nestedKeys = Object.keys(JSON.parse(res.output).m);
    expect(nestedKeys).toEqual(["b", "y"]);
  });

  it("should support JSON minification", () => {
    const raw = `{\n  "hello": "world",\n  "count": 42\n}`;
    const res = formatJson(raw, { compact: true });

    expect(res.success).toBe(true);
    expect(res.output).toBe('{"hello":"world","count":42}');
    expect(res.lineCount).toBe(1);
  });

  it("should return human-friendly error details on invalid JSON", () => {
    const invalidJson = '{\n  "name": "test",\n  "trailing": true,\n}';
    const res = formatJson(invalidJson);

    expect(res.success).toBe(false);
    expect(res.error).toBeDefined();
    expect(res.error?.line).toBeGreaterThanOrEqual(1);
    expect(res.error?.hint).toContain("Trailing commas");
  });

  it("should detect single quotes mistake", () => {
    const singleQuoteJson = "{ 'foo': 'bar' }";
    const res = formatJson(singleQuoteJson);

    expect(res.success).toBe(false);
    expect(res.error?.hint).toContain("double quotes");
  });
});
