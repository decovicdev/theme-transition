"use client"

import { ThemeProvider as NextThemesProvider } from "next-themes"
import { ThemeTransitionProvider } from "@repo/react"

type ThemeProviderProps = Parameters<typeof NextThemesProvider>[0]

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <ThemeTransitionProvider>{children}</ThemeTransitionProvider>
    </NextThemesProvider>
  )
}
