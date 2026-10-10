"use client"

import { useRef, useState } from "react"
import { useGSAP } from "@gsap/react"

import { gsap, ScrollTrigger } from "@/lib/gsap"
import { cn } from "@/lib/utils"

type Version = {
  version: string
  period: string
  title: string
  text: string
}

const VERSIONS: readonly Version[] = [
  {
    version: "v1.0",
    period: "2019–21",
    title: "Curiosity",
    text: "Early experiments with code, visual systems and how things work.",
  },
  {
    version: "v2.0",
    period: "2021–23",
    title: "Making",
    text: "From ideas to working prototypes across software and hardware.",
  },
  {
    version: "v2.4",
    period: "2023–25",
    title: "Engineering",
    text: "Learning to think in systems: constraints, logic and iteration.",
  },
  {
    version: "v2.6",
    period: "2025–now",
    title: "Now",
    text: "Building digital experiences that feel clear, tactile and alive.",
  },
]

/** Positions evolve from scattered observation to a system with some life left. */
const NODE_STATES = [
  [
    [12, 20],
    [72, 12],
    [43, 31],
    [88, 43],
    [24, 57],
    [61, 69],
    [9, 86],
    [83, 84],
  ],
  [
    [18, 25],
    [37, 23],
    [59, 38],
    [78, 36],
    [22, 68],
    [43, 64],
    [65, 78],
    [82, 67],
  ],
  [
    [20, 23],
    [40, 23],
    [60, 23],
    [80, 23],
    [20, 72],
    [40, 72],
    [60, 72],
    [80, 72],
  ],
  [
    [18, 25],
    [39, 20],
    [62, 27],
    [82, 18],
    [22, 69],
    [43, 77],
    [64, 67],
    [84, 74],
  ],
] as const

/**
 * 02 / Trace
 *
 * The biography is read as a system learning to organise itself. On wide
 * screens the active release stays large and physical while the story passes
 * beside it; the field moves from scattered points to an engineered grid and
 * then relaxes into the balanced present. Mobile keeps the same chronology as
 * a direct editorial sequence, without sticky behaviour.
 */
