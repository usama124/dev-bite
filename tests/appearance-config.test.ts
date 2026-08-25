import { describe, expect, it } from "vitest";
import {
  APPEARANCE_STORAGE_KEYS,
  COLOR_PALETTES,
  DEFAULT_APPEARANCE,
  FONT_FAMILIES,
  FONT_SIZES,
  getAppearanceBootstrapScript,
} from "@/config/appearance";

describe("appearance configuration", () => {
  it("provides three unique choices for each configurable preference", () => {
    for (const options of [COLOR_PALETTES, FONT_FAMILIES, FONT_SIZES]) {
      expect(options).toHaveLength(3);
      expect(new Set(options.map((option) => option.id)).size).toBe(options.length);
    }
  });

  it("keeps every default linked to a configured option", () => {
    expect(COLOR_PALETTES.some((option) => option.id === DEFAULT_APPEARANCE.palette)).toBe(true);
    expect(FONT_FAMILIES.some((option) => option.id === DEFAULT_APPEARANCE.fontFamily)).toBe(true);
    expect(FONT_SIZES.some((option) => option.id === DEFAULT_APPEARANCE.fontSize)).toBe(true);
  });

  it("includes all persistence keys in the pre-paint bootstrap", () => {
    const script = getAppearanceBootstrapScript();

    expect(script).toContain(APPEARANCE_STORAGE_KEYS.palette);
    expect(script).toContain(APPEARANCE_STORAGE_KEYS.fontFamily);
    expect(script).toContain(APPEARANCE_STORAGE_KEYS.fontSize);
    expect(script).toContain("--base-font-size");
  });
});
