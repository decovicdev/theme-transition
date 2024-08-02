# @themetransition/react ![npm bundle size](https://img.shields.io/bundlephobia/minzip/%40themetransition%2Freact) ![NPM Version](https://img.shields.io/npm/v/%40themetransition%2Freact)

Check out the [Live Example](https://theme-transition-example.vercel.app/) to try it for yourself.

## Install

```bash
$ npm install @themetransition/react
# or
$ yarn add @themetransition/react
```

## Usage

```jsx
import { ThemeTransitionProvider } from "@themetransition/react"

function MyApp({ children }) {
  return (
    <html>
      <head />
      <body>
        <ThemeTransitionProvider duration={0.9}>{children}</ThemeTransitionProvider>
      </body>
    </html>
  )
}

export default MyApp
```

### useThemeTransition

Your UI will need to know the current theme and be able to change it. The `useTheme` hook provides theme information:

```jsx
import { useTheme } from "next-themes"
import { useThemeTransition } from "@themetransition/react"

const ThemeChanger = () => {
  const { theme, setTheme } = useTheme()

  const { handleThemeChange } = useThemeTransition({
    setTheme,
    theme
  })

  return (
    <div>
      The current theme is: {theme}
      <button onClick={handleThemeChange("light")}>Light Mode</button>
      <button onClick={handleThemeChange("dark")}>Dark Mode</button>
    </div>
  )
}
```
