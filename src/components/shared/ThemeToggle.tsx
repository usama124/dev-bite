"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Check, Monitor, Moon, Palette, RotateCcw, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import {
  COLOR_PALETTES,
  FONT_FAMILIES,
  FONT_SIZES,
  FontFamilyId,
} from "@/config/appearance";
import { useAppearance } from "./AppearanceProvider";

const COLOR_MODES = [
  { id: "system", label: "System", icon: Monitor },
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
] as const;

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const appearance = useAppearance();
  const [mounted, setMounted] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-lg"
        aria-label="Appearance settings"
      >
        <Palette className="h-4 w-4 text-muted-foreground" />
      </Button>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen((value) => !value)}
        className="h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground"
        title="Appearance settings"
        aria-label="Appearance settings"
        aria-haspopup="dialog"
        aria-controls="appearance-settings"
        aria-expanded={open}
      >
        <Palette className="h-4 w-4" />
      </Button>

      {open && (
        <div
          id="appearance-settings"
          role="dialog"
          aria-label="Appearance settings"
          className="absolute right-0 top-11 z-50 w-[min(22rem,calc(100vw-2rem))] space-y-5 rounded-2xl border border-border/80 bg-popover/95 p-4 text-popover-foreground shadow-xl backdrop-blur-xl animate-fade-in"
        >
          <div>
            <h2 className="text-sm font-bold">Appearance</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Saved automatically on this device.
            </p>
          </div>

          <fieldset className="space-y-2">
            <legend className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Color mode</legend>
            <div className="grid grid-cols-3 gap-2">
              {COLOR_MODES.map((option) => {
                const Icon = option.icon;
                const selected = theme === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setTheme(option.id)}
                    aria-pressed={selected}
                    className={`flex items-center justify-center gap-1.5 rounded-lg border px-2 py-2 text-xs font-medium transition-colors ${selected ? "border-primary bg-primary/10 text-primary" : "border-border/70 bg-background/50 text-muted-foreground hover:text-foreground"}`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {option.label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="space-y-2">
            <legend className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Color palette</legend>
            <div className="grid grid-cols-3 gap-2">
              {COLOR_PALETTES.map((option) => {
                const selected = appearance.palette === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => appearance.setPalette(option.id)}
                    aria-pressed={selected}
                    title={option.description}
                    className={`relative flex flex-col items-center gap-1.5 rounded-lg border px-2 py-2 text-[11px] font-medium transition-colors ${selected ? "border-primary bg-primary/10 text-foreground" : "border-border/70 bg-background/50 text-muted-foreground hover:text-foreground"}`}
                  >
                    <span
                      className="h-4 w-4 rounded-full border border-white/50 shadow-sm"
                      style={{ backgroundColor: option.preview }}
                    />
                    <span>{option.label.replace("DevBite ", "")}</span>
                    {selected && (
                      <Check className="absolute right-1 top-1 h-3 w-3 text-primary" />
                    )}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="space-y-2">
            <label
              htmlFor="appearance-font"
              className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Font family
            </label>
            <Select
              id="appearance-font"
              value={appearance.fontFamily}
              onChange={(event) =>
                appearance.setFontFamily(event.target.value as FontFamilyId)
              }
            >
              {FONT_FAMILIES.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          <fieldset className="space-y-2">
            <legend className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Font size</legend>
            <div className="grid grid-cols-3 gap-2">
              {FONT_SIZES.map((option) => {
                const selected = appearance.fontSize === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => appearance.setFontSize(option.id)}
                    aria-pressed={selected}
                    title={option.description}
                    className={`rounded-lg border px-2 py-2 text-xs font-medium transition-colors ${selected ? "border-primary bg-primary/10 text-primary" : "border-border/70 bg-background/50 text-muted-foreground hover:text-foreground"}`}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={appearance.resetAppearance}
          >
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
            Reset appearance defaults
          </Button>
        </div>
      )}
    </div>
  );
}
