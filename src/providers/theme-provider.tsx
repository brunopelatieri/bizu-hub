import type { ReactNode } from "react";

/** Pass-through — tema fixo em dark via class="dark" no <html>. */
export function ThemeProvider({ children }: { children: ReactNode }) {
  return children;
}

export function useResolvedTheme(): "dark" {
  return "dark";
}
