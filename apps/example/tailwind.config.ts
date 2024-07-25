import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class", '[data-theme^="dark-"]'],
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)"
        }
      }
    }
  },
  plugins: []
}
export default config
