"use client";

import { usePostHog } from "@huddle/posthog/client";
import {
  ThemeProvider,
  useTheme as useNextTheme,
} from "@huddle/ui/theme-provider";
import React from "react";

export const useTheme = () => {
  const { theme, setTheme } = useNextTheme();

  const posthog = usePostHog();

  return React.useMemo(
    () => ({
      theme,
      setTheme: (theme: string) => {
        setTheme(theme);
        posthog?.capture("theme_change", { theme });
      },
    }),
    [theme, setTheme, posthog],
  );
};

export { ThemeProvider };
