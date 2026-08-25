export const APPEARANCE_STORAGE_KEYS = {
  palette: "devbite-palette",
  fontFamily: "devbite-font-family",
  fontSize: "devbite-font-size",
} as const;

export const COLOR_PALETTES = [
  {
    id: "indigo",
    label: "DevBite Indigo",
    description: "The original indigo and cyan DevBite palette.",
    preview: "#6366f1",
    variables: {
      "--primary": "239 84% 67%",
      "--ring": "239 84% 67%",
      "--primary-rgb": "99 102 241",
      "--theme-secondary-rgb": "6 182 212",
    },
  },
  {
    id: "ocean",
    label: "Ocean Blue",
    description: "A clear blue and azure developer palette.",
    preview: "#0ea5e9",
    variables: {
      "--primary": "199 89% 48%",
      "--ring": "199 89% 48%",
      "--primary-rgb": "14 165 233",
      "--theme-secondary-rgb": "59 130 246",
    },
  },
  {
    id: "emerald",
    label: "Emerald",
    description: "A calm emerald and teal developer palette.",
    preview: "#10b981",
    variables: {
      "--primary": "160 84% 39%",
      "--ring": "160 84% 39%",
      "--primary-rgb": "16 185 129",
      "--theme-secondary-rgb": "20 184 166",
    },
  },
] as const;

export const FONT_FAMILIES = [
  {
    id: "system",
    label: "System Sans",
    description: "Clean platform-native interface font.",
    value: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  {
    id: "humanist",
    label: "Humanist Sans",
    description: "Friendly, highly readable sans-serif stack.",
    value: '"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  {
    id: "serif",
    label: "Classic Serif",
    description: "A traditional reading-focused serif stack.",
    value: 'Georgia, Cambria, "Times New Roman", Times, serif',
  },
] as const;

export const FONT_SIZES = [
  { id: "compact", label: "Compact", description: "More content on screen.", value: "15px" },
  { id: "default", label: "Default", description: "The original DevBite scale.", value: "16px" },
  { id: "comfortable", label: "Comfortable", description: "Larger text for easier reading.", value: "18px" },
] as const;

export type PaletteId = (typeof COLOR_PALETTES)[number]["id"];
export type FontFamilyId = (typeof FONT_FAMILIES)[number]["id"];
export type FontSizeId = (typeof FONT_SIZES)[number]["id"];

export interface AppearancePreferences {
  palette: PaletteId;
  fontFamily: FontFamilyId;
  fontSize: FontSizeId;
}

export const DEFAULT_APPEARANCE: AppearancePreferences = {
  palette: "indigo",
  fontFamily: "system",
  fontSize: "default",
};

export const CODE_FONT_FAMILY = '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace';

export function applyAppearancePreferences(
  element: HTMLElement,
  preferences: AppearancePreferences
): void {
  const palette = COLOR_PALETTES.find((option) => option.id === preferences.palette) ?? COLOR_PALETTES[0];
  const font = FONT_FAMILIES.find((option) => option.id === preferences.fontFamily) ?? FONT_FAMILIES[0];
  const size = FONT_SIZES.find((option) => option.id === preferences.fontSize) ?? FONT_SIZES[1];

  element.dataset.palette = palette.id;
  element.dataset.fontFamily = font.id;
  element.dataset.fontSize = size.id;
  Object.entries(palette.variables).forEach(([property, value]) => element.style.setProperty(property, value));
  element.style.setProperty("--font-sans", font.value);
  element.style.setProperty("--font-mono", CODE_FONT_FAMILY);
  element.style.setProperty("--base-font-size", size.value);
}

export function getAppearanceBootstrapScript(): string {
  const configuration = JSON.stringify({
    storage: APPEARANCE_STORAGE_KEYS,
    palettes: Object.fromEntries(COLOR_PALETTES.map((option) => [option.id, option.variables])),
    fonts: Object.fromEntries(FONT_FAMILIES.map((option) => [option.id, option.value])),
    sizes: Object.fromEntries(FONT_SIZES.map((option) => [option.id, option.value])),
    defaults: DEFAULT_APPEARANCE,
    codeFont: CODE_FONT_FAMILY,
  });

  return `(()=>{try{const c=${configuration};const r=document.documentElement;const read=(k,d,o)=>{const v=localStorage.getItem(k);return v&&Object.prototype.hasOwnProperty.call(o,v)?v:d};const p=read(c.storage.palette,c.defaults.palette,c.palettes);const f=read(c.storage.fontFamily,c.defaults.fontFamily,c.fonts);const s=read(c.storage.fontSize,c.defaults.fontSize,c.sizes);r.dataset.palette=p;r.dataset.fontFamily=f;r.dataset.fontSize=s;Object.entries(c.palettes[p]).forEach(([k,v])=>r.style.setProperty(k,v));r.style.setProperty('--font-sans',c.fonts[f]);r.style.setProperty('--font-mono',c.codeFont);r.style.setProperty('--base-font-size',c.sizes[s])}catch{}})();`;
}
