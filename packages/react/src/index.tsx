"use client"

import { useMotionValue, useTransform, animate, motion, mix } from "framer-motion"
import { createPortal, flushSync } from "react-dom"
import { toJpeg } from "html-to-image"
import React from "react"

import useWindowSize from "./hooks/useWindowSize"
import useIsMounted from "./hooks/useIsMounted"

type HandleThemeChange = (
  key: string
) => <T extends React.MouseEvent<any> | { x: number; y: number }>(e: T) => Promise<void>

export type ThemeTransitionContextType = {
  themeRef: React.MutableRefObject<UseThemeTransition | undefined>
  handleThemeChange: HandleThemeChange
  ref: React.RefObject<HTMLElement>
}

const ThemeTransitionContext = React.createContext<ThemeTransitionContextType | null>(null)

const style = {
  position: "absolute",
  pointerEvents: "none",
  zIndex: 1000,
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh"
} as const

export type UseThemeTransition = {
  setTheme: (key: string) => void
  theme: string | undefined
}

export function useThemeTransition(options: UseThemeTransition) {
  const themeTransition = React.useContext(ThemeTransitionContext)

  if (!themeTransition) {
    throw new Error("useThemeTransition must be used within a ThemeTransitionProvider")
  }

  if (!("setTheme" in options)) {
    throw new Error("you must pass a setTheme function to useThemeTransition")
  }

  if (!themeTransition.themeRef.current) {
    themeTransition.themeRef.current = options
  }

  return {
    handleThemeChange: themeTransition.handleThemeChange,
    ref: themeTransition.ref
  }
}

type ThemeTransitionProps = React.PropsWithChildren<{
  duration?: number
}>

export function ThemeTransitionProvider(props: ThemeTransitionProps) {
  const { children, duration = 0.95 } = props

  const ref = React.useRef<HTMLElement>(null)
  const themeRef = React.useRef<UseThemeTransition>()

  const svgId = React.useId()
  const isMounted = useIsMounted()
  const windowSize = useWindowSize()

  const [img, setImg] = React.useState<string | null>(null)

  const transition = useMotionValue(0)
  const circle = useMotionValue({ x: 0, y: 0, r: 0 })

  const corners = React.useMemo(
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

  const handleThemeChange: HandleThemeChange = (key: string) => {
    const { setTheme, theme } = themeRef.current!

    return async e => {
      if (theme === key || transition.isAnimating()) return

      let x: number
      let y: number

      if ("x" in e && "y" in e) {
        x = e.x
        y = e.y
      } else {
        x = e.clientX
        y = e.clientY
      }

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
        themeRef.current!.theme = key
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
        themeRef
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
