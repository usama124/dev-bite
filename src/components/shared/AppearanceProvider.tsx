"use client";

import * as React from "react";
import {
  APPEARANCE_STORAGE_KEYS,
  AppearancePreferences,
  applyAppearancePreferences,
  COLOR_PALETTES,
  DEFAULT_APPEARANCE,
  FONT_FAMILIES,
  FONT_SIZES,
  FontFamilyId,
  FontSizeId,
  PaletteId,
} from "@/config/appearance";

interface AppearanceContextValue extends AppearancePreferences {
  setPalette: (palette: PaletteId) => void;
  setFontFamily: (fontFamily: FontFamilyId) => void;
  setFontSize: (fontSize: FontSizeId) => void;
  resetAppearance: () => void;
}

const AppearanceContext = React.createContext<AppearanceContextValue | undefined>(undefined);

function isPalette(value: string | null): value is PaletteId {
  return COLOR_PALETTES.some((option) => option.id === value);
}

function isFontFamily(value: string | null): value is FontFamilyId {
  return FONT_FAMILIES.some((option) => option.id === value);
}

function isFontSize(value: string | null): value is FontSizeId {
  return FONT_SIZES.some((option) => option.id === value);
}

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = React.useState<AppearancePreferences>(DEFAULT_APPEARANCE);

  React.useEffect(() => {
    const storedPalette = localStorage.getItem(APPEARANCE_STORAGE_KEYS.palette);
    const storedFont = localStorage.getItem(APPEARANCE_STORAGE_KEYS.fontFamily);
    const storedSize = localStorage.getItem(APPEARANCE_STORAGE_KEYS.fontSize);
    const storedPreferences: AppearancePreferences = {
      palette: isPalette(storedPalette) ? storedPalette : DEFAULT_APPEARANCE.palette,
      fontFamily: isFontFamily(storedFont) ? storedFont : DEFAULT_APPEARANCE.fontFamily,
      fontSize: isFontSize(storedSize) ? storedSize : DEFAULT_APPEARANCE.fontSize,
    };
    applyAppearancePreferences(document.documentElement, storedPreferences);
    setPreferences(storedPreferences);
  }, []);

  const update = React.useCallback((next: AppearancePreferences) => {
    localStorage.setItem(APPEARANCE_STORAGE_KEYS.palette, next.palette);
    localStorage.setItem(APPEARANCE_STORAGE_KEYS.fontFamily, next.fontFamily);
    localStorage.setItem(APPEARANCE_STORAGE_KEYS.fontSize, next.fontSize);
    applyAppearancePreferences(document.documentElement, next);
    setPreferences(next);
  }, []);

  const value = React.useMemo<AppearanceContextValue>(() => ({
    ...preferences,
    setPalette: (palette) => update({ ...preferences, palette }),
    setFontFamily: (fontFamily) => update({ ...preferences, fontFamily }),
    setFontSize: (fontSize) => update({ ...preferences, fontSize }),
    resetAppearance: () => update(DEFAULT_APPEARANCE),
  }), [preferences, update]);

  return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>;
}

export function useAppearance(): AppearanceContextValue {
  const context = React.useContext(AppearanceContext);
  if (!context) throw new Error("useAppearance must be used inside AppearanceProvider.");
  return context;
}
