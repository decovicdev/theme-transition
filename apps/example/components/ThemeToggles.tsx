"use client"

import { useEffect, useState } from "react"

import { useThemeTransition } from "@themetransition/react"

const themeMapping: Record<string, string> = {
  light: "Default",
  "dark-classic": "Dark",
  tangerine: "Tangerine",
  "dark-tangerine": "Tangerine (dark)",
  mint: "Mint",
  "dark-mint": "Mint (dark)"
}

export default function ThemeToggles() {
  const { theme, handleThemeChange } = useThemeTransition()

  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  return (
    <>
      <div>
        <div className="mt-16 grid grid-cols-3 grid-rows-2 grid-flow-col gap-4">
          {Object.entries(themeMapping).map(([key, value]) => (
            <button
              key={key}
              className={`px-4 py-2 font-semibold rounded-md transition-colors duration-200 ${
                // The theme is only available after the component is mounted.
                mounted && theme == key
                  ? "border border-primary bg-primary-foreground text-primary"
                  : "bg-primary text-primary-foreground"
              }`}
              onClick={handleThemeChange(key)}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}
