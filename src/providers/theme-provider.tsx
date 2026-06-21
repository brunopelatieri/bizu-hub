import { useEffect, useState, type ReactNode } from "react";
import { resolveTheme } from "@/lib/theme";
import { useThemeStore } from "@/stores/theme-store";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    if (theme !== "system") {
      return;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => {
      document.documentElement.classList.toggle("dark", media.matches);
    };

    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [theme]);

  return children;
}

export function useResolvedTheme(): "light" | "dark" {
  const theme = useThemeStore((state) => state.theme);
  const [resolved, setResolved] = useState<"light" | "dark">(() =>
    resolveTheme(theme),
  );

  useEffect(() => {
    setResolved(resolveTheme(theme));

    if (theme !== "system") {
      return;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => setResolved(media.matches ? "dark" : "light");

    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [theme]);

  return resolved;
}
