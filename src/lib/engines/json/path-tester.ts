export interface PathTestResult {
  success: boolean;
  value?: unknown;
  error?: string;
  type?: string;
  path: string;
}

// Supported JSONPath subset: $, .key, [0], ['key'], *, [*], and [0,1].
function tokenize(path: string): string[] {
  const normalized = path.replace(/^\$/, "");
  const tokens: string[] = [];
  let i = 0;
  while (i < normalized.length) {
    if (normalized[i] === ".") {
      i++;
      let key = "";
      while (i < normalized.length && normalized[i] !== "." && normalized[i] !== "[") {
        key += normalized[i++];
      }
      if (key) tokens.push(key);
    } else if (normalized[i] === "[") {
      i++;
      let inner = "";
      while (i < normalized.length && normalized[i] !== "]") {
        inner += normalized[i++];
      }
      i++; // skip ]
      tokens.push(`[${inner.replace(/^['"]|['"]$/g, "")}]`);
    } else {
      let key = "";
      while (i < normalized.length && normalized[i] !== "." && normalized[i] !== "[") {
        key += normalized[i++];
      }
      if (key) tokens.push(key);
    }
  }
  return tokens;
}

function getByPath(obj: unknown, path: string): unknown[] {
  if (!path || path === "$") return [obj];

  const tokens = tokenize(path);
  let current: unknown[] = [obj];

  for (const token of tokens) {
    const next: unknown[] = [];
    for (const node of current) {
      if (token === "*") {
        if (Array.isArray(node)) next.push(...node);
        else if (node !== null && typeof node === "object") {
          next.push(...Object.values(node as Record<string, unknown>));
        }
      } else if (token.startsWith("[") && token.endsWith("]")) {
        const inner = token.slice(1, -1);
        if (inner === "*") {
          if (Array.isArray(node)) next.push(...node);
          else if (node !== null && typeof node === "object") {
            next.push(...Object.values(node as Record<string, unknown>));
          }
        } else if (Array.isArray(node)) {
          const indices = inner.split(",").map((s) => parseInt(s.trim()));
          for (const idx of indices) {
            if (Number.isNaN(idx)) continue;
            const realIdx = idx < 0 ? node.length + idx : idx;
            if (realIdx >= 0 && realIdx < node.length) next.push(node[realIdx]);
          }
        } else if (node !== null && typeof node === "object") {
          const value = (node as Record<string, unknown>)[inner];
          if (value !== undefined) next.push(value);
        }
      } else {
        if (node !== null && typeof node === "object" && !Array.isArray(node)) {
          const val = (node as Record<string, unknown>)[token];
          if (val !== undefined) next.push(val);
        }
      }
    }
    current = next;
  }

  return current;
}

export function testJsonPath(jsonStr: string, path: string): PathTestResult {
  if (!jsonStr?.trim()) return { success: false, error: "Input JSON is empty.", path };
  if (!path?.trim()) return { success: false, error: "Path expression is empty.", path };

  let parsed: unknown;
  try { parsed = JSON.parse(jsonStr); } catch (e) {
    return { success: false, error: `Invalid JSON: ${(e as Error).message}`, path };
  }

  const expression = path.trim();
  if (!expression.startsWith("$")) {
    return { success: false, error: "Path expressions must start with $.", path };
  }

  const openBrackets = (expression.match(/\[/g) ?? []).length;
  const closeBrackets = (expression.match(/\]/g) ?? []).length;
  if (openBrackets !== closeBrackets) {
    return { success: false, error: "Path expression has an unmatched bracket.", path };
  }

  try {
    const results = getByPath(parsed, expression);
    if (results.length === 0) {
      return { success: false, error: "No value found at this path.", path };
    }
    const value = results.length === 1 ? results[0] : results;
    return { success: true, value, type: Array.isArray(value) ? "array" : typeof value, path };
  } catch (e) {
    return { success: false, error: `Path error: ${(e as Error).message}`, path };
  }
}
