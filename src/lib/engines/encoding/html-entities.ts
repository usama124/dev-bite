export type HtmlEntityStyle = "named" | "decimal" | "hexadecimal";

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: "\u00a0",
  copy: "©", reg: "®", trade: "™", cent: "¢", pound: "£", yen: "¥", euro: "€",
  hellip: "…", mdash: "—", ndash: "–", laquo: "«", raquo: "»",
};

const CHARACTER_TO_NAMED = Object.fromEntries(Object.entries(NAMED_ENTITIES).map(([name, character]) => [character, name]));

function shouldEncode(character: string, encodeNonAscii: boolean): boolean {
  return "&<>\"'".includes(character) || (encodeNonAscii && (character.codePointAt(0) ?? 0) > 127);
}

export function encodeHtmlEntities(
  input: string,
  style: HtmlEntityStyle = "named",
  encodeNonAscii = false
): string {
  return Array.from(input).map((character) => {
    if (!shouldEncode(character, encodeNonAscii)) return character;
    const codePoint = character.codePointAt(0) ?? 0;
    if (style === "named" && CHARACTER_TO_NAMED[character]) return `&${CHARACTER_TO_NAMED[character]};`;
    if (style === "hexadecimal") return `&#x${codePoint.toString(16).toUpperCase()};`;
    return `&#${codePoint};`;
  }).join("");
}

export function decodeHtmlEntities(input: string, strict = false): { success: boolean; output: string; error?: string } {
  let invalidEntity: string | undefined;
  const output = input.replace(/&(#(?:x[0-9a-f]+|\d+)|[a-z][a-z0-9]+);/gi, (entity, body: string) => {
    const normalized = body.toLowerCase();
    let codePoint: number | undefined;
    if (normalized.startsWith("#x")) codePoint = Number.parseInt(normalized.slice(2), 16);
    else if (normalized.startsWith("#")) codePoint = Number.parseInt(normalized.slice(1), 10);
    else if (NAMED_ENTITIES[normalized] !== undefined) return NAMED_ENTITIES[normalized];
    else {
      invalidEntity = entity;
      return entity;
    }
    if (!Number.isInteger(codePoint) || codePoint < 0 || codePoint > 0x10ffff || (codePoint >= 0xd800 && codePoint <= 0xdfff)) {
      invalidEntity = entity;
      return entity;
    }
    return String.fromCodePoint(codePoint);
  });
  if (strict && invalidEntity) return { success: false, output: "", error: `Unknown or invalid HTML entity: ${invalidEntity}` };
  return { success: true, output };
}
