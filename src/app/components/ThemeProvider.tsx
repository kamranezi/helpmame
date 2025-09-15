'use client';

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// Get the props type from the component itself
type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>;

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
