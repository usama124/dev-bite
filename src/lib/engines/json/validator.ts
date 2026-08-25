export interface ValidationResult {
  valid: boolean;
  error?: string;
  line?: number;
  column?: number;
  parsed?: unknown;
}

export function validateJson(input: string): ValidationResult {
  if (!input || !input.trim()) {
    return { valid: false, error: "Input is empty. Please provide a JSON string." };
  }
  try {
    const parsed = JSON.parse(input);
    return { valid: true, parsed };
  } catch (err) {
    const msg = (err as SyntaxError).message;
    // Extract line/col from V8 error messages
    const posMatch = msg.match(/position (\d+)/);
    let line: number | undefined;
    let column: number | undefined;
    if (posMatch) {
      const pos = parseInt(posMatch[1]);
      const before = input.slice(0, pos);
      const lines = before.split("\n");
      line = lines.length;
      column = lines[lines.length - 1].length + 1;
    }
    return {
      valid: false,
      error: msg.replace(/^JSON\.parse: /, "").replace(/^SyntaxError: /, ""),
      line,
      column,
    };
  }
}
