export interface JoinOptions {
  delimiter: string;
  trimItems?: boolean;
  removeEmptyItems?: boolean;
  quoteWrap?: "none" | "single" | "double";
  prefix?: string;
  suffix?: string;
}

export interface SplitOptions {
  delimiter: string;
  isRegex?: boolean;
  trimItems?: boolean;
  removeEmptyItems?: boolean;
}

export function joinText(lines: string, options: JoinOptions): string {
  if (!lines) return "";

  const {
    delimiter = ", ",
    trimItems = true,
    removeEmptyItems = true,
    quoteWrap = "none",
    prefix = "",
    suffix = "",
  } = options;

  let items = lines.split(/\r?\n/);

  if (trimItems) {
    items = items.map((i) => i.trim());
  }

  if (removeEmptyItems) {
    items = items.filter((i) => i.length > 0);
  }

  if (quoteWrap === "single") {
    items = items.map((i) => `'${i}'`);
  } else if (quoteWrap === "double") {
    items = items.map((i) => `"${i}"`);
  }

  return prefix + items.join(delimiter) + suffix;
}

export function splitText(source: string, options: SplitOptions): string {
  if (!source) return "";

  const {
    delimiter = ",",
    isRegex = false,
    trimItems = true,
    removeEmptyItems = true,
  } = options;

  let rawItems: string[] = [];

  try {
    if (isRegex) {
      rawItems = source.split(new RegExp(delimiter));
    } else {
      rawItems = source.split(delimiter);
    }
  } catch {
    rawItems = source.split(delimiter);
  }

  if (trimItems) {
    rawItems = rawItems.map((i) => i.trim());
  }

  if (removeEmptyItems) {
    rawItems = rawItems.filter((i) => i.length > 0);
  }

  return rawItems.join("\n");
}
