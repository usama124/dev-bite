import { describe, it, expect } from "vitest";
import { countWordsAndStats } from "../src/lib/engines/text/word-counter";

describe("Text Processing Engine — Word Counter", () => {
  it("should handle empty and whitespace-only input", () => {
    const res1 = countWordsAndStats("");
    expect(res1.words).toBe(0);
    expect(res1.characters).toBe(0);

    const res2 = countWordsAndStats("    \n\t  ");
    expect(res2.words).toBe(0);
    expect(res2.characters).toBe(0);
  });

  it("should correctly count simple text statistics", () => {
    const text = "Hello world! This is a simple test.";
    const res = countWordsAndStats(text);

    expect(res.words).toBe(7);
    expect(res.characters).toBe(text.length);
    expect(res.charactersNoSpaces).toBe(text.replace(/\s/g, "").length);
    expect(res.sentences).toBe(2);
    expect(res.paragraphs).toBe(1);
    expect(res.lines).toBe(1);
  });

  it("should handle multiline paragraphs and line breaks", () => {
    const text = "Paragraph one with some words.\n\nParagraph two with more words.\nAnd a third line.";
    const res = countWordsAndStats(text);

    expect(res.paragraphs).toBe(2);
    expect(res.lines).toBe(4);
    expect(res.words).toBe(14);
  });

  it("should handle unicode, emojis and international characters", () => {
    const text = "Café au lait 🥐 avec crème! 🚀 Developer tools are awesome.";
    const res = countWordsAndStats(text);

    expect(res.words).toBeGreaterThanOrEqual(8);
    expect(res.characters).toBe(Array.from(text).length);
  });

  it("should compute reading and speaking estimates", () => {
    const longText = Array(200).fill("word").join(" ");
    const res = countWordsAndStats(longText);

    expect(res.words).toBe(200);
    expect(res.readingTimeMinutes).toBe(1);
    expect(res.readingTimeFormatted).toBe("1 min");
  });
});
