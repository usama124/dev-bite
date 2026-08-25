import { CategoryMeta, ToolCategory } from "./types";

export const CATEGORIES: Record<ToolCategory, CategoryMeta> = {
  text: {
    id: "text",
    name: "Text Utilities",
    slug: "text",
    description: "Format, analyze, clean, transform, count and manipulate plain text strings and multiline content.",
    iconName: "Type",
    accentColor: "from-blue-500/20 to-cyan-500/20",
    badgeBg: "bg-blue-500/10 dark:bg-blue-500/15",
    badgeBorder: "border-blue-500/30",
    badgeText: "text-blue-600 dark:text-blue-400",
    totalTools: 12,
  },
  json: {
    id: "json",
    name: "JSON Tools",
    slug: "json",
    description: "Format, validate, minify, inspect, sort, flatten, diff, query and convert JSON and CSV data.",
    iconName: "Braces",
    accentColor: "from-amber-500/20 to-yellow-500/20",
    badgeBg: "bg-amber-500/10 dark:bg-amber-500/15",
    badgeBorder: "border-amber-500/30",
    badgeText: "text-amber-600 dark:text-amber-400",
    totalTools: 14,
  },
  developer: {
    id: "developer",
    name: "Developer Utilities",
    slug: "developer",
    description: "Cryptographically strong UUIDs, random IDs, regex testers, timestamps, timezone converters, URL and cron analyzers.",
    iconName: "Code2",
    accentColor: "from-indigo-500/20 to-violet-500/20",
    badgeBg: "bg-indigo-500/10 dark:bg-indigo-500/15",
    badgeBorder: "border-indigo-500/30",
    badgeText: "text-indigo-600 dark:text-indigo-400",
    totalTools: 12,
  },
  encoding: {
    id: "encoding",
    name: "Encoding & Decoding",
    slug: "encoding",
    description: "Encode and decode Base64, Base64URL, URL components, HTML entities and Hexadecimal data securely in your browser.",
    iconName: "Binary",
    accentColor: "from-emerald-500/20 to-teal-500/20",
    badgeBg: "bg-emerald-500/10 dark:bg-emerald-500/15",
    badgeBorder: "border-emerald-500/30",
    badgeText: "text-emerald-600 dark:text-emerald-400",
    totalTools: 10,
  },
};

export const CATEGORY_LIST: CategoryMeta[] = Object.values(CATEGORIES);
