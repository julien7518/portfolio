"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"

import { gsap } from "@/lib/gsap"
import { cn } from "@/lib/utils"

/**
 * Versions of me — the page's changelog.
 *
 * Four releases of one person, each read as a single wide line: the version on
 * the left, the period beside it, the name set in the editorial serif, and the
 * sentence that says what changed. The rows share one continuous hairline grid,
 * so the sequence reads as a printed changelog rather than a deck of cards —
 * no rail down the middle, no nodes, no chrome.
 *
 * The last release is the live one: its name is set a size larger, its version
 * stands at full contrast, and a single primary dot marks it as the row the
 * system is currently running. That dot is the only colour and the only thing
 * that moves on its own.
 *
 * Chronology is the whole point, so the reveal is driven per row rather than as
 * one group: on a tall section, each version still arrives in order as it
 * reaches the reading line.
 */

type Version = {
  /** The release tag, read as data rather than as a word. */
  version: string
  /** A short, neutral span of years. */
  period: string
  /** The one-word name of that version. */
  title: string
  /** What changed, in a sentence. */
  text: string
  /** The version currently running. Only one should carry this. */
  active?: boolean
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
    active: true,
  },
]

export function VersionTimeline() {
  const rootRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return

      const motion = gsap.matchMedia()

      // Reduced motion keeps the changelog exactly as written: no row is ever
      // hidden and no pulse is ever started, so the whole sequence is on screen
      // from the first frame.
      motion.add("(prefers-reduced-motion: no-preference)", () => {
        const header = root.querySelector<HTMLElement>("[data-version-header]")
        const items = Array.from(
          root.querySelectorAll<HTMLElement>("[data-version-item]")
        )
        const pulse = root.querySelector<HTMLElement>("[data-version-pulse]")

        // The heading, then each release as it reaches the reading line. Plain
        // opacity and a short lift: this is all text, so none of it ever leaves
        // the accessibility tree while it waits.
        if (header) {
          gsap.from(header, {
            opacity: 0,
            y: 10,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: { trigger: header, start: "top 85%", once: true },
          })
        }

        items.forEach((item) => {
          gsap.from(item, {
            opacity: 0,
            y: 24,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: item, start: "top 85%", once: true },
          })
        })

        // The one mark of life: the current release's presence dot, breathing
        // so slowly it is barely caught.
        if (pulse) {
          gsap.to(pulse, {
            opacity: 0.3,
            duration: 3.2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: 1,
          })
        }
      })
    },
    { scope: rootRef }
  )

  return (
    <section
      ref={rootRef}
      aria-labelledby="versions-of-me"
      className="pb-24 md:pb-40"
    >
      <h2
        id="versions-of-me"
        data-version-header
        className="font-mono text-[0.6875rem] tracking-widest text-muted-foreground uppercase"
      >
        02 — Versions of me
      </h2>

      <ol className="mt-10 border-b border-border">
        {VERSIONS.map((entry) => (
          <li
            key={entry.version}
            data-version-item
            aria-current={entry.active ? "step" : undefined}
            className={cn(
              "grid grid-cols-2 items-baseline gap-x-6 gap-y-4 border-t border-border py-8 md:grid-cols-12 md:py-12",
              entry.active && "py-10 md:py-16"
            )}
          >
            <p
              className={cn(
                "col-span-1 font-mono text-xs tabular-nums md:col-span-2",
                entry.active ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {entry.active ? (
                <span
                  aria-hidden
                  data-version-pulse
                  className="mr-2 inline-block size-1.5 rounded-full bg-primary align-middle"
                />
              ) : null}
              {entry.version}
            </p>

            <p className="col-span-1 font-mono text-xs text-muted-foreground tabular-nums md:col-span-2">
              {entry.period}
            </p>

            <h3
              className={cn(
                "col-span-2 font-heading leading-[1.1] italic md:col-span-3",
                entry.active
                  ? "text-4xl md:text-5xl lg:text-6xl"
                  : "text-3xl md:text-4xl"
              )}
            >
              {entry.title}
            </h3>

            <p className="col-span-2 text-base leading-relaxed text-muted-foreground md:col-span-5 md:text-lg">
              {entry.text}
            </p>
          </li>
        ))}
      </ol>
    </section>
  )
}
