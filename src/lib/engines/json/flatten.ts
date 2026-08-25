export type Separator = "." | "/" | "_" | ">" | ":";

export function flattenJson(
  obj: unknown,
  separator: Separator = ".",
  prefix = "",
  result: Record<string, unknown> = {}
): Record<string, unknown> {
  if (Array.isArray(obj)) {
    obj.forEach((item, idx) => {
      const key = prefix ? `${prefix}${separator}${idx}` : `${idx}`;
      if (item !== null && typeof item === "object") {
        flattenJson(item, separator, key, result);
      } else {
        result[key] = item;
      }
    });
  } else if (obj !== null && typeof obj === "object") {
    const record = obj as Record<string, unknown>;
    for (const k of Object.keys(record)) {
      const key = prefix ? `${prefix}${separator}${k}` : k;
      if (record[k] !== null && typeof record[k] === "object") {
        flattenJson(record[k], separator, key, result);
      } else {
        result[key] = record[k];
      }
    }
  } else {
    if (prefix) result[prefix] = obj;
  }
  return result;
}

export function unflattenJson(
  obj: Record<string, unknown>,
  separator: Separator = "."
): unknown {
  const flatKeys = Object.keys(obj);
  const root: Record<string, unknown> | unknown[] = flatKeys.some(
    (key) => /^\d+$/.test(key.split(separator)[0])
  ) ? [] : {};

  const isIndex = (part: string) => /^\d+$/.test(part);

  for (const flatKey of Object.keys(obj)) {
    if (!flatKey) throw new Error("Flat JSON keys cannot be empty.");
    const parts = flatKey.split(separator);
    let current: Record<string, unknown> | unknown[] = root;
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      const key: string | number = Array.isArray(current) && isIndex(part) ? Number(part) : part;
      const nextShouldBeArray = isIndex(parts[i + 1]);
      const existing = current[key as keyof typeof current];

      if (existing === undefined) {
        current[key as keyof typeof current] = (nextShouldBeArray ? [] : {}) as never;
      } else if (existing === null || typeof existing !== "object" || Array.isArray(existing) !== nextShouldBeArray) {
        throw new Error(`Conflicting path at "${parts.slice(0, i + 1).join(separator)}".`);
      }
      current = current[key as keyof typeof current] as Record<string, unknown> | unknown[];
    }

    const lastPart = parts[parts.length - 1];
    const lastKey: string | number = Array.isArray(current) && isIndex(lastPart)
      ? Number(lastPart)
      : lastPart;
    const existing = current[lastKey as keyof typeof current];
    if (existing !== undefined && typeof existing === "object") {
      throw new Error(`Conflicting path at "${flatKey}".`);
    }
    current[lastKey as keyof typeof current] = obj[flatKey] as never;
  }
  return root;
}
