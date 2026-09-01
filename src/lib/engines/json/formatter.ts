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
  validJson: boolean;
  formatMode: "json" | "structural" | "none";
  output: string;
  error?: JsonErrorDetail;
  lineCount: number;
  sizeBytes: number;
  originalSizeBytes: number;
}

function formatStructuredLiteral(
  rawInput: string,
  indentValue: string,
  compact: boolean
) {
  const stack: string[] = [];
  let output = "";
  let quote: "'" | '"' | null = null;
  let escaped = false;
  let sawContainer = false;
  let rootClosed = false;

  const indentation = () => indentValue.repeat(stack.length);
  const appendBreak = () => {
    output = output.trimEnd();
    if (!compact) output += `\n${indentation()}`;
  };
  const followedByQuotedProperty = (startIndex: number) => {
    let index = startIndex;
    while (/\s/.test(rawInput[index] ?? "")) index++;
    const propertyQuote = rawInput[index];
    if (propertyQuote !== "'" && propertyQuote !== '"') return false;
    index++;
    let propertyEscaped = false;
    while (index < rawInput.length) {
      const character = rawInput[index];
      if (propertyEscaped) propertyEscaped = false;
      else if (character === "\\") propertyEscaped = true;
      else if (character === propertyQuote) break;
      index++;
    }
    if (rawInput[index] !== propertyQuote) return false;
    index++;
    while (/\s/.test(rawInput[index] ?? "")) index++;
    return rawInput[index] === ":";
  };

  for (let index = 0; index < rawInput.length; index++) {
    const character = rawInput[index];

    if (quote) {
      output += character;
      if (escaped) escaped = false;
      else if (character === "\\") escaped = true;
      else if (character === quote) quote = null;
      continue;
    }

    if (character === "'" || character === '"') {
      if (!stack.length) throw new Error("Quoted content must be inside an object or array.");
      quote = character;
      output += character;
      continue;
    }

    if (/\s/.test(character)) continue;
    if (rootClosed) throw new Error("Unexpected content after the root object or array.");

    if (character === "{" || character === "[") {
      sawContainer = true;
      stack.push(character);
      output = output.trimEnd() + character;
      appendBreak();
      continue;
    }

    if (character === "}" || character === "]") {
      const expected = character === "}" ? "{" : "[";
      if (stack.at(-1) !== expected) throw new Error(`Unexpected closing ${character}.`);
      if (
        character === "}" &&
        stack.length === 1 &&
        followedByQuotedProperty(index + 1) &&
        rawInput.trimEnd().endsWith("}")
      ) {
        output = output.trimEnd() + ",";
        appendBreak();
        continue;
      }
      stack.pop();
      output = output.trimEnd();
      if (!compact && !output.endsWith(expected)) output += `\n${indentation()}`;
      output += character;
      if (!stack.length) rootClosed = true;
      continue;
    }

    if (!stack.length) throw new Error("Input must start with an object or array.");
    if (character === ",") {
      output = output.trimEnd() + character;
      appendBreak();
    } else if (character === ":") {
      output = output.trimEnd() + `:${compact ? "" : " "}`;
    } else {
      output += character;
    }
  }

  if (quote) throw new Error(`Unclosed ${quote} quoted value.`);
  if (stack.length) throw new Error("One or more objects or arrays are not closed.");
  if (!sawContainer || !rootClosed) throw new Error("Input must contain one complete object or array.");
  return output.trim();
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
      validJson: true,
      formatMode: "json",
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
      validJson: true,
      formatMode: "json",
      output,
      lineCount,
      sizeBytes,
      originalSizeBytes,
    };
  } catch (err) {
    const errorDetail = parseJsonError(err as Error, rawInput);
    let indentValue = "  ";
    if (options.indent === "tab") indentValue = "\t";
    else if (typeof options.indent === "number") indentValue = " ".repeat(options.indent);

    try {
      const output = formatStructuredLiteral(rawInput, indentValue, Boolean(options.compact));
      return {
        success: true,
        validJson: false,
        formatMode: "structural",
        output,
        error: errorDetail,
        lineCount: output.split("\n").length,
        sizeBytes: new TextEncoder().encode(output).length,
        originalSizeBytes,
      };
    } catch {
      // Preserve the strict JSON error when the input is not structurally safe to format.
    }
    return {
      success: false,
      validJson: false,
      formatMode: "none",
      output: rawInput,
      error: errorDetail,
      lineCount: rawInput.split("\n").length,
      sizeBytes: originalSizeBytes,
      originalSizeBytes,
    };
  }
}
