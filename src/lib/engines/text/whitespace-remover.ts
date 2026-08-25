export interface WhitespaceOptions {
  collapseMultipleSpaces?: boolean;
  trimLineEdges?: boolean;
  removeBlankLines?: boolean;
  removeAllWhitespace?: boolean;
  replaceTabsWithSpaces?: boolean;
  tabSpacesCount?: number;
  normalizeLineBreaks?: boolean;
}

export function removeWhitespace(
  text: string,
  options: WhitespaceOptions = {}
): string {
  if (!text) return "";

  const {
    collapseMultipleSpaces = true,
    trimLineEdges = true,
    removeBlankLines = false,
    removeAllWhitespace = false,
    replaceTabsWithSpaces = false,
    tabSpacesCount = 2,
    normalizeLineBreaks = true,
  } = options;

  if (removeAllWhitespace) {
    return text.replace(/\s+/g, "");
  }

  let result = text;

  // Normalize line breaks to \n
  if (normalizeLineBreaks) {
    result = result.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  }

  // Replace tabs with spaces
  if (replaceTabsWithSpaces) {
    result = result.replace(/\t/g, " ".repeat(tabSpacesCount));
  }

  const lines = result.split("\n");
  let processedLines = lines.map((line) => {
    let l = line;
    if (collapseMultipleSpaces) {
      l = l.replace(/[^\S\r\n]+/g, " ");
    }
    if (trimLineEdges) {
      l = l.trim();
    }
    return l;
  });

  if (removeBlankLines) {
    processedLines = processedLines.filter((l) => l.trim().length > 0);
  }

  return processedLines.join("\n");
}
