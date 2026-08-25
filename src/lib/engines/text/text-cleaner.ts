export interface TextCleanerOptions {
  stripHtml?: boolean;
  convertSmartQuotes?: boolean;
  removeNonPrintable?: boolean;
  stripEmojis?: boolean;
  normalizeUnicode?: boolean;
  collapseBlankLines?: boolean;
  trimLines?: boolean;
  collapseSpaces?: boolean;
}

export function cleanText(
  text: string,
  options: TextCleanerOptions = {}
): string {
  if (!text) return "";

  const {
    stripHtml = true,
    convertSmartQuotes = true,
    removeNonPrintable = true,
    stripEmojis = false,
    normalizeUnicode = true,
    collapseBlankLines = true,
    trimLines = true,
    collapseSpaces = true,
  } = options;

  let result = text;

  // Normalize Unicode NFC
  if (normalizeUnicode) {
    result = result.normalize("NFC");
  }

  // Decode common HTML entities & strip tags
  if (stripHtml) {
    result = result
      .replace(/<[^>]*>/g, "")
      .replace(/&ldquo;|&rdquo;/gi, '"')
      .replace(/&lsquo;|&rsquo;/gi, "'")
      .replace(/&mdash;|&ndash;/gi, "-")
      .replace(/&quot;/gi, '"')
      .replace(/&apos;/gi, "'")
      .replace(/&hellip;/gi, "...")
      .replace(/&nbsp;/gi, " ")
      .replace(/&amp;/gi, "&")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">");
  }

  // Convert Smart Quotes, Apostrophes & Dashes
  if (convertSmartQuotes) {
    result = result
      .replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]/g, "'")
      .replace(/[\u201C\u201D\u201E\u201F\u2033\u2036]/g, '"')
      .replace(/[\u2013\u2014\u2015]/g, "-")
      .replace(/\u2026/g, "...")
      .replace(/\u00A0/g, " "); // Non-breaking space to regular space
  }

  // Strip emojis if enabled
  if (stripEmojis) {
    result = result.replace(/\p{Extended_Pictographic}/gu, "");
  }

  // Remove non-printable / control characters (except \n, \r, \t)
  if (removeNonPrintable) {
    result = result.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, "");
  }

  // Split lines for line-level operations
  let lines = result.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");

  if (collapseSpaces) {
    lines = lines.map((l) => l.replace(/[^\S\r\n]+/g, " "));
  }

  if (trimLines) {
    lines = lines.map((l) => l.trim());
  }

  if (collapseBlankLines) {
    const collapsed: string[] = [];
    let prevEmpty = false;
    for (const line of lines) {
      const isEmpty = line.trim() === "";
      if (isEmpty) {
        if (!prevEmpty) {
          collapsed.push("");
          prevEmpty = true;
        }
      } else {
        collapsed.push(line);
        prevEmpty = false;
      }
    }
    lines = collapsed;
  }

  return lines.join("\n").trim();
}
