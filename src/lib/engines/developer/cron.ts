export interface CronField {
  name: string;
  value: string;
  allowed: string;
}

export interface CronDescriptionResult {
  success: boolean;
  description?: string;
  fields?: CronField[];
  error?: string;
}

const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function validatePart(part: string, min: number, max: number, aliases: Record<string, number> = {}): boolean {
  const normalized = part.toUpperCase();
  const parseValue = (value: string) => aliases[value] ?? Number(value);
  const [rangePart, stepPart] = normalized.split("/");
  if (stepPart !== undefined && (!/^\d+$/.test(stepPart) || Number(stepPart) < 1)) return false;
  if (rangePart === "*") return true;
  return rangePart.split(",").every((item) => {
    const [startText, endText] = item.split("-");
    const start = parseValue(startText);
    const end = endText === undefined ? start : parseValue(endText);
    return Number.isInteger(start) && Number.isInteger(end) && start >= min && end <= max && start <= end;
  });
}

function describeList(value: string, names?: string[]): string {
  return value.split(",").map((part) => {
    const number = Number(part);
    return names?.[number] ?? part;
  }).join(", ");
}

export function describeCron(expression: string, includeSeconds = false): CronDescriptionResult {
  const values = expression.trim().split(/\s+/).filter(Boolean);
  const expected = includeSeconds ? 6 : 5;
  if (values.length !== expected) {
    return { success: false, error: `Expected ${expected} cron fields but received ${values.length}.` };
  }

  const [second, minute, hour, day, month, weekday] = includeSeconds
    ? values
    : ["0", ...values];
  const monthAliases = Object.fromEntries(MONTH_NAMES.map((name, index) => [name.slice(0, 3).toUpperCase(), index + 1]));
  const dayAliases = Object.fromEntries(DAY_NAMES.map((name, index) => [name.slice(0, 3).toUpperCase(), index]));
  const checks: Array<[string, number, number, Record<string, number>?]> = [
    [second, 0, 59], [minute, 0, 59], [hour, 0, 23], [day, 1, 31],
    [month, 1, 12, monthAliases], [weekday, 0, 7, dayAliases],
  ];
  if (!checks.every(([value, min, max, aliases]) => validatePart(value, min, max, aliases))) {
    return { success: false, error: "One or more cron fields contain an unsupported value or range." };
  }

  let description: string;
  if (minute.startsWith("*/") && hour === "*" && day === "*" && month === "*" && weekday === "*") {
    description = `Every ${minute.slice(2)} minutes`;
  } else if (hour.startsWith("*/") && minute === "0" && day === "*" && month === "*" && weekday === "*") {
    description = `Every ${hour.slice(2)} hours`;
  } else {
    const time = `${hour === "*" ? "every hour" : hour.padStart(2, "0")}:${minute === "*" ? "every minute" : minute.padStart(2, "0")}${includeSeconds ? `:${second.padStart(2, "0")}` : ""}`;
    if (day === "*" && month === "*" && weekday === "1-5") description = `Every weekday at ${time}`;
    else if (day === "*" && month === "*" && weekday !== "*") description = `At ${time} on ${describeList(weekday, DAY_NAMES)}`;
    else if (day !== "*" && month === "*" && weekday === "*") description = `At ${time} on day ${day} of every month`;
    else if (day === "*" && month === "*" && weekday === "*") description = hour === "*" || minute === "*" ? `At ${time}` : `Every day at ${time}`;
    else description = `At ${time}, when day is ${day}, month is ${month}, and weekday is ${weekday}`;
  }

  const ordered = includeSeconds
    ? [["Second", second, "0–59"], ["Minute", minute, "0–59"], ["Hour", hour, "0–23"], ["Day", day, "1–31"], ["Month", month, "1–12 or JAN–DEC"], ["Weekday", weekday, "0–7 or SUN–SAT"]]
    : [["Minute", minute, "0–59"], ["Hour", hour, "0–23"], ["Day", day, "1–31"], ["Month", month, "1–12 or JAN–DEC"], ["Weekday", weekday, "0–7 or SUN–SAT"]];
  return { success: true, description, fields: ordered.map(([name, value, allowed]) => ({ name, value, allowed })) };
}