export function VersionTimeline() {
  const rootRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return

      const motion = gsap.matchMedia()

      motion.add("(min-width: 1024px)", () => {
        const chapters = Array.from(
          root.querySelectorAll<HTMLElement>("[data-version-chapter]")
        )

        const triggers = chapters.map((chapter, index) =>
          ScrollTrigger.create({
            trigger: chapter,
            start: "top 52%",
            end: "bottom 52%",
            onEnter: () => setActive(index),
            onEnterBack: () => setActive(index),
          })
        )

        return () => triggers.forEach((trigger) => trigger.kill())
      })

      motion.add("(prefers-reduced-motion: no-preference)", () => {
        const heading = root.querySelectorAll<HTMLElement>("[data-trace-heading]")
        const chapters = root.querySelectorAll<HTMLElement>("[data-version-chapter]")

        gsap.from(heading, {
          opacity: 0,
          y: 10,
          duration: 0.6,
          stagger: 0.06,
          ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 82%", once: true },
        })

        chapters.forEach((chapter) => {
          gsap.from(chapter.children, {
            opacity: 0,
            y: 22,
            duration: 0.8,
            stagger: 0.07,
            ease: "power3.out",
            scrollTrigger: { trigger: chapter, start: "top 82%", once: true },
          })
        })
      })
    },
    { scope: rootRef }
  )

  return (
    <section
      ref={rootRef}
      aria-labelledby="versions-of-me"
      className="pb-28 md:pb-44"
    >
      <header className="grid grid-cols-2 items-end gap-4 border-t border-border pt-3 pb-8 font-mono text-[0.625rem] tracking-[0.18em] uppercase md:grid-cols-12 md:pb-12">
        <h2 id="versions-of-me" data-trace-heading className="md:col-span-3">
          02 — Trace
        </h2>
        <p
          data-trace-heading
          className="text-right text-muted-foreground md:col-span-3 md:col-start-10"
        >
          Versions / 2019—Now
        </p>
      </header>

      <div className="border-t border-border lg:grid lg:grid-cols-12 lg:gap-x-12">
        <div className="hidden lg:col-span-7 lg:block">
          <div className="sticky top-6 flex h-[calc(100svh-3rem)] min-h-160 max-h-230 flex-col py-8">
            <div className="relative min-h-0 flex-1 overflow-hidden border-b border-border">
              <SystemTrace active={active} />

              <div className="absolute inset-x-0 top-[8%] h-[46%] overflow-hidden">
                {VERSIONS.map((entry, index) => (
                  <p
                    key={entry.version}
                    aria-hidden={index !== active}
                    className={cn(
                      "absolute inset-0 font-heading text-[clamp(8rem,17vw,17rem)] leading-[0.72] tracking-[-0.065em] transition-all duration-700 ease-out",
                      index === active
                        ? "translate-y-0 opacity-100"
                        : index < active
                          ? "-translate-y-[35%] opacity-0"
                          : "translate-y-[35%] opacity-0"
                    )}
                  >
                    {entry.version}
                  </p>
                ))}
              </div>

              <p className="absolute bottom-7 left-0 max-w-xs font-mono text-[0.625rem] leading-relaxed tracking-[0.16em] text-muted-foreground uppercase">
                A system learning
                <br />
                to organise itself
              </p>
            </div>

            <div className="pt-6">
              <div className="flex items-center justify-between font-mono text-[0.5625rem] tracking-[0.18em] text-muted-foreground uppercase">
                <span>Trace position</span>
                <span>{String(active + 1).padStart(2, "0")} / 04</span>
              </div>
              <div className="relative mt-4 h-px bg-border">
                <span
                  aria-hidden
                  className="absolute top-0 left-0 h-px bg-primary transition-[width] duration-700 ease-out motion-reduce:transition-none"
                  style={{ width: `${((active + 1) / VERSIONS.length) * 100}%` }}
                />
                <span
                  aria-hidden
                  className="absolute top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary transition-[left] duration-700 ease-out motion-reduce:transition-none"
                  style={{ left: `${((active + 1) / VERSIONS.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <ol className="lg:col-span-5">
          {VERSIONS.map((entry, index) => (
            <li
              key={entry.version}
              data-version-chapter
              aria-current={index === VERSIONS.length - 1 ? "step" : undefined}
              className="flex min-h-[62svh] flex-col justify-center border-b border-border py-16 lg:min-h-[72svh] lg:py-24"
            >
              <div className="flex items-center justify-between font-mono text-[0.625rem] tracking-[0.16em] uppercase">
                <span>{entry.version}</span>
                <span className="text-muted-foreground">{entry.period}</span>
              </div>

              <p className="mt-16 font-heading text-[clamp(4rem,13vw,7rem)] leading-[0.8] tracking-[-0.045em] lg:mt-24 lg:text-[clamp(4rem,7vw,7rem)]">
                {entry.title}
              </p>

              <p className="mt-9 max-w-md text-lg leading-relaxed text-muted-foreground lg:text-xl">
                {entry.text}
              </p>

              <div className="mt-14 flex items-center gap-3 font-mono text-[0.5625rem] tracking-[0.18em] text-muted-foreground uppercase lg:hidden">
                <span
                  aria-hidden
                  className={cn(
                    "size-1.5 rounded-full",
                    index === VERSIONS.length - 1
                      ? "bg-primary"
                      : "bg-foreground/25"
                  )}
                />
                Stage {String(index + 1).padStart(2, "0")} / 04
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function SystemTrace({ active }: { active: number }) {
  const positions = NODE_STATES[active]
  const gridVisible = active >= 2

  return (
    <div aria-hidden className="absolute inset-0">
      <div
        className={cn(
          "absolute inset-0 transition-opacity duration-700 motion-reduce:transition-none",
          gridVisible ? "opacity-100" : "opacity-35"
        )}
      >
        {[25, 50, 75].map((position) => (
          <span
            key={`x-${position}`}
            className="absolute top-0 bottom-0 w-px bg-foreground/8"
            style={{ left: `${position}%` }}
          />
        ))}
        {[25, 50, 75].map((position) => (
          <span
            key={`y-${position}`}
            className="absolute right-0 left-0 h-px bg-foreground/8"
            style={{ top: `${position}%` }}
          />
        ))}
      </div>

      {positions.map(([x, y], index) => (
        <span
          key={index}
          className={cn(
            "absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full border bg-background transition-[top,left,border-color,background-color] duration-700 ease-out motion-reduce:transition-none",
            active === 3 && index === 5
              ? "border-primary bg-primary"
              : "border-foreground/35"
          )}
          style={{ left: `${x}%`, top: `${y}%` }}
        />
      ))}
    </div>
  )
}
