export interface RegexMatch {
  value: string;
  index: number;
  end: number;
  groups: Array<string | undefined>;
  namedGroups?: Record<string, string>;
}

export interface RegexResult {
  success: boolean;
  matches: RegexMatch[];
  error?: string;
}

const SUPPORTED_FLAGS = new Set(["g", "i", "m", "s", "u", "y"]);

export function normalizeRegexFlags(flags: string, forceGlobal = false): string {
  const normalized = Array.from(new Set(flags.split(""))).join("");
  for (const flag of normalized) {
    if (!SUPPORTED_FLAGS.has(flag)) throw new Error(`Unsupported regular expression flag: ${flag}`);
  }
  return forceGlobal && !normalized.includes("g") ? `${normalized}g` : normalized;
}

export function testRegex(pattern: string, text: string, flags = "g"): RegexResult {
  if (!pattern) return { success: false, matches: [], error: "Regular expression pattern is empty." };
  try {
    const regex = new RegExp(pattern, normalizeRegexFlags(flags));
    const matches: RegexMatch[] = [];
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
      matches.push({
        value: match[0],
        index: match.index,
        end: match.index + match[0].length,
        groups: match.slice(1),
        namedGroups: match.groups ? { ...match.groups } : undefined,
      });
      if (!regex.global && !regex.sticky) break;
      if (match[0] === "") regex.lastIndex++;
    }
    return { success: true, matches };
  } catch (error) {
    return { success: false, matches: [], error: (error as Error).message };
  }
}

export function replaceRegex(
  pattern: string,
  text: string,
  replacement: string,
  flags = "g"
): { success: boolean; output: string; replacementCount: number; error?: string } {
  const tested = testRegex(pattern, text, flags);
  if (!tested.success) return { success: false, output: "", replacementCount: 0, error: tested.error };
  try {
    const regex = new RegExp(pattern, normalizeRegexFlags(flags));
    return {
      success: true,
      output: text.replace(regex, replacement),
      replacementCount: tested.matches.length,
    };
  } catch (error) {
    return { success: false, output: "", replacementCount: 0, error: (error as Error).message };
  }
}

export function extractRegex(
  pattern: string,
  text: string,
  flags = "g",
  group?: number
): { success: boolean; values: string[]; matches: RegexMatch[]; error?: string } {
  let normalizedFlags: string;
  try {
    normalizedFlags = normalizeRegexFlags(flags, true);
  } catch (error) {
    return { success: false, values: [], matches: [], error: (error as Error).message };
  }
  const result = testRegex(pattern, text, normalizedFlags);
  if (!result.success) return { success: false, values: [], matches: [], error: result.error };
  const values = result.matches.map((match) => {
    if (group === undefined || group === 0) return match.value;
    return match.groups[group - 1] ?? "";
  });
  return { success: true, values, matches: result.matches };
}
