import "./globals.css"
import { ThemeProvider } from "../components/ThemeProvider"
import { PropsWithChildren } from "react"

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white dark:bg-black min-h-[100dvh]" suppressHydrationWarning>
        <ThemeProvider
          defaultTheme="light"
          enableColorScheme
          themes={["light", "dark-classic", "tangerine", "dark-tangerine", "mint", "dark-mint"]}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
