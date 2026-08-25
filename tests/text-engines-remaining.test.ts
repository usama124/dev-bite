import { describe, it, expect } from "vitest";
import { countCharacters } from "../src/lib/engines/text/character-counter";
import { computeTextStatistics } from "../src/lib/engines/text/text-statistics";
import { removeWhitespace } from "../src/lib/engines/text/whitespace-remover";
import { cleanText } from "../src/lib/engines/text/text-cleaner";
import { convertCase } from "../src/lib/engines/text/case-converter";
import { findAndReplace, findAndRemove } from "../src/lib/engines/text/find-replace";
import { removeDuplicateLines } from "../src/lib/engines/text/duplicate-lines";
import { sortLines } from "../src/lib/engines/text/sort-lines";
import { diffLines } from "../src/lib/engines/text/text-diff";
import { joinText, splitText } from "../src/lib/engines/text/joiner-splitter";

describe("Text Category Processing Engines", () => {
  // 1. Character Counter
  it("should count characters, unicode, bytes and social limits correctly", () => {
    const text = "DevBite 🚀";
    const res = countCharacters(text);
    expect(res.characters).toBe(9);
    expect(res.charactersNoSpaces).toBe(8);
    expect(res.bytesUtf8).toBeGreaterThan(9);
    expect(res.socialLimits.twitter.remaining).toBe(271);
  });

  // 2. Text Statistics & Readability
  it("should compute text readability, grade level and lexical diversity", () => {
    const text = "The quick brown fox jumps over the lazy dog. It was a sunny and pleasant afternoon.";
    const stats = computeTextStatistics(text);
    expect(stats.words).toBe(16);
    expect(stats.sentences).toBe(2);
    expect(stats.fleschReadingEase).toBeGreaterThan(50);
    expect(stats.uniqueWords).toBeGreaterThanOrEqual(13);
  });

  // 3. Whitespace Remover
  it("should collapse and normalize spaces and line endings", () => {
    const text = "  hello    world   \n\n\n  foo   bar  ";
    const collapsed = removeWhitespace(text, { collapseMultipleSpaces: true, trimLineEdges: true, removeBlankLines: true });
    expect(collapsed).toBe("hello world\nfoo bar");

    const noSpaces = removeWhitespace("a b c d\n e", { removeAllWhitespace: true });
    expect(noSpaces).toBe("abcde");
  });

  // 4. Text Cleaner
  it("should strip HTML tags, smart quotes and non-printable characters", () => {
    const dirty = "<p>Hello &ldquo;World&rdquo; &mdash; <b>clean</b></p>";
    const cleaned = cleanText(dirty, { stripHtml: true, convertSmartQuotes: true });
    expect(cleaned).toBe('Hello "World" - clean');
  });

  // 5. Case Converter
  it("should convert across 12 case styles accurately", () => {
    const raw = "hello-world_test";
    expect(convertCase(raw, "camelcase")).toBe("helloWorldTest");
    expect(convertCase(raw, "pascalcase")).toBe("HelloWorldTest");
    expect(convertCase(raw, "snakecase")).toBe("hello_world_test");
    expect(convertCase(raw, "kebabcase")).toBe("hello-world-test");
    expect(convertCase(raw, "constantcase")).toBe("HELLO_WORLD_TEST");
    expect(convertCase("hello world", "titlecase")).toBe("Hello World");
  });

  // 6. Find & Replace and Find & Remove
  it("should find and replace with regex and match count", () => {
    const source = "The cat and the Cat in the hat.";
    const res = findAndReplace(source, { findText: "cat", replaceText: "dog", matchCase: false, replaceAll: true });
    expect(res.success).toBe(true);
    expect(res.matchCount).toBe(2);
    expect(res.output).toBe("The dog and the dog in the hat.");

    const removed = findAndRemove("Line 1: error\nLine 2: info\nLine 3: error log", { findText: "error", removeWholeLines: true });
    expect(removed.output).toBe("Line 2: info");
  });

  // 7. Remove Duplicate Lines
  it("should deduplicate lines while preserving order and occurrence", () => {
    const text = "apple\nbanana\napple\ncherry\nbanana";
    const res = removeDuplicateLines(text, { preserveOccurrence: "first" });
    expect(res.uniqueLinesCount).toBe(3);
    expect(res.output).toBe("apple\nbanana\ncherry");
    expect(res.duplicateLinesCount).toBe(2);
  });

  // 8. Sort Lines
  it("should sort lines alphabetically, naturally and by length", () => {
    const text = "zebra\napple\nbanana";
    expect(sortLines(text, { mode: "alphabetical", direction: "asc" })).toBe("apple\nbanana\nzebra");
    expect(sortLines(text, { mode: "alphabetical", direction: "desc" })).toBe("zebra\nbanana\napple");

    const numbered = "item10\nitem2\nitem1";
    expect(sortLines(numbered, { mode: "natural", direction: "asc" })).toBe("item1\nitem2\nitem10");

    const lengths = "a\naaaa\naa";
    expect(sortLines(lengths, { mode: "length", direction: "asc" })).toBe("a\naa\naaaa");
  });

  // 9. Text Diff
  it("should compute line diff additions, deletions, and unchanged lines", () => {
    const a = "line 1\nline 2\nline 3";
    const b = "line 1\nline 2 modified\nline 3\nline 4";
    const diff = diffLines(a, b);
    expect(diff.additions).toBeGreaterThan(0);
    expect(diff.deletions).toBeGreaterThan(0);
    expect(diff.unchanged).toBeGreaterThanOrEqual(2);
  });

  // 10. Joiner & Splitter
  it("should join lines with delimiters and split text into lines", () => {
    const lines = "apple\nbanana\ncherry";
    const joined = joinText(lines, { delimiter: ", ", quoteWrap: "double" });
    expect(joined).toBe('"apple", "banana", "cherry"');

    const csv = "one, two, three, four";
    const split = splitText(csv, { delimiter: "," });
    expect(split).toBe("one\ntwo\nthree\nfour");
  });
});
