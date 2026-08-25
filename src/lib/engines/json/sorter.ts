export type SortOrder = "asc" | "desc";

export function sortJsonKeys(
  value: unknown,
  order: SortOrder = "asc",
  recursive = true
): unknown {
  if (Array.isArray(value)) {
    return recursive ? value.map((item) => sortJsonKeys(item, order, recursive)) : value;
  }
  if (value !== null && typeof value === "object") {
    const keys = Object.keys(value as Record<string, unknown>);
    const sorted = order === "asc" ? keys.sort() : keys.sort().reverse();
    const result: Record<string, unknown> = {};
    for (const key of sorted) {
      result[key] = recursive
        ? sortJsonKeys((value as Record<string, unknown>)[key], order, recursive)
        : (value as Record<string, unknown>)[key];
    }
    return result;
  }
  return value;
}

export function sortJsonValues(arr: unknown[], order: SortOrder = "asc"): unknown[] {
  const copy = [...arr];
  copy.sort((a, b) => {
    const sa = JSON.stringify(a);
    const sb = JSON.stringify(b);
    return order === "asc" ? sa.localeCompare(sb) : sb.localeCompare(sa);
  });
  return copy;
}
