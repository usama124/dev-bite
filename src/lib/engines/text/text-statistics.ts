export interface TextStatisticsResult {
  words: number;
  uniqueWords: number;
  lexicalDiversityPercent: number;
  characters: number;
  charactersNoSpaces: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  syllables: number;
  avgSentenceLengthWords: number;
  avgWordLengthChars: number;
  avgSyllablesPerWord: number;
  fleschReadingEase: number;
  fleschGradeLevel: number;
  readingEaseLabel: string;
  gradeLevelLabel: string;
  readingTimeMinutes: number;
  readingTimeFormatted: string;
  speakingTimeMinutes: number;
  speakingTimeFormatted: string;
}

function countWordSyllables(word: string): number {
  const clean = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!clean) return 0;
  if (clean.length <= 3) return 1;

  // Syllable regex approximation
  const cleanWord = clean
    .replace(/(?:[^laeiouy]|ed|es|e)$/, "")
    .replace(/^y/, "");
  const syllables = cleanWord.match(/[aeiouy]{1,2}/g);
  return syllables ? Math.max(1, syllables.length) : 1;
}

export function computeTextStatistics(text: string): TextStatisticsResult {
  if (!text || text.trim() === "") {
    return {
      words: 0,
      uniqueWords: 0,
      lexicalDiversityPercent: 0,
      characters: 0,
      charactersNoSpaces: 0,
      sentences: 0,
      paragraphs: 0,
      lines: 0,
      syllables: 0,
      avgSentenceLengthWords: 0,
      avgWordLengthChars: 0,
      avgSyllablesPerWord: 0,
      fleschReadingEase: 0,
      fleschGradeLevel: 0,
      readingEaseLabel: "N/A",
      gradeLevelLabel: "N/A",
      readingTimeMinutes: 0,
      readingTimeFormatted: "0 sec",
      speakingTimeMinutes: 0,
      speakingTimeFormatted: "0 sec",
    };
  }

  const characters = Array.from(text).length;
  const charactersNoSpaces = Array.from(text.replace(/\s/g, "")).length;
  const lines = text.split(/\r?\n/).length;
  const paragraphs = text.split(/\n\s*\n+/).filter((p) => p.trim().length > 0).length;

  const wordsMatch = text.match(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu) || [];
  const words = wordsMatch.length;

  const uniqueWordsSet = new Set(wordsMatch.map((w) => w.toLowerCase()));
  const uniqueWords = uniqueWordsSet.size;
  const lexicalDiversityPercent =
    words > 0 ? parseFloat(((uniqueWords / words) * 100).toFixed(1)) : 0;

  const sentencesMatches = text
    .trim()
    .split(/[.!?]+(?:\s+|$)/)
    .filter((s) => s.trim().length > 0);
  const sentences = Math.max(1, sentencesMatches.length);

  let totalSyllables = 0;
  let totalCharsInWords = 0;
  for (const w of wordsMatch) {
    totalSyllables += countWordSyllables(w);
    totalCharsInWords += Array.from(w).length;
  }

  const avgSentenceLengthWords =
    words > 0 ? parseFloat((words / sentences).toFixed(1)) : 0;
  const avgWordLengthChars =
    words > 0 ? parseFloat((totalCharsInWords / words).toFixed(1)) : 0;
  const avgSyllablesPerWord =
    words > 0 ? parseFloat((totalSyllables / words).toFixed(2)) : 0;

  // Flesch Reading Ease = 206.835 - 1.015 * (total words / total sentences) - 84.6 * (total syllables / total words)
  let fleschReadingEase = 0;
  let fleschGradeLevel = 0;

  if (words > 0 && sentences > 0) {
    const rawEase =
      206.835 -
      1.015 * (words / sentences) -
      84.6 * (totalSyllables / words);
    fleschReadingEase = parseFloat(Math.min(100, Math.max(0, rawEase)).toFixed(1));

    // Flesch-Kincaid Grade Level = 0.39 * (total words / total sentences) + 11.8 * (total syllables / total words) - 15.59
    const rawGrade =
      0.39 * (words / sentences) +
      11.8 * (totalSyllables / words) -
      15.59;
    fleschGradeLevel = parseFloat(Math.max(0, rawGrade).toFixed(1));
  }

  let readingEaseLabel = "Standard / Average";
  if (fleschReadingEase >= 90) readingEaseLabel = "Very Easy (5th grade)";
  else if (fleschReadingEase >= 80) readingEaseLabel = "Easy (6th grade)";
  else if (fleschReadingEase >= 70) readingEaseLabel = "Fairly Easy (7th grade)";
  else if (fleschReadingEase >= 60) readingEaseLabel = "Standard (8th & 9th grade)";
  else if (fleschReadingEase >= 50) readingEaseLabel = "Fairly Difficult (High School)";
  else if (fleschReadingEase >= 30) readingEaseLabel = "Difficult (College)";
  else readingEaseLabel = "Very Difficult (Graduate)";

  let gradeLevelLabel = `Grade ${Math.round(fleschGradeLevel)}`;
  if (fleschGradeLevel <= 5) gradeLevelLabel = "Elementary Level";
  else if (fleschGradeLevel <= 8) gradeLevelLabel = "Middle School";
  else if (fleschGradeLevel <= 12) gradeLevelLabel = "High School";
  else gradeLevelLabel = "College / Professional";

  const readingTimeMinutes = words / 200;
  const speakingTimeMinutes = words / 130;

  const formatTime = (minutes: number): string => {
    if (minutes === 0) return "0 sec";
    const totalSecs = Math.ceil(minutes * 60);
    if (totalSecs < 60) return `${totalSecs} sec`;
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return s > 0 ? `${m} min ${s} sec` : `${m} min`;
  };

  return {
    words,
    uniqueWords,
    lexicalDiversityPercent,
    characters,
    charactersNoSpaces,
    sentences,
    paragraphs,
    lines,
    syllables: totalSyllables,
    avgSentenceLengthWords,
    avgWordLengthChars,
    avgSyllablesPerWord,
    fleschReadingEase,
    fleschGradeLevel,
    readingEaseLabel,
    gradeLevelLabel,
    readingTimeMinutes,
    readingTimeFormatted: formatTime(readingTimeMinutes),
    speakingTimeMinutes,
    speakingTimeFormatted: formatTime(speakingTimeMinutes),
  };
}
