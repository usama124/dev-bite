import { describe, it, expect } from "vitest";
import { formatJson } from "../src/lib/engines/json/formatter";
import { validateJson } from "../src/lib/engines/json/validator";

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

  it("should structurally format balanced invalid JSON and retain validation details", () => {
    const invalidJson = '{\n  "name": "test",\n  "trailing": true,\n}';
    const res = formatJson(invalidJson);

    expect(res.success).toBe(true);
    expect(res.validJson).toBe(false);
    expect(res.formatMode).toBe("structural");
    expect(res.output).toContain('"trailing": true,');
    expect(res.error).toBeDefined();
    expect(res.error?.line).toBeGreaterThanOrEqual(1);
    expect(res.error?.hint).toContain("Trailing commas");
    expect(validateJson(invalidJson).valid).toBe(false);
  });

  it("should structurally format single-quoted JSON-like input without calling it valid JSON", () => {
    const singleQuoteJson = "{ 'foo': 'bar' }";
    const res = formatJson(singleQuoteJson);

    expect(res.success).toBe(true);
    expect(res.validJson).toBe(false);
    expect(res.formatMode).toBe("structural");
    expect(res.output).toBe("{\n  'foo': 'bar'\n}");
    expect(res.error?.hint).toContain("double quotes");
    expect(validateJson(singleQuoteJson).valid).toBe(false);
  });

  it("should preserve Python dictionary expressions while formatting their structure", () => {
    const pythonLike = `{
  'TASK_ID': 'register_and_wait',
  'DAG_ENCRYPTION_KEY': f'{ os.getenv("DAG_ENCRYPTION_KEY") }',
  'PYTHONPATH': '/shared/libs'}`;
    const res = formatJson(pythonLike, { indent: 2 });

    expect(res.success).toBe(true);
    expect(res.validJson).toBe(false);
    expect(res.output).toBe(`{
  'TASK_ID': 'register_and_wait',
  'DAG_ENCRYPTION_KEY': f'{ os.getenv("DAG_ENCRYPTION_KEY") }',
  'PYTHONPATH': '/shared/libs'
}`);
    expect(validateJson(pythonLike).valid).toBe(false);
  });

  it("should recover a premature root boundary followed by another quoted property", () => {
    const malformedDictionary = `{'TASK_ID':'register_and_wait','PYTHONPATH':'/shared/libs'}'DAG_ID':'{{ dag.dag_id }}','SFTP_DATA':'{"table": {"attributes": ["id"]}}'}`;
    const res = formatJson(malformedDictionary, { indent: 2 });

    expect(res.success).toBe(true);
    expect(res.validJson).toBe(false);
    expect(res.output).toBe(`{
  'TASK_ID': 'register_and_wait',
  'PYTHONPATH': '/shared/libs',
  'DAG_ID': '{{ dag.dag_id }}',
  'SFTP_DATA': '{"table": {"attributes": ["id"]}}'
}`);
    expect(validateJson(malformedDictionary).valid).toBe(false);
  });

  it("should not structurally format unbalanced JSON-like input", () => {
    const res = formatJson("{ 'foo': ['bar' }");
    expect(res.success).toBe(false);
    expect(res.formatMode).toBe("none");
  });
});
