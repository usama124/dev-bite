export interface FindReplaceOptions {
  findText: string;
  replaceText: string;
  isRegex?: boolean;
  matchCase?: boolean;
  wholeWord?: boolean;
  replaceAll?: boolean;
}

export interface FindReplaceResult {
  success: boolean;
  output: string;
  matchCount: number;
  error?: string;
}

function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function findAndReplace(
  source: string,
  options: FindReplaceOptions
): FindReplaceResult {
  const {
    findText,
    replaceText,
    isRegex = false,
    matchCase = false,
    wholeWord = false,
    replaceAll = true,
  } = options;

  if (!source || !findText) {
    return {
      success: true,
      output: source || "",
      matchCount: 0,
    };
  }

  try {
    let pattern = findText;
    let flags = "";

    if (replaceAll) flags += "g";
    if (!matchCase) flags += "i";

    if (!isRegex) {
      pattern = escapeRegex(findText);
      if (wholeWord) {
        pattern = `\\b${pattern}\\b`;
      }
    } else if (wholeWord) {
      pattern = `\\b(?:${pattern})\\b`;
    }

    const regex = new RegExp(pattern, flags);
    const matches = source.match(regex);
    const matchCount = matches ? matches.length : 0;

    const output = source.replace(regex, replaceText);

    return {
      success: true,
      output,
      matchCount,
    };
  } catch (err) {
    return {
      success: false,
      output: source,
      matchCount: 0,
      error: (err as Error).message || "Invalid regular expression pattern.",
    };
  }
}

export function findAndRemove(
  source: string,
  options: Omit<FindReplaceOptions, "replaceText"> & { removeWholeLines?: boolean }
): FindReplaceResult {
  const { removeWholeLines = false, ...rest } = options;

  if (removeWholeLines && source && rest.findText) {
    try {
      const lines = source.split(/\r?\n/);
      let matchCount = 0;
      let regex: RegExp;

      let flags = rest.matchCase ? "" : "i";
      let pattern = rest.isRegex ? rest.findText : escapeRegex(rest.findText);
      if (rest.wholeWord) pattern = `\\b${pattern}\\b`;

      regex = new RegExp(pattern, flags);

      const keptLines = lines.filter((line) => {
        const matches = regex.test(line);
        if (matches) {
          matchCount++;
          return false;
        }
        return true;
      });

      return {
        success: true,
        output: keptLines.join("\n"),
        matchCount,
      };
    } catch (err) {
      return {
        success: false,
        output: source,
        matchCount: 0,
        error: (err as Error).message,
      };
    }
  }

  return findAndReplace(source, {
    ...rest,
    replaceText: "",
  });
}
