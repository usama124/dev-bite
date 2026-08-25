export interface CharacterCountResult {
  characters: number;
  charactersNoSpaces: number;
  charactersNoLinebreaks: number;
  words: number;
  lines: number;
  bytesUtf8: number;
  socialLimits: {
    twitter: { limit: number; remaining: number; percentage: number };
    sms: { limit: number; remaining: number; parts: number };
    metaTitle: { limit: number; remaining: number; percentage: number };
    metaDescription: { limit: number; remaining: number; percentage: number };
  };
}

export function countCharacters(text: string): CharacterCountResult {
  if (!text) {
    return {
      characters: 0,
      charactersNoSpaces: 0,
      charactersNoLinebreaks: 0,
      words: 0,
      lines: 0,
      bytesUtf8: 0,
      socialLimits: {
        twitter: { limit: 280, remaining: 280, percentage: 0 },
        sms: { limit: 160, remaining: 160, parts: 0 },
        metaTitle: { limit: 60, remaining: 60, percentage: 0 },
        metaDescription: { limit: 160, remaining: 160, percentage: 0 },
      },
    };
  }

  const characters = Array.from(text).length;
  const charactersNoSpaces = Array.from(text.replace(/\s/g, "")).length;
  const charactersNoLinebreaks = Array.from(text.replace(/[\r\n]/g, "")).length;
  const lines = text.split(/\r?\n/).length;
  const bytesUtf8 = new TextEncoder().encode(text).length;

  // Words count
  const wordsMatch = text.match(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu);
  const words = wordsMatch ? wordsMatch.length : 0;

  // Social limits
  const twitterRem = 280 - characters;
  const smsChars = text.length;
  const smsParts = smsChars === 0 ? 0 : smsChars <= 160 ? 1 : Math.ceil(smsChars / 153);
  const metaTitleRem = 60 - characters;
  const metaDescRem = 160 - characters;

  return {
    characters,
    charactersNoSpaces,
    charactersNoLinebreaks,
    words,
    lines,
    bytesUtf8,
    socialLimits: {
      twitter: {
        limit: 280,
        remaining: twitterRem,
        percentage: Math.min(100, Math.round((characters / 280) * 100)),
      },
      sms: {
        limit: 160,
        remaining: Math.max(0, 160 - smsChars),
        parts: smsParts,
      },
      metaTitle: {
        limit: 60,
        remaining: metaTitleRem,
        percentage: Math.min(100, Math.round((characters / 60) * 100)),
      },
      metaDescription: {
        limit: 160,
        remaining: metaDescRem,
        percentage: Math.min(100, Math.round((characters / 160) * 100)),
      },
    },
  };
}
