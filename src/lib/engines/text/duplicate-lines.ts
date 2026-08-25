export interface DuplicateLinesOptions {
  caseSensitive?: boolean;
  trimBeforeCompare?: boolean;
  preserveOccurrence?: "first" | "last";
  removeEmptyLines?: boolean;
}

export interface DuplicateLinesResult {
  output: string;
  originalLinesCount: number;
  uniqueLinesCount: number;
  duplicateLinesCount: number;
  removedCount: number;
}

export function removeDuplicateLines(
  text: string,
  options: DuplicateLinesOptions = {}
): DuplicateLinesResult {
  if (!text) {
    return {
      output: "",
      originalLinesCount: 0,
      uniqueLinesCount: 0,
      duplicateLinesCount: 0,
      removedCount: 0,
    };
  }

  const {
    caseSensitive = true,
    trimBeforeCompare = false,
    preserveOccurrence = "first",
    removeEmptyLines = false,
  } = options;

  let rawLines = text.split(/\r?\n/);
  if (removeEmptyLines) {
    rawLines = rawLines.filter((l) => l.trim().length > 0);
  }

  const originalLinesCount = rawLines.length;

  const normalize = (line: string): string => {
    let l = line;
    if (trimBeforeCompare) l = l.trim();
    if (!caseSensitive) l = l.toLowerCase();
    return l;
  };

  const seen = new Set<string>();
  const result: string[] = [];

  const linesToProcess =
    preserveOccurrence === "last" ? [...rawLines].reverse() : rawLines;

  for (const line of linesToProcess) {
    const key = normalize(line);
    if (!seen.has(key)) {
      seen.add(key);
      result.push(line);
    }
  }

  if (preserveOccurrence === "last") {
    result.reverse();
  }

  const uniqueLinesCount = result.length;
  const duplicateLinesCount = originalLinesCount - uniqueLinesCount;

  return {
    output: result.join("\n"),
    originalLinesCount,
    uniqueLinesCount,
    duplicateLinesCount,
    removedCount: duplicateLinesCount,
  };
}
