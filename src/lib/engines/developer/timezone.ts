export interface TimezoneConversionResult {
  success: boolean;
  instant?: Date;
  source?: string;
  target?: string;
  iso?: string;
  error?: string;
}

const FALLBACK_TIMEZONES = [
  "UTC", "America/Los_Angeles", "America/Denver", "America/Chicago", "America/New_York",
  "America/Sao_Paulo", "Europe/London", "Europe/Paris", "Europe/Berlin", "Africa/Cairo",
  "Asia/Dubai", "Asia/Karachi", "Asia/Kolkata", "Asia/Singapore", "Asia/Shanghai",
  "Asia/Tokyo", "Australia/Sydney", "Pacific/Auckland",
];

export function getSupportedTimezones(): string[] {
  try {
    if (typeof Intl.supportedValuesOf === "function") {
      return ["UTC", ...Intl.supportedValuesOf("timeZone").filter((zone) => zone !== "UTC")];
    }
  } catch {
    // Older browsers use the maintained fallback list below.
  }
  return FALLBACK_TIMEZONES;
}

function datePartsInZone(date: Date, timeZone: string): Record<string, number> {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  return Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, Number(part.value)]));
}

function formatZoned(date: Date, timeZone: string, hour12: boolean, includeSeconds: boolean): string {
  return new Intl.DateTimeFormat(undefined, {
    timeZone,
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: includeSeconds ? "2-digit" : undefined,
    hour12,
    timeZoneName: "short",
  }).format(date);
}

export function zonedDateTimeToInstant(input: string, timeZone: string): Date {
  const match = input.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/);
  if (!match) throw new Error("Use the date and time format YYYY-MM-DDTHH:mm.");
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  const second = match[6] === undefined ? 0 : Number(match[6]);
  const wallTime = Date.UTC(year, month - 1, day, hour, minute, second);
  if (new Date(wallTime).getUTCFullYear() !== year || new Date(wallTime).getUTCMonth() !== month - 1) {
    throw new Error("Date and time are invalid.");
  }

  let candidate = wallTime;
  for (let iteration = 0; iteration < 3; iteration++) {
    const parts = datePartsInZone(new Date(candidate), timeZone);
    const displayed = Date.UTC(parts.year, parts.month - 1, parts.day, parts.hour, parts.minute, parts.second);
    candidate += wallTime - displayed;
  }

  const roundTrip = datePartsInZone(new Date(candidate), timeZone);
  if (
    roundTrip.year !== year || roundTrip.month !== month || roundTrip.day !== day ||
    roundTrip.hour !== hour || roundTrip.minute !== minute || roundTrip.second !== second
  ) {
    throw new Error("This local time does not exist in the source timezone, usually because of a daylight-saving transition.");
  }
  return new Date(candidate);
}

export function convertTimezone(
  input: string,
  sourceZone: string,
  targetZone: string,
  options: { hour12?: boolean; includeSeconds?: boolean } = {}
): TimezoneConversionResult {
  try {
    const instant = zonedDateTimeToInstant(input, sourceZone);
    const { hour12 = false, includeSeconds = false } = options;
    return {
      success: true,
      instant,
      source: formatZoned(instant, sourceZone, hour12, includeSeconds),
      target: formatZoned(instant, targetZone, hour12, includeSeconds),
      iso: instant.toISOString(),
    };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}
