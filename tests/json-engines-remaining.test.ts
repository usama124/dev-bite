import { describe, it, expect } from "vitest";
import { validateJson } from "../src/lib/engines/json/validator";
import { sortJsonKeys } from "../src/lib/engines/json/sorter";
import { flattenJson, unflattenJson } from "../src/lib/engines/json/flatten";
import { diffJson } from "../src/lib/engines/json/diff";
import { testJsonPath } from "../src/lib/engines/json/path-tester";
import { extractJsonKeys, removeJsonKeys } from "../src/lib/engines/json/key-tools";
import { extractJsonKeyPaths } from "../src/lib/engines/json/key-tools";
import { jsonToCsv, csvToJson } from "../src/lib/engines/json/csv-converter";

describe("JSON Category Processing Engines", () => {
  // 1. Validator
  it("should validate JSON and return friendly errors with position", () => {
    expect(validateJson('{"a":1}').valid).toBe(true);
    const bad = validateJson('{"a": 1,}');
    expect(bad.valid).toBe(false);
    expect(bad.error).toBeTruthy();
    expect(validateJson("").valid).toBe(false);
  });

  // 2. Sorter
  it("should sort JSON keys alphabetically in asc and desc order", () => {
    const obj = { z: 1, a: 2, m: 3 };
    const asc = sortJsonKeys(obj, "asc") as Record<string, number>;
    expect(Object.keys(asc)).toEqual(["a", "m", "z"]);
    const desc = sortJsonKeys(obj, "desc") as Record<string, number>;
    expect(Object.keys(desc)).toEqual(["z", "m", "a"]);
  });

  // 3. Flatten & Unflatten
  it("should flatten nested JSON to dot-notation and unflatten back", () => {
    const obj = { a: { b: { c: 42 } }, d: [1, 2] };
    const flat = flattenJson(obj);
    expect(flat["a.b.c"]).toBe(42);
    expect(flat["d.0"]).toBe(1);

    const restored = unflattenJson({ "x.y": "hello", "x.z": 99 }) as Record<string, Record<string, unknown>>;
    expect(restored.x.y).toBe("hello");
    expect(restored.x.z).toBe(99);
  });

  // 4. JSON Diff
  it("should diff two JSON strings and count additions/deletions/modifications", () => {
    const a = JSON.stringify({ name: "Alice", age: 30, city: "NYC" });
    const b = JSON.stringify({ name: "Alice", age: 31, country: "US" });
    const { modifications, additions, deletions } = diffJson(a, b);
    expect(modifications).toBeGreaterThan(0); // age changed
    expect(additions).toBeGreaterThan(0);     // country added
    expect(deletions).toBeGreaterThan(0);     // city removed
  });

  // 5. JSON Path Tester
  it("should extract value using JSONPath expressions", () => {
    const json = JSON.stringify({ store: { book: [{ title: "Go" }, { title: "Rust" }] } });
    const res = testJsonPath(json, "$.store.book[0].title");
    expect(res.success).toBe(true);
    expect(res.value).toBe("Go");
    const wildcard = testJsonPath(json, "$.store.book[*].title");
    expect(wildcard.value).toEqual(["Go", "Rust"]);
    const bad = testJsonPath("{invalid}", "$.x");
    expect(bad.success).toBe(false);
  });

  it("should restore arrays when unflattening numeric path segments", () => {
    expect(unflattenJson({ "items.0.name": "A", "items.1.name": "B" })).toEqual({
      items: [{ name: "A" }, { name: "B" }],
    });
  });

  // 6. Key Extractor & Key Remover
  it("should extract specific keys from JSON objects", () => {
    const json = JSON.stringify([{ id: 1, name: "Alice", password: "secret" }, { id: 2, name: "Bob", password: "pass" }]);
    const extracted = extractJsonKeys(json, ["id", "name"]);
    expect(extracted.operatedCount).toBe(2);
    const arr = extracted.output as Array<Record<string, unknown>>;
    expect(arr[0]).not.toHaveProperty("password");
    expect(arr[0]).toHaveProperty("id");

    const removed = removeJsonKeys(json, ["password"]);
    const removedArr = removed.output as Array<Record<string, unknown>>;
    expect(removedArr[0]).not.toHaveProperty("password");
    expect(removed.operatedCount).toBe(2);
  });

  it("should list recursive JSON key paths", () => {
    const result = extractJsonKeyPaths('{"user":{"name":"Alice"},"active":true}');
    expect(result.keys).toEqual(["user", "user.name", "active"]);
  });

  // 7. JSON to CSV and CSV to JSON
  it("should convert JSON array to CSV and back to JSON", () => {
    const json = JSON.stringify([{ name: "Alice", age: 30 }, { name: "Bob", age: 25 }]);
    const { csv, rowCount, columnCount } = jsonToCsv(json);
    expect(rowCount).toBe(2);
    expect(columnCount).toBe(2);
    expect(csv).toContain("Alice");
    expect(csv).toContain("name,age");

    const backToJson = csvToJson(csv);
    expect(backToJson.rowCount).toBe(2);
    const parsed = JSON.parse(backToJson.json) as Array<{ name: string; age: number }>;
    expect(parsed[0].name).toBe("Alice");
    expect(parsed[0].age).toBe(30);
  });

  it("should parse quoted CSV fields containing commas and line breaks", () => {
    const converted = csvToJson('name,notes\nAlice,"one, two"\nBob,"line one\nline two"');
    const parsed = JSON.parse(converted.json) as Array<{ name: string; notes: string }>;
    expect(parsed[0].notes).toBe("one, two");
    expect(parsed[1].notes).toBe("line one\nline two");
  });
});
