export const TOOL_LIMITS = {
  textDiffMaxMatrixCells: 2_000_000,
  dataProgressiveThresholdChars: 250_000,
  dataMaxInputChars: 20_000_000,
  dataFileMaxBytes: 20_000_000,
  localFileMaxBytes: 100 * 1024 * 1024,
  localFileWarningBytes: 25 * 1024 * 1024,
  base64FileMaxBytes: 20 * 1024 * 1024,
  base64InputMaxChars: 30_000_000,
} as const;
