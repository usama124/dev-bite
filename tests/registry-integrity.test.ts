import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { CATEGORY_LIST, TOOLS } from "../src/lib/registry";

describe("tool registry integrity", () => {
  it("contains 48 Phase 1 and 57 Phase 2 tools with unique addresses", () => {
    expect(TOOLS).toHaveLength(105);
    expect(new Set(TOOLS.map((tool) => tool.id)).size).toBe(105);
    expect(new Set(TOOLS.map((tool) => tool.slug)).size).toBe(105);
    TOOLS.forEach((tool) => expect(tool.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/));
  });

  it("matches category totals", () => {
    CATEGORY_LIST.forEach((category) => {
      expect(TOOLS.filter((tool) => tool.category === category.id)).toHaveLength(category.totalTools);
    });
  });

  it("provides complete SEO and product metadata for every tool", () => {
    TOOLS.forEach((tool) => {
      expect(tool.name.trim()).not.toBe("");
      expect(tool.description.trim()).not.toBe("");
      expect(tool.seoTitle.trim()).not.toBe("");
      expect(tool.seoDescription.trim()).not.toBe("");
      expect(tool.keywords.length).toBeGreaterThan(0);
      expect(tool.faqs.length).toBeGreaterThan(0);
      expect(tool.examples.length).toBeGreaterThan(0);
      expect(tool.howToUse?.length).toBeGreaterThan(0);
      expect(tool.clientSide).toBe(true);
      expect(tool.status).toBe("active");
    });
  });

  it("references only existing related tools and never itself", () => {
    const ids = new Set(TOOLS.map((tool) => tool.id));
    TOOLS.forEach((tool) => {
      expect(tool.relatedToolIds).not.toContain(tool.id);
      tool.relatedToolIds.forEach((id) => expect(ids.has(id), `${tool.id} references missing ${id}`).toBe(true));
    });
  });

  it("wires every active tool slug to an interactive renderer case", () => {
    const renderer = readFileSync(new URL("../src/components/tools/ToolRenderer.tsx", import.meta.url), "utf8");
    TOOLS.forEach((tool) => expect(renderer, `${tool.slug} is not wired`).toContain(`case "${tool.slug}"`));
  });
});
