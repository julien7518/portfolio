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
import { ArrowUpRight } from "lucide-react"

import { gsap } from "@/lib/gsap"
import { cn } from "@/lib/utils"

export type PreviewTarget = {
  slug: string
  name: string
  subtitle?: string
  date?: string
  live?: string
  imageSrc?: string
  imageAlt?: string
  categories?: string[]
}

const DWELL_MS = 260
const LOAD_TIMEOUT_MS = 4000
const WINDOW_WIDTH = 480
const WINDOW_RATIO = 5 / 3
const OFFSET_X = 64
const OFFSET_Y = 52
const MAX_ROTATION = 7

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
  const dwellRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const loadRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastXRef = useRef(0)

  const [target, setTarget] = useState<PreviewTarget | null>(null)
  const [mounted, setMounted] = useState(false)
  const [wantsLive, setWantsLive] = useState(false)
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null)
  const [blocked, setBlocked] = useState(false)

  const wantsLiveRef = useRef(false)

  useEffect(() => {
    wantsLiveRef.current = wantsLive
  }, [wantsLive])

  const height = WINDOW_WIDTH / WINDOW_RATIO

  const canHover = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  )

  const clearTimers = useCallback(() => {
    if (dwellRef.current) clearTimeout(dwellRef.current)
    if (loadRef.current) clearTimeout(loadRef.current)
    dwellRef.current = null
    loadRef.current = null
  }, [])

  const show = useCallback(
    (next: PreviewTarget) => {
      if (!canHover) return

      clearTimers()
      setTarget((current) => (current?.slug === next.slug ? current : next))
      setWantsLive(false)
      setLoadedSrc(null)
      setBlocked(false)
      setMounted(true)

      dwellRef.current = setTimeout(() => {
        if (next.live) setWantsLive(true)
      }, DWELL_MS)
    },
    [canHover, clearTimers]
  )

  const hide = useCallback(() => {
    clearTimers()
    setWantsLive(false)
    setLoadedSrc(null)
    setBlocked(false)
    setMounted(false)
  }, [clearTimers])

  useEffect(() => clearTimers, [clearTimers])

  useEffect(() => {
    if (!mounted || !frameRef.current) return

    const frame = frameRef.current
    const xTo = gsap.quickTo(frame, "x", { duration: 0.55, ease: "power3.out" })
    const yTo = gsap.quickTo(frame, "y", { duration: 0.55, ease: "power3.out" })
    const rotationTo = gsap.quickTo(frame, "rotate", {
      duration: 0.9,
      ease: "power3.out",
    })

    const place = (event: PointerEvent) => {
      const velocity = event.clientX - lastXRef.current
      lastXRef.current = event.clientX

      const maxX = window.innerWidth - WINDOW_WIDTH - 16
      const maxY = window.innerHeight - height - 16

      xTo(gsap.utils.clamp(16, Math.max(16, maxX), event.clientX + OFFSET_X))
      yTo(gsap.utils.clamp(16, Math.max(16, maxY), event.clientY + OFFSET_Y))
      rotationTo(gsap.utils.clamp(-MAX_ROTATION, MAX_ROTATION, velocity * 0.18))
    }

    const dismiss = () => hide()

    window.addEventListener("pointermove", place, { passive: true })
    window.addEventListener("scroll", dismiss, { passive: true })

    return () => {
      window.removeEventListener("pointermove", place)
      window.removeEventListener("scroll", dismiss)
    }
  }, [mounted, hide, height])

  useEffect(() => {
    if (!frameRef.current) return

    gsap.to(frameRef.current, {
      autoAlpha: mounted ? 1 : 0,
      scale: mounted ? 1 : 0.9,
      duration: mounted ? 0.5 : 0.3,
      ease: mounted ? "power3.out" : "power2.in",
      overwrite: true,
    })
  }, [mounted])

  useEffect(() => {
    if (!wantsLive || !target?.live) return

    loadRef.current = setTimeout(() => {
      setLoadedSrc((current) => (current ? current : "__timeout__"))
      setBlocked(true)
    }, LOAD_TIMEOUT_MS)
  }, [wantsLive, target?.live])

  const isLive = Boolean(target?.live && wantsLive && loadedSrc === target.live)
  const showPoster = !isLive

  return (
    <PreviewContext.Provider
      value={useMemo(() => ({ show, hide }), [show, hide])}
    >
      {children}

      <div
        ref={frameRef}
        aria-hidden
        className={cn(
          "pointer-events-none fixed top-0 left-0 z-40 hidden w-[30rem] origin-top-left scale-90 overflow-hidden bg-card opacity-0 shadow-2xl ring-1 ring-foreground/10 select-none lg:block"
        )}
        style={{
          width: WINDOW_WIDTH,
          height,
          visibility: "hidden",
        }}
      >
        {target ? (
          <>
            <div className="absolute inset-0">
              {target.imageSrc ? (
                <Image
                  src={target.imageSrc}
                  alt=""
                  fill
                  sizes="480px"
                  className={cn(
                    "object-cover",
                    wantsLive && !isLive && "animate-preview-settle"
                  )}
                />
              ) : (
                <div className="size-full bg-muted" />
              )}
            </div>

            {target.live ? (
              <iframe
                src={wantsLive ? target.live : undefined}
                title={target.name}
                referrerPolicy="no-referrer"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
                onLoad={() => {
                  if (!wantsLiveRef.current) return

                  if (loadRef.current) clearTimeout(loadRef.current)
                  loadRef.current = null
                  setBlocked(false)
                  if (target.live) setLoadedSrc(target.live)
                }}
                className={cn(
                  "absolute inset-0 size-full border-0 bg-background transition-opacity duration-500",
                  isLive ? "opacity-100" : "opacity-0"
                )}
              />
            ) : null}

            {showPoster ? (
              <div className="absolute inset-0 bg-background/10" />
            ) : null}

            <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between gap-3 bg-gradient-to-b from-background/80 to-transparent px-3 py-2">
              <span className="font-mono text-[0.625rem] tracking-widest uppercase">
                {target.name}
              </span>
              {target.live ? (
                <span className="flex items-center gap-1.5 font-mono text-[0.625rem] tracking-widest uppercase">
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      blocked ? "bg-destructive" : "bg-primary"
                    )}
                  />
                  {blocked ? "blocked" : isLive ? "live" : "loading"}
                </span>
              ) : null}
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-background/80 to-transparent px-3 py-2">
              <span className="truncate font-mono text-[0.625rem] tracking-widest text-muted-foreground uppercase">
                {blocked ? (target.subtitle ?? "") : hostname(target.live)}
              </span>
              <ArrowUpRight className="size-3 shrink-0" />
            </div>

            {wantsLive && !isLive && !blocked ? (
              <span className="animate-preview-scan absolute inset-x-0 top-0 h-px origin-left bg-primary" />
            ) : null}
          </>
        ) : null}
      </div>
    </PreviewContext.Provider>
  )
}

function hostname(url?: string) {
  if (!url) return ""
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return url
  }
}
