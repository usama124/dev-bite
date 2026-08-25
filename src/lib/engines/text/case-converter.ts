export type CaseType =
  | "uppercase"
  | "lowercase"
  | "titlecase"
  | "sentencecase"
  | "camelcase"
  | "pascalcase"
  | "snakecase"
  | "kebabcase"
  | "constantcase"
  | "dotcase"
  | "pathcase"
  | "alternatingcase"
  | "inversecase";

export function extractWords(text: string): string[] {
  // Split on spaces, underscores, hyphens, dots, slashes, or camelCase transitions
  const clean = text
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2");
  return clean
    .split(/[\s_\-./\\]+/)
    .filter((w) => w.trim().length > 0);
}

export function convertCase(text: string, caseType: CaseType): string {
  if (!text) return "";

  const words = extractWords(text);

  switch (caseType) {
    case "uppercase":
      return text.toUpperCase();

    case "lowercase":
      return text.toLowerCase();

    case "titlecase":
      return text.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());

    case "sentencecase":
      return text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());

    case "camelcase":
      if (words.length === 0) return "";
      return (
        words[0].toLowerCase() +
        words
          .slice(1)
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join("")
      );

    case "pascalcase":
      return words
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join("");

    case "snakecase":
      return words.map((w) => w.toLowerCase()).join("_");

    case "kebabcase":
      return words.map((w) => w.toLowerCase()).join("-");

    case "constantcase":
      return words.map((w) => w.toUpperCase()).join("_");

    case "dotcase":
      return words.map((w) => w.toLowerCase()).join(".");

    case "pathcase":
      return words.map((w) => w.toLowerCase()).join("/");

    case "alternatingcase":
      return Array.from(text)
        .map((char, index) =>
          index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
        )
        .join("");

    case "inversecase":
      return Array.from(text)
        .map((char) =>
          char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
        )
        .join("");

    default:
      return text;
  }
}
