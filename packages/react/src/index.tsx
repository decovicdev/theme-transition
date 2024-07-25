import {
  PropsWithChildren,
  createContext,
  useContext,
  RefObject,
  useState,
  useMemo,
  useId,
  useRef
} from "react"
import { useMotionValue, useTransform, animate, motion, mix } from "framer-motion"
import { UseThemeProps } from "next-themes/dist/types"
import { createPortal, flushSync } from "react-dom"
import { toJpeg } from "html-to-image"
import { useTheme } from "next-themes"

import useWindowSize from "./hooks/useWindowSize"
import useIsMounted from "./hooks/useIsMounted"

export type ThemeTransitionContextType = {
  handleThemeChange: any
  ref: RefObject<HTMLElement>
} & Omit<UseThemeProps, "setTheme">

const ThemeTransitionContext = createContext<ThemeTransitionContextType | null>(null)

const style = {
  position: "absolute",
  pointerEvents: "none",
  zIndex: 1000,
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh"
} as const

export function useThemeTransition() {
  const themeTransition = useContext(ThemeTransitionContext)

  if (!themeTransition) {
    throw new Error("useThemeTransition must be used within a ThemeTransitionProvider")
  }

  return themeTransition
}

type ThemeTransitionProps = PropsWithChildren<{
  duration?: number
}>

export function ThemeTransitionProvider(props: ThemeTransitionProps) {
  const { children, duration = 0.95 } = props

  const { setTheme, themes, forcedTheme, resolvedTheme, systemTheme, theme } = useTheme()

  const ref = useRef<HTMLElement>(null)

  const svgId = useId()
  const isMounted = useIsMounted()
  const windowSize = useWindowSize()

  const [img, setImg] = useState<string | null>(null)

  const transition = useMotionValue(0)
  const circle = useMotionValue({ x: 0, y: 0, r: 0 })

  const corners = useMemo(
    () =>
      [
        [0, 0],
        [windowSize.width, 0],
        [windowSize.width, windowSize.height],
        [0, windowSize.height]
      ] as const,
    [windowSize]
  )

  const r = useTransform(() => mix(0, circle.get().r)(transition.get()))

  function handleThemeChange(key: string) {
    return async (e: MouseEvent) => {
      if (theme === key || transition.isAnimating()) return

      const x = e.clientX
      const y = e.clientY

      const node = ref.current || document.body

      circle.set({
        x,
        y,
        r: Math.max(...corners.map(corner => Math.hypot(corner[0] - x, corner[1] - y)))
      })

      transition.set(0)

      const jpeg = await toJpeg(node, {
        filter(domNode) {
          return domNode.id !== svgId
        }
      })

      flushSync(() => {
        setImg(jpeg)
        setTheme(key)
      })

      animate(transition, 1, {
        duration,
        onComplete() {
          setImg(null)
        }
      })
    }
  }

  return (
    <ThemeTransitionContext.Provider
      value={{
        ref,
        handleThemeChange,
        resolvedTheme,
        systemTheme,
        forcedTheme,
        themes,
        theme
      }}
    >
      {isMounted.current &&
        createPortal(
          <svg id={svgId} style={style}>
            <mask id="myMask">
              <motion.circle
                fill="white"
                r={circle.get().r}
                cx={circle.get().x}
                cy={circle.get().y}
              />

              <motion.circle r={r} fill="black" cx={circle.get().x} cy={circle.get().y} />
            </mask>

            {img && (
              <motion.image
                mask="url(#myMask)"
                href={img}
                x={0}
                y={0}
                height={windowSize.height}
                width={windowSize.width}
              />
            )}
          </svg>,
          document.body
        )}

      {children}
    </ThemeTransitionContext.Provider>
  )
}
