import { describe, expect, it } from "vitest";
import { formatJsonl, jsonlToJson, jsonToJsonl, jsonToTable, parseDelimited, serializeDelimited, tableToJson } from "@/lib/engines/data";

describe("Phase 2 normalized data engine", () => {
  it("parses quoted delimiters and multiline values", () => {
    const result = parseDelimited('name,note\nAlice,"hello, world"\nBob,"two\nlines"');
    expect(result.diagnostics).toEqual([]);
    expect(result.table.rows).toEqual([["Alice", "hello, world"], ["Bob", "two\nlines"]]);
  });

  it("reports inconsistent row widths with the row number", () => {
    const result = parseDelimited("a,b\n1,2,3");
    expect(result.diagnostics[0].message).toBe("Row 2 has 3 columns; expected 2.");
  });

  it("serializes a normalized table with safe quoting and CRLF", () => {
    const table = parseDelimited('name,note\nAlice,"hello, world"').table;
    expect(serializeDelimited(table, { lineEnding: "crlf" })).toBe('name,note\r\nAlice,"hello, world"');
  });

  it("converts CSV values to typed JSON records", () => {
    const table = parseDelimited("name,age,active\nAlice,30,true").table;
    expect(tableToJson(table)).toEqual([{ name: "Alice", age: 30, active: true }]);
  });

  it("flattens nested JSON records into a shared table", () => {
    const table = jsonToTable('[{"user":{"name":"Alice"},"tags":["a","b"]}]');
    expect(table.headers).toEqual(["user.name", "tags"]);
    expect(table.rows[0]).toEqual(["Alice", '["a","b"]']);
  });

  it("formats JSONL and identifies an invalid line", () => {
    expect(formatJsonl('{"id":1}\n{"id":2}').output).toBe('{"id":1}\n{"id":2}');
    expect(formatJsonl('{"id":1}\ninvalid').diagnostics[0].row).toBe(2);
  });

  it("converts between JSON arrays and JSONL", () => {
    const jsonl = jsonToJsonl('[{"id":1},{"id":2}]');
    expect(jsonl.output).toBe('{"id":1}\n{"id":2}');
    expect(JSON.parse(jsonlToJson(jsonl.output).output)).toEqual([{ id: 1 }, { id: 2 }]);
  });
});
