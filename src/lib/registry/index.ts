export * from "./types";
export * from "./categories";
export * from "./tools";

import { Tool, ToolCategory, CategoryMeta } from "./types";
import { TOOLS, TOOLS_BY_SLUG, TOOLS_BY_ID } from "./tools";
import { CATEGORIES, CATEGORY_LIST } from "./categories";

export function getAllTools(): Tool[] {
  return TOOLS;
}

export function getToolBySlug(slug: string): Tool | undefined {
  return TOOLS_BY_SLUG[slug];
}

export function getToolById(id: string): Tool | undefined {
  return TOOLS_BY_ID[id];
}

export function getToolsByCategory(category: ToolCategory): Tool[] {
  return TOOLS.filter((tool) => tool.category === category);
}

export function getRelatedTools(toolId: string, limit = 4): Tool[] {
  const tool = getToolById(toolId);
  if (!tool) return [];

  if (tool.relatedToolIds && tool.relatedToolIds.length > 0) {
    const directRelated = tool.relatedToolIds
      .map((id) => getToolById(id))
      .filter((t): t is Tool => Boolean(t));
    if (directRelated.length >= limit) {
      return directRelated.slice(0, limit);
    }
  }

  // Fallback to tools from same category
  const fallback = TOOLS.filter(
    (t) => t.category === tool.category && t.id !== tool.id
  ).slice(0, limit);

  return fallback;
}

export function searchTools(query: string): Tool[] {
  if (!query || query.trim() === "") {
    return TOOLS;
  }

  const cleanQuery = query.toLowerCase().trim();
  const queryTokens = cleanQuery.split(/\s+/);

  return TOOLS.filter((tool) => {
    const titleMatch = tool.name.toLowerCase().includes(cleanQuery);
    const slugMatch = tool.slug.toLowerCase().includes(cleanQuery);
    const categoryMatch = tool.category.toLowerCase().includes(cleanQuery);
    const descMatch = tool.shortDescription.toLowerCase().includes(cleanQuery);
    const keywordMatch = tool.keywords.some((k) =>
      queryTokens.every((token) => k.toLowerCase().includes(token))
    );

    return titleMatch || slugMatch || categoryMatch || descMatch || keywordMatch;
  });
}

export function getPopularTools(): Tool[] {
  // Return the representative launch tools + popular utilities
  const popularSlugs = [
    "word-counter",
    "json-formatter",
    "uuid-generator",
    "base64-encoder",
    "regex-tester",
    "character-counter",
    "json-validator",
    "unix-timestamp-converter",
  ];
  return popularSlugs
    .map((slug) => getToolBySlug(slug))
    .filter((t): t is Tool => Boolean(t));
}

export function getAllCategories(): CategoryMeta[] {
  return CATEGORY_LIST;
}

export function getCategoryBySlug(slug: string): CategoryMeta | undefined {
  return CATEGORIES[slug as ToolCategory];
}
