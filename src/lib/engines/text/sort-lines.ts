export type SortMode =
  | "alphabetical"
  | "natural"
  | "numeric"
  | "length"
  | "reverse"
  | "shuffle";

export interface SortLinesOptions {
  mode?: SortMode;
  direction?: "asc" | "desc";
  caseSensitive?: boolean;
  ignoreLeadingWhitespace?: boolean;
  deduplicate?: boolean;
}

export function sortLines(
  text: string,
  options: SortLinesOptions = {}
): string {
  if (!text) return "";

  const {
    mode = "alphabetical",
    direction = "asc",
    caseSensitive = false,
    ignoreLeadingWhitespace = true,
    deduplicate = false,
  } = options;

  let lines = text.split(/\r?\n/);

  if (deduplicate) {
    lines = Array.from(new Set(lines));
  }

  if (mode === "reverse") {
    return lines.reverse().join("\n");
  }

  if (mode === "shuffle") {
    const shuffled = [...lines];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.join("\n");
  }

  const collator = new Intl.Collator(undefined, {
    numeric: mode === "natural",
    sensitivity: caseSensitive ? "case" : "base",
  });

  lines.sort((a, b) => {
    const lineA = ignoreLeadingWhitespace ? a.trimStart() : a;
    const lineB = ignoreLeadingWhitespace ? b.trimStart() : b;

    let comp = 0;

    if (mode === "length") {
      comp = Array.from(lineA).length - Array.from(lineB).length;
      if (comp === 0) {
        comp = collator.compare(lineA, lineB);
      }
    } else if (mode === "numeric") {
      const numA = parseFloat(lineA.replace(/[^0-9.-]/g, "")) || 0;
      const numB = parseFloat(lineB.replace(/[^0-9.-]/g, "")) || 0;
      comp = numA - numB;
    } else {
      comp = collator.compare(lineA, lineB);
    }

    return direction === "desc" ? -comp : comp;
  });

  return lines.join("\n");
}
