export interface WordCountOptions {
  ignorePunctuation?: boolean;
  wordsPerMinute?: number;
  speakingWordsPerMinute?: number;
}

export interface WordFrequency {
  word: string;
  count: number;
  percentage: number;
}

export interface WordCountResult {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  readingTimeMinutes: number;
  readingTimeFormatted: string;
  speakingTimeMinutes: number;
  speakingTimeFormatted: string;
  avgWordLength: number;
  topWords: WordFrequency[];
}

export function countWordsAndStats(
  text: string,
  options: WordCountOptions = {}
): WordCountResult {
  const {
    wordsPerMinute = 200,
    speakingWordsPerMinute = 130,
  } = options;

  if (!text || text.trim() === "") {
    return {
      words: 0,
      characters: 0,
      charactersNoSpaces: 0,
      sentences: 0,
      paragraphs: 0,
      lines: 0,
      readingTimeMinutes: 0,
      readingTimeFormatted: "0 sec",
      speakingTimeMinutes: 0,
      speakingTimeFormatted: "0 sec",
      avgWordLength: 0,
      topWords: [],
    };
  }

  // Characters total (Unicode-aware array length)
  const characters = Array.from(text).length;

  // Characters excluding whitespace
  const charactersNoSpaces = Array.from(text.replace(/\s/g, "")).length;

  // Lines
  const lines = text.split(/\r?\n/).length;

  // Paragraphs (separated by one or more blank lines)
  const paragraphs = text
    .split(/\n\s*\n+/)
    .filter((p) => p.trim().length > 0).length;

  // Words tokenization
  let wordsList: string[] = [];

  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter("en", { granularity: "word" });
    const segments = segmenter.segment(text);
    for (const seg of segments) {
      if (seg.isWordLike) {
        wordsList.push(seg.segment);
      }
    }
  } else {
    // Regex fallback
    const matches = text.match(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu);
    wordsList = matches ? Array.from(matches) : [];
  }

  const words = wordsList.length;

  // Sentences count
  const sentencesMatches = text
    .trim()
    .split(/[.!?]+(?:\s+|$)/)
    .filter((s) => s.trim().length > 0);
  const sentences = sentencesMatches.length;

  // Reading / Speaking time
  const readingTimeMinutes = words / wordsPerMinute;
  const speakingTimeMinutes = words / speakingWordsPerMinute;

  const formatTime = (minutes: number): string => {
    if (minutes === 0) return "0 sec";
    const totalSeconds = Math.ceil(minutes * 60);
    if (totalSeconds < 60) {
      return `${totalSeconds} sec`;
    }
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return secs > 0 ? `${mins} min ${secs} sec` : `${mins} min`;
  };

  // Average word length
  const totalLetters = wordsList.reduce((acc, w) => acc + Array.from(w).length, 0);
  const avgWordLength = words > 0 ? parseFloat((totalLetters / words).toFixed(1)) : 0;

  // Word frequency (top 10)
  const freqMap = new Map<string, number>();
  for (const w of wordsList) {
    const lower = w.toLowerCase();
    if (lower.length > 1) {
      freqMap.set(lower, (freqMap.get(lower) || 0) + 1);
    }
  }

  const topWords: WordFrequency[] = Array.from(freqMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word, count]) => ({
      word,
      count,
      percentage: words > 0 ? parseFloat(((count / words) * 100).toFixed(1)) : 0,
    }));

  return {
    words,
    characters,
    charactersNoSpaces,
    sentences,
    paragraphs,
    lines,
    readingTimeMinutes,
    readingTimeFormatted: formatTime(readingTimeMinutes),
    speakingTimeMinutes,
    speakingTimeFormatted: formatTime(speakingTimeMinutes),
    avgWordLength,
    topWords,
  };
}
