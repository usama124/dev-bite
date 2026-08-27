export const SUPPORTED_SQL_DIALECTS = [
  "generic",
  "postgresql",
  "mysql",
  "sqlite",
  "sql-server",
  "oracle",
] as const;

export type SqlDialect = (typeof SUPPORTED_SQL_DIALECTS)[number];

export * from "./core";
