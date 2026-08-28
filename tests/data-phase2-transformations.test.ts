import { describe, expect, it } from "vitest";
import { cleanTable, countTable, deduplicateTable, filterTable, mergeTables, parseDelimitedProgressive, profileTable, removeColumns, renameColumns, selectColumns, sortTable, splitTable, splitTableByCount, tableToMarkdown, transposeTable } from "../src/lib/engines/data";

const table = { headers: ["id", "name", "score"], rows: [["2", " Bob ", "8"], ["1", "Alice", "10"], ["1", "Alice", "10"], ["3", "", ""]], sourceRowCount: 5 };

describe("Phase 2 data transformation engine", () => {
  it("selects, removes and renames columns immutably", () => {
    expect(selectColumns(table, ["name"]).headers).toEqual(["name"]);
    expect(removeColumns(table, ["score"]).headers).toEqual(["id", "name"]);
    expect(renameColumns(table, { name: "full_name" }).headers).toContain("full_name");
    expect(table.headers).toEqual(["id", "name", "score"]);
  });

  it("sorts, filters and deduplicates rows", () => {
    expect(sortTable(table, "score", "desc").rows[0][2]).toBe("10");
    expect(filterTable(table, "name", "contains", "alice").rows).toHaveLength(2);
    expect(deduplicateTable(table).rows).toHaveLength(3);
  });

  it("aligns merge schemas and splits row chunks", () => {
    const other = { headers: ["id", "region"], rows: [["4", "EU"]], sourceRowCount: 2 };
    const merged = mergeTables([table, other]); expect(merged.headers).toContain("region"); expect(merged.rows.at(-1)).toEqual(["4", "", "", "EU"]);
    expect(splitTable(table, 2).map((chunk) => chunk.rows.length)).toEqual([2, 2]);
    expect(splitTableByCount(table, 3).map((chunk) => chunk.rows.length)).toEqual([2, 1, 1]);
  });

  it("parses custom delimiters progressively and reports progress on large input", async () => {
    const custom = await parseDelimitedProgressive("id^name\n1^Alice", { delimiter: "^" });
    expect(custom.table).toEqual({ headers: ["id", "name"], rows: [["1", "Alice"]], sourceRowCount: 2 });
    const input = `id|value\n${Array.from({ length: 30_000 }, (_, index) => `${index}|row-${index}`).join("\n")}`;
    const progress: number[] = [];
    const large = await parseDelimitedProgressive(input, { delimiter: "|" }, (value) => progress.push(value));
    expect(large.table.rows).toHaveLength(30_000);
    expect(progress.at(-1)).toBe(100);
    expect(progress.some((value) => value > 0 && value < 100)).toBe(true);
  });

  it("transposes and serializes escaped Markdown", () => {
    expect(transposeTable({ headers: ["a", "b"], rows: [["1", "2"]], sourceRowCount: 2 }).headers).toEqual(["a", "1"]);
    expect(tableToMarkdown({ headers: ["a|b"], rows: [["x|y"]], sourceRowCount: 2 })).toContain("a\\|b");
  });

  it("profiles, cleans and counts dataset quality", () => {
    const profile = profileTable(table); expect(profile.rows).toBe(4); expect(profile.profiles.find((item) => item.column === "score")?.median).toBe(10);
    expect(cleanTable(table, { deduplicate: true }).rows).toHaveLength(3);
    expect(countTable(table).duplicateRows).toBe(1);
  });
});
