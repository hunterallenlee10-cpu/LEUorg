/**
 * The light/dark theme switch. Dark is the default and the site as it was
 * built; light is "Daylight & Navy". The choice is a `data-theme` attribute
 * on <html>, which app/globals.css reads, and it is remembered per browser in
 * localStorage.
 */
export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";
export const DEFAULT_THEME: Theme = "dark";

/** The browser bar colour for each theme (the `theme-color` meta). */
export const THEME_COLORS: Record<Theme, string> = {
  dark: "#000000",
  light: "#F9FBFC",
};

export function isTheme(value: unknown): value is Theme {
  return value === "light" || value === "dark";
}

/** The saved choice, or null when there is none or storage is blocked. */
export function readSavedTheme(): Theme | null {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(saved) ? saved : null;
  } catch {
    return null;
  }
}

/** Puts a theme on the page and on the browser bar. Does not save it. */
export function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", THEME_COLORS[theme]);
}

/**
 * Runs inline in <head>, before the first paint, so a visitor who picked
 * light never sees the dark page flash first. Kept tiny and dependency-free:
 * it is a string, not a module.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY
)});if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;
