import { TOOL_LIMITS } from "@/config/limits";

export type DiffType = "unchanged" | "added" | "removed";

export interface DiffLine {
  type: DiffType;
  value: string;
  oldLineNumber?: number;
  newLineNumber?: number;
}

export interface DiffResult {
  lines: DiffLine[];
  additions: number;
  deletions: number;
  unchanged: number;
  error?: string;
}

// LCS (Longest Common Subsequence) Line Diff Engine
export function diffLines(textA: string, textB: string): DiffResult {
  const linesA = textA ? textA.split(/\r?\n/) : [];
  const linesB = textB ? textB.split(/\r?\n/) : [];

  const n = linesA.length;
  const m = linesB.length;

  if (n * m > TOOL_LIMITS.textDiffMaxMatrixCells) {
    return {
      lines: [],
      additions: 0,
      deletions: 0,
      unchanged: 0,
      error: `This comparison is too large for the browser-safe diff limit (${TOOL_LIMITS.textDiffMaxMatrixCells.toLocaleString()} line comparisons). Split the inputs into smaller sections and try again.`,
    };
  }

  // DP table for LCS
  const dp: number[][] = Array.from({ length: n + 1 }, () =>
    new Array(m + 1).fill(0)
  );

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      if (linesA[i - 1] === linesB[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  // Backtrack to build diff
  const diff: DiffLine[] = [];
  let i = n;
  let j = m;
  let additions = 0;
  let deletions = 0;
  let unchanged = 0;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && linesA[i - 1] === linesB[j - 1]) {
      diff.unshift({
        type: "unchanged",
        value: linesA[i - 1],
        oldLineNumber: i,
        newLineNumber: j,
      });
      unchanged++;
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      diff.unshift({
        type: "added",
        value: linesB[j - 1],
        newLineNumber: j,
      });
      additions++;
      j--;
    } else if (i > 0 && (j === 0 || dp[i][j - 1] < dp[i - 1][j])) {
      diff.unshift({
        type: "removed",
        value: linesA[i - 1],
        oldLineNumber: i,
      });
      deletions++;
      i--;
    }
  }

  return {
    lines: diff,
    additions,
    deletions,
    unchanged,
  };
}
