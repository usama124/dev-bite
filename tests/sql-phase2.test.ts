import { describe, expect, it } from "vitest";
import { explainSql, formatSql, generateCreateTable, generateDelete, generateInClause, generateUpdate, generateWhere, minifySql, parseInsert, parseSqlStatements, tableToInsert, tokenizeSql, validateSql } from "../src/lib/engines/sql";

describe("Phase 2 SQL engine", () => {
  it("tokenizes quoted strings/comments and minifies without changing their contents", () => {
    const sql = "SELECT 'a -- b' AS value /* comment */ FROM users;";
    expect(tokenizeSql(sql).some((token) => token.type === "string" && token.value === "'a -- b'")).toBe(true);
    expect(minifySql(sql)).toBe("SELECT 'a -- b' AS value FROM users;");
  });

  it("formats through the shared formatter and reports structural validation limits", () => {
    expect(formatSql("select id,name from users where active=true;")).toMatch(/\n\s*FROM users\n\s*WHERE/);
    expect(validateSql("SELECT (id FROM users", "postgresql").valid).toBe(false);
  });

  it("generates escaped INSERT and IN expressions", () => {
    const table = { headers: ["id", "name"], rows: [["1", "O'Brien"]], sourceRowCount: 2 };
    expect(tableToInsert(table, "users", "postgresql")).toContain("'O''Brien'");
    expect(generateInClause(["a", "O'Brien"])).toBe("IN ('a', 'O''Brien')");
  });

  it("parses supported multi-row INSERT statements", () => {
    const parsed = parseInsert("INSERT INTO users (id, name) VALUES (1, 'Alice'), (2, 'Bob');");
    expect(parsed.columns).toEqual(["id", "name"]); expect(parsed.rows).toHaveLength(2);
  });

  it("builds allowlisted WHERE and CREATE TABLE syntax", () => {
    expect(generateWhere([{ column: "age", operator: ">=", value: "18" }], "mysql")).toContain("`age` >= 18");
    expect(generateCreateTable("users", [{ name: "id", type: "INTEGER", primary: true }], "sqlite")).toContain("PRIMARY KEY");
    expect(() => generateCreateTable("users", [{ name: "id", type: "DROP TABLE" }])).toThrow(/Unsupported type/);
  });

  it("requires scoped conditions for destructive statement generators", () => {
    expect(() => generateUpdate("users", [{ column: "active", value: "false" }], [])).toThrow(/WHERE condition is required/);
    expect(() => generateDelete("users", [])).toThrow(/WHERE condition is required/);
    expect(generateUpdate("users", [{ column: "active", value: "false" }], [{ column: "id", operator: "=", value: "42" }], "postgresql")).toBe('UPDATE "users" SET "active" = FALSE WHERE "id" = 42;');
    expect(generateDelete("users", [{ column: "id", operator: "=", value: "42" }], "mysql")).toBe("DELETE FROM `users` WHERE `id` = 42;");
  });

  it("parses multiple statements and reports dialect and destructive-query risks", () => {
    expect(parseSqlStatements("SELECT 1; DELETE FROM users;").map((statement) => statement.kind)).toEqual(["SELECT", "DELETE"]);
    expect(validateSql("UPDATE users SET active = false", "postgresql").warnings).toContain("Statement 1: UPDATE has no WHERE clause and may affect every row.");
    expect(validateSql("SELECT `id` FROM users", "postgresql").valid).toBe(false);
    expect(validateSql("SELECT id FROM users LIMIT 1", "sql-server").diagnostics.join(" ")).toMatch(/LIMIT is not supported/);
    expect(validateSql("SELECT 1;", "postgresql").valid).toBe(true);
    expect(validateSql("SELECT FROM users", "postgresql").valid).toBe(false);
    expect(validateSql("UPDATE users SET active", "postgresql").valid).toBe(false);
    expect(validateSql("DELETE FROM;", "postgresql").valid).toBe(false);
  });

  it("explains query structure without claiming execution or AI", () => {
    const result = explainSql("SELECT * FROM users WHERE active = TRUE ORDER BY id", "postgresql");
    expect(result.steps.join(" ")).toMatch(/source table/); expect(result.disclaimer).toMatch(/not executed/);
  });
});
