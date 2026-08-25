export type DiffNodeType = "unchanged" | "added" | "removed" | "modified" | "type-changed";

export interface DiffNode {
  type: DiffNodeType;
  key: string;
  path: string;
  leftValue?: unknown;
  rightValue?: unknown;
  children?: DiffNode[];
}

function diffValues(
  left: unknown,
  right: unknown,
  key: string,
  path: string
): DiffNode {
  if (left === undefined) {
    return { type: "added", key, path, rightValue: right };
  }
  if (right === undefined) {
    return { type: "removed", key, path, leftValue: left };
  }

  const leftType = Array.isArray(left) ? "array" : typeof left;
  const rightType = Array.isArray(right) ? "array" : typeof right;

  if (leftType !== rightType) {
    return { type: "type-changed", key, path, leftValue: left, rightValue: right };
  }

  if (leftType === "object" && left !== null && right !== null) {
    const leftObj = left as Record<string, unknown>;
    const rightObj = right as Record<string, unknown>;
    const allKeys = new Set([...Object.keys(leftObj), ...Object.keys(rightObj)]);
    const children: DiffNode[] = [];
    let hasChanges = false;

    for (const k of Array.from(allKeys).sort()) {
      const childPath = path ? `${path}.${k}` : k;
      const child = diffValues(leftObj[k], rightObj[k], k, childPath);
      children.push(child);
      if (child.type !== "unchanged") hasChanges = true;
    }

    return {
      type: hasChanges ? "modified" : "unchanged",
      key,
      path,
      leftValue: left,
      rightValue: right,
      children,
    };
  }

  if (leftType === "array") {
    const leftArr = left as unknown[];
    const rightArr = right as unknown[];
    const maxLen = Math.max(leftArr.length, rightArr.length);
    const children: DiffNode[] = [];
    let hasChanges = false;

    for (let i = 0; i < maxLen; i++) {
      const childPath = `${path}[${i}]`;
      const child = diffValues(leftArr[i], rightArr[i], `[${i}]`, childPath);
      children.push(child);
      if (child.type !== "unchanged") hasChanges = true;
    }

    return {
      type: hasChanges ? "modified" : "unchanged",
      key,
      path,
      leftValue: left,
      rightValue: right,
      children,
    };
  }

  if (JSON.stringify(left) === JSON.stringify(right)) {
    return { type: "unchanged", key, path, leftValue: left, rightValue: right };
  }

  return { type: "modified", key, path, leftValue: left, rightValue: right };
}

export function diffJson(leftStr: string, rightStr: string): {
  result: DiffNode | null;
  additions: number;
  deletions: number;
  modifications: number;
  unchanged: number;
  leftError?: string;
  rightError?: string;
} {
  let left: unknown, right: unknown;
  let leftError: string | undefined, rightError: string | undefined;

  try { left = JSON.parse(leftStr); } catch (e) { leftError = (e as Error).message; }
  try { right = JSON.parse(rightStr); } catch (e) { rightError = (e as Error).message; }

  if (leftError || rightError) {
    return { result: null, additions: 0, deletions: 0, modifications: 0, unchanged: 0, leftError, rightError };
  }

  const result = diffValues(left, right, "root", "");

  let additions = 0, deletions = 0, modifications = 0, unchanged = 0;
  const count = (node: DiffNode) => {
    if (node.type === "added") additions++;
    else if (node.type === "removed") deletions++;
    else if (node.type === "modified" || node.type === "type-changed") modifications++;
    else unchanged++;
    node.children?.forEach(count);
  };
  count(result);

  return { result, additions, deletions, modifications, unchanged };
}
