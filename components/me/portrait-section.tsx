"use client"

import { useRef, type PointerEvent as ReactPointerEvent } from "react"
import Image from "next/image"
import { useGSAP } from "@gsap/react"

import { gsap } from "@/lib/gsap"

const PORTRAIT = {
  src: "/me/portrait.webp",
  width: 2720,
  height: 3296,
  alt: "Portrait of Julien Fernandes looking directly at the camera.",
} as const

/**
 * 00 / Observe
 *
 * The portrait is the page's first instrument: a quiet monochrome plate with
 * one live, rectangular focus area. On precise pointers that area follows the
 * visitor and reveals the original photograph. Touch devices receive the same
 * idea as a composed, scroll-revealed crop, so the image never depends on hover
 * to make sense.
 */
export function PortraitSection() {
  const rootRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const colourRef = useRef<HTMLDivElement>(null)
  const focusRef = useRef<HTMLDivElement>(null)

  const setFocus = (x: number, y: number, immediate = false) => {
    const stage = stageRef.current
    const colour = colourRef.current
    const focus = focusRef.current
    if (!stage || !colour || !focus) return

    const width = stage.clientWidth
    const height = stage.clientHeight
    const focusWidth = Math.min(width * 0.36, 520)
    const focusHeight = Math.min(height * 0.48, 430)
    const left = Math.max(12, Math.min(x - focusWidth / 2, width - focusWidth - 12))
    const top = Math.max(12, Math.min(y - focusHeight / 2, height - focusHeight - 12))
    const duration = immediate ? 0 : 0.7

    gsap.to(colour, {
      clipPath: `inset(${top}px ${width - left - focusWidth}px ${height - top - focusHeight}px ${left}px)`,
      duration,
      ease: "power3.out",
      overwrite: true,
    })
    gsap.to(focus, {
      x: left,
      y: top,
      width: focusWidth,
      height: focusHeight,
      duration,
      ease: "power3.out",
      overwrite: true,
    })
  }

  const centreFocus = (immediate = false) => {
    const stage = stageRef.current
    if (!stage) return
    setFocus(stage.clientWidth / 2, stage.clientHeight * 0.48, immediate)
  }

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return
    const bounds = event.currentTarget.getBoundingClientRect()
    setFocus(event.clientX - bounds.left, event.clientY - bounds.top)
  }

  useGSAP(
    () => {
      const root = rootRef.current
      const stage = stageRef.current
      const colour = colourRef.current
      const focus = focusRef.current
      if (!root || !stage || !colour || !focus) return

      centreFocus(true)

      const onResize = () => centreFocus(true)
      window.addEventListener("resize", onResize)

      const motion = gsap.matchMedia()

      motion.add("(prefers-reduced-motion: no-preference)", () => {
        const intro = root.querySelectorAll<HTMLElement>("[data-observe-intro]")

        gsap
          .timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: { trigger: root, start: "top 82%", once: true },
          })
          .from(intro, { opacity: 0, y: 12, duration: 0.65, stagger: 0.08 })
          .from(stage, { opacity: 0, y: 34, duration: 1.15 }, 0.12)

        // Touch has no cursor to drive the aperture, so the first scroll into
        // the plate performs one slow act of focusing instead.
        const coarse = window.matchMedia("(hover: none), (pointer: coarse)")
        if (coarse.matches) {
          gsap.fromTo(
            [colour, focus],
            { opacity: 0 },
            {
              opacity: 1,
              duration: 1.2,
              ease: "power2.out",
              scrollTrigger: { trigger: stage, start: "top 72%", once: true },
            }
          )
        }
      })

      return () => window.removeEventListener("resize", onResize)
    },
    { scope: rootRef }
  )

  return (
    <section
      ref={rootRef}
      aria-labelledby="observe-title"
      className="pt-10 pb-28 md:pt-16 md:pb-44"
    >
      <header
        data-observe-intro
        className="grid grid-cols-2 items-end gap-4 border-t border-border pt-3 pb-5 font-mono text-[0.625rem] tracking-[0.18em] uppercase md:grid-cols-12"
      >
        <h2 id="observe-title" className="md:col-span-3">
          00 — Observe
        </h2>
        <p className="text-right text-muted-foreground md:col-span-3 md:col-start-10">
          Human system / Subject 00
        </p>
      </header>

      <figure className="-mx-6">
        <div
          ref={stageRef}
          data-cursor-pointer
          onPointerEnter={() => centreFocus()}
          onPointerMove={handlePointerMove}
          onPointerLeave={() => centreFocus()}
          className="relative h-[76svh] min-h-130 overflow-hidden border-y border-border bg-muted md:h-[82svh] md:min-h-150"
        >
          <Image
            src={PORTRAIT.src}
            width={PORTRAIT.width}
            height={PORTRAIT.height}
            alt={PORTRAIT.alt}
            sizes="100vw"
            className="absolute inset-0 size-full object-cover object-[50%_43%] grayscale contrast-[1.08] saturate-50 md:object-[50%_42%]"
          />

          <div
            ref={colourRef}
            aria-hidden
            className="absolute inset-0 will-change-[clip-path]"
          >
            <Image
              src={PORTRAIT.src}
              width={PORTRAIT.width}
              height={PORTRAIT.height}
              alt=""
              sizes="100vw"
              className="absolute inset-0 size-full object-cover object-[50%_43%] saturate-[0.92] md:object-[50%_42%]"
            />
          </div>

          <div
            ref={focusRef}
            aria-hidden
            className="pointer-events-none absolute top-0 left-0 will-change-transform"
          >
            <span className="absolute inset-0 border border-background/70 mix-blend-difference" />
            <Corner className="-top-px -left-px border-t border-l" />
            <Corner className="-top-px -right-px border-t border-r" />
            <Corner className="-bottom-px -left-px border-b border-l" />
            <Corner className="-right-px -bottom-px border-r border-b" />
            <span className="absolute top-0 right-0 h-px w-12 bg-primary" />
            <span className="absolute top-3 right-0 font-mono text-[0.5rem] tracking-[0.18em] text-background uppercase mix-blend-difference">
              Focus 00.1
            </span>
          </div>

          <div className="pointer-events-none absolute inset-x-6 bottom-5 flex items-end justify-between gap-6 font-mono text-[0.5625rem] tracking-[0.18em] text-white uppercase mix-blend-difference md:bottom-6">
            <p>
              Julien Fernandes
              <br />
              Paris / 48.8566° N
            </p>
            <p className="hidden text-right sm:block">
              <span className="md:hidden">Scroll to focus</span>
              <span className="hidden md:inline">Move to focus</span>
            </p>
          </div>
        </div>

        <figcaption
          data-observe-intro
          className="grid gap-10 border-b border-border px-6 py-8 md:grid-cols-12 md:items-start md:py-12"
        >
          <p className="font-mono text-[0.625rem] leading-relaxed tracking-[0.18em] text-muted-foreground uppercase md:col-span-3">
            Signal
            <br />
            Paris, France / 2026
          </p>
          <p className="max-w-4xl font-heading text-4xl leading-[0.98] tracking-[-0.02em] text-balance md:col-span-7 md:col-start-6 md:text-6xl lg:text-7xl">
            Between precision and instinct, I build things that feel alive.
          </p>
        </figcaption>
      </figure>
    </section>
  )
}

function Corner({ className }: { className: string }) {
  return <span className={`absolute size-4 border-primary ${className}`} />
}
