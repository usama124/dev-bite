export type TimestampUnit = "seconds" | "milliseconds";

export interface TimestampResult {
  success: boolean;
  date?: Date;
  seconds?: number;
  milliseconds?: number;
  iso?: string;
  utc?: string;
  local?: string;
  relative?: string;
  error?: string;
}

function relativeTime(date: Date, now = Date.now()): string {
  const seconds = Math.round((date.getTime() - now) / 1000);
  const absolute = Math.abs(seconds);
  const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
  if (absolute < 60) return formatter.format(seconds, "second");
  if (absolute < 3600) return formatter.format(Math.round(seconds / 60), "minute");
  if (absolute < 86400) return formatter.format(Math.round(seconds / 3600), "hour");
  return formatter.format(Math.round(seconds / 86400), "day");
}

function fromDate(date: Date): TimestampResult {
  if (Number.isNaN(date.getTime())) return { success: false, error: "Enter a valid date and time." };
  const milliseconds = date.getTime();
  return {
    success: true,
    date,
    seconds: Math.floor(milliseconds / 1000),
    milliseconds,
    iso: date.toISOString(),
    utc: date.toUTCString(),
    local: date.toLocaleString(),
    relative: relativeTime(date),
  };
}

export function timestampToDate(input: string, unit: TimestampUnit = "seconds"): TimestampResult {
  if (!input.trim()) return { success: false, error: "Timestamp is empty." };
  const value = Number(input);
  if (!Number.isFinite(value)) return { success: false, error: "Timestamp must be a finite number." };
  const milliseconds = unit === "seconds" ? value * 1000 : value;
  if (!Number.isFinite(milliseconds) || Math.abs(milliseconds) > 8.64e15) {
    return { success: false, error: "Timestamp is outside the supported JavaScript date range." };
  }
  return fromDate(new Date(milliseconds));
}

export function dateToTimestamp(input: string): TimestampResult {
  if (!input.trim()) return { success: false, error: "Date and time are empty." };
  return fromDate(new Date(input));
}
