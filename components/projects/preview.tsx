"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import Image from "next/image"

import { gsap } from "@/lib/gsap"

export type PreviewTarget = {
  slug: string
  name: string
  subtitle?: string
  date?: string
  live?: string
  frames: string[]
  imageAlt?: string
}

const WINDOW_WIDTH = 380
const WINDOW_RATIO = 5 / 3
const OFFSET_X = 56
const OFFSET_Y = 46
const DEAD_BAND = 0.25
const IDLE_AFTER = 1500
const ADVANCE_EVERY = 1100
const STEP_MS = 90

type PreviewContextValue = {
  show: (target: PreviewTarget) => void
  hide: () => void
}

const PreviewContext = createContext<PreviewContextValue | null>(null)

export function usePreview() {
  const context = useContext(PreviewContext)

  if (!context) {
    throw new Error("usePreview must be used inside <ProjectPreviewProvider>")
  }

  return context
}

export function ProjectPreviewProvider({ children }: { children: ReactNode }) {
  const frameRef = useRef<HTMLDivElement>(null)

  const [target, setTarget] = useState<PreviewTarget | null>(null)
  const [mounted, setMounted] = useState(false)
  const [frame, setFrame] = useState(0)
  const height = Math.round(WINDOW_WIDTH / WINDOW_RATIO)

  const capabilities = useMemo(() => {
    if (typeof window === "undefined") {
      return { hover: false, motion: false }
    }

    return {
      hover: window.matchMedia("(hover: hover) and (pointer: fine)").matches,
      motion: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    }
  }, [])

  const show = useCallback(
    (next: PreviewTarget) => {
      if (!capabilities.hover) return

      setTarget((current) =>
        current?.slug === next.slug ? current : { ...next, frames: next.frames }
      )
      setFrame(0)
      setMounted(true)
    },
    [capabilities.hover]
  )

  const hide = useCallback(() => setMounted(false), [])

  useEffect(() => {
    if (!mounted || !frameRef.current) return

    const element = frameRef.current
    const xTo = gsap.quickTo(element, "x", {
      duration: 0.5,
      ease: "power3.out",
    })
    const yTo = gsap.quickTo(element, "y", {
      duration: 0.5,
      ease: "power3.out",
    })

    const place = (event: PointerEvent) => {
      const maxX = window.innerWidth - WINDOW_WIDTH - 16
      const maxY = window.innerHeight - height - 16

      xTo(gsap.utils.clamp(16, Math.max(16, maxX), event.clientX + OFFSET_X))
      yTo(gsap.utils.clamp(16, Math.max(16, maxY), event.clientY + OFFSET_Y))
    }

    const dismiss = () => setMounted(false)

    window.addEventListener("pointermove", place, { passive: true })
    window.addEventListener("scroll", dismiss, { passive: true })

    return () => {
      window.removeEventListener("pointermove", place)
      window.removeEventListener("scroll", dismiss)
    }
  }, [mounted, height])

  useEffect(() => {
    if (!frameRef.current) return

    gsap.to(frameRef.current, {
      autoAlpha: mounted ? 1 : 0,
      scale: mounted ? 1 : 0.92,
      duration: mounted ? 0.45 : 0.28,
      ease: mounted ? "power3.out" : "power2.in",
      overwrite: true,
    })
  }, [mounted])

  const count = target?.frames.length ?? 0
  const index = count > 0 ? Math.min(frame, count - 1) : 0

  useEffect(() => {
    if (!mounted || !capabilities.motion || count < 2) return

    const cursor = { x: 0 }
    let stepTimer: ReturnType<typeof setInterval> | null = null
    let idleTimer: ReturnType<typeof setTimeout> | null = null

    const stopIdle = () => {
      if (idleTimer) clearTimeout(idleTimer)
      idleTimer = null
    }

    const stopStep = () => {
      if (stepTimer) {
        clearInterval(stepTimer)
        stepTimer = null
      }
    }

    const startIdle = () => {
      stopIdle()
      idleTimer = setTimeout(() => {
        stepTimer = setInterval(() => {
          setFrame((current) => (current + 1) % count)
        }, ADVANCE_EVERY)
      }, IDLE_AFTER)
    }

    const onMove = (event: PointerEvent) => {
      cursor.x = event.clientX
      stopIdle()
      stopStep()
      startIdle()
    }

    const scrub = setInterval(() => {
      const progress = cursor.x / Math.max(1, window.innerWidth)
      const slot = 1 / count

      setFrame((current) => {
        const forward = (current + 1) * slot - slot * DEAD_BAND
        const backward = current * slot + slot * DEAD_BAND

        if (progress > forward && current < count - 1) return current + 1
        if (progress < backward && current > 0) return current - 1
        return current
      })
    }, STEP_MS)

    window.addEventListener("pointermove", onMove, { passive: true })
    startIdle()

    return () => {
      clearInterval(scrub)
      stopIdle()
      stopStep()
      window.removeEventListener("pointermove", onMove)
    }
  }, [mounted, capabilities.motion, count])

  return (
    <PreviewContext.Provider
      value={useMemo(() => ({ show, hide }), [show, hide])}
    >
      {children}

      <div
        ref={frameRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-40 hidden origin-top-left scale-90 overflow-hidden bg-muted opacity-0 shadow-xl ring-1 ring-foreground/10 select-none lg:block"
        style={{ width: WINDOW_WIDTH, height, visibility: "hidden" }}
      >
        {target && count > 0 ? (
          <>
            <div className="absolute inset-0">
              <Image
                key={target.frames[index]}
                src={target.frames[index]}
                alt=""
                fill
                sizes="380px"
                className="scale-[1.08] object-cover"
              />
            </div>

            <div className="pointer-events-none absolute inset-0 bg-background/10" />

            <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between gap-3 bg-gradient-to-b from-background/75 to-transparent px-2.5 py-2">
              <span className="truncate font-mono text-[0.5625rem] tracking-widest uppercase">
                {target.name}
              </span>
              <span className="shrink-0 font-mono text-[0.5625rem] tracking-widest text-muted-foreground uppercase tabular-nums">
                {String(index + 1).padStart(2, "0")}
                {" / "}
                {String(count).padStart(2, "0")}
              </span>
            </div>

            {count > 1 ? (
              <span
                key={index}
                className="animate-preview-scan absolute inset-x-0 top-0 h-px origin-left bg-primary"
              />
            ) : null}
          </>
        ) : null}
      </div>
    </PreviewContext.Provider>
  )
}
