export type Theme = "light" | "dark" | "system";

export const THEME_STORAGE_KEY = "theme-storage";

export function resolveTheme(theme: Theme): "light" | "dark" {
  if (theme === "system") {
    if (typeof window === "undefined") {
      return "light";
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  return theme;
}

export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.classList.toggle(
    "dark",
    resolveTheme(theme) === "dark",
  );
}

/** Script inline para evitar flash de tema errado antes da hidratação. */
export const themeInitScript = `(function(){try{var raw=localStorage.getItem("${THEME_STORAGE_KEY}");var theme=raw?JSON.parse(raw).state.theme:"system";var dark=theme==="dark"||(theme==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",dark);}catch(e){}})();`;
