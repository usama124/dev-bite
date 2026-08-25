export interface JsonFormatOptions {
  indent?: number | "tab";
  sortKeys?: boolean;
  compact?: boolean;
}

export interface JsonErrorDetail {
  message: string;
  line: number;
  column: number;
  snippet?: string;
  hint?: string;
}

export interface JsonFormatResult {
  success: boolean;
  output: string;
  error?: JsonErrorDetail;
  lineCount: number;
  sizeBytes: number;
  originalSizeBytes: number;
}

function sortJsonKeys(obj: unknown): unknown {
  if (Array.isArray(obj)) {
    return obj.map(sortJsonKeys);
  }
  if (obj !== null && typeof obj === "object") {
    return Object.keys(obj as Record<string, unknown>)
      .sort()
      .reduce((sorted: Record<string, unknown>, key: string) => {
        sorted[key] = sortJsonKeys((obj as Record<string, unknown>)[key]);
        return sorted;
      }, {});
  }
  return obj;
}

function parseJsonError(rawError: Error, rawJson: string): JsonErrorDetail {
  const message = rawError.message;
  let line = 1;
  let column = 1;
  let hint = "Check your JSON syntax for valid brackets, quotes, and commas.";

  // Common syntax error patterns
  if (message.includes("position")) {
    const posMatch = message.match(/position\s+(\d+)/i);
    if (posMatch) {
      const pos = parseInt(posMatch[1], 10);
      const linesUpToPos = rawJson.slice(0, pos).split("\n");
      line = linesUpToPos.length;
      column = linesUpToPos[linesUpToPos.length - 1].length + 1;
    }
  } else if (message.includes("line") && message.includes("column")) {
    const lineMatch = message.match(/line\s+(\d+)/i);
    const colMatch = message.match(/column\s+(\d+)/i);
    if (lineMatch) line = parseInt(lineMatch[1], 10);
    if (colMatch) column = parseInt(colMatch[1], 10);
  }

  // Generate snippet
  const lines = rawJson.split("\n");
  let snippet = "";
  if (line <= lines.length) {
    const targetLine = lines[line - 1] || "";
    const pointer = " ".repeat(Math.max(0, column - 1)) + "^";
    snippet = `${targetLine}\n${pointer}`;
  }

  // Provide helpful hints
  if (rawJson.includes("'")) {
    hint = "JSON requires double quotes (\") for strings and keys. Single quotes (') are not allowed.";
  } else if (rawJson.match(/,\s*[}\]]/)) {
    hint = "Trailing commas are not permitted in JSON (e.g. `[1, 2,]` or `{\"a\": 1,}`).";
  } else if (rawJson.match(/([{,]\s*)([a-zA-Z0-9_$]+)(\s*:)/)) {
    hint = "Object keys in JSON must be wrapped in double quotes (e.g. `\"key\": \"value\"`).";
  } else if (rawJson.includes("undefined")) {
    hint = "`undefined` is not a valid JSON value. Use `null` instead.";
  } else if (message.toLowerCase().includes("unexpected end")) {
    hint = "The JSON ended unexpectedly. Make sure all open braces `{` and brackets `[` are closed.";
  }

  // Clean friendly message
  let friendlyMessage = message.replace(/^JSON\.parse:\s*/i, "").replace(/^SyntaxError:\s*/i, "");
  friendlyMessage = friendlyMessage.charAt(0).toUpperCase() + friendlyMessage.slice(1);

  return {
    message: friendlyMessage,
    line,
    column,
    snippet,
    hint,
  };
}

export function formatJson(
  rawInput: string,
  options: JsonFormatOptions = {}
): JsonFormatResult {
  const originalSizeBytes = new TextEncoder().encode(rawInput).length;

  if (!rawInput || rawInput.trim() === "") {
    return {
      success: true,
      output: "",
      lineCount: 0,
      sizeBytes: 0,
      originalSizeBytes: 0,
    };
  }

  try {
    let parsed = JSON.parse(rawInput);

    if (options.sortKeys) {
      parsed = sortJsonKeys(parsed);
    }

    let indentValue: string | number = 2;
    if (options.compact) {
      indentValue = 0;
    } else if (options.indent === "tab") {
      indentValue = "\t";
    } else if (typeof options.indent === "number") {
      indentValue = options.indent;
    }

    const output = options.compact
      ? JSON.stringify(parsed)
      : JSON.stringify(parsed, null, indentValue);

    const sizeBytes = new TextEncoder().encode(output).length;
    const lineCount = output.split("\n").length;

    return {
      success: true,
      output,
      lineCount,
      sizeBytes,
      originalSizeBytes,
    };
  } catch (err) {
    const errorDetail = parseJsonError(err as Error, rawInput);
    return {
      success: false,
      output: rawInput,
      error: errorDetail,
      lineCount: rawInput.split("\n").length,
      sizeBytes: originalSizeBytes,
      originalSizeBytes,
    };
  }
}
