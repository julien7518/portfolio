"use client"

import { useRef } from "react"
import Link from "next/link"
import { useGSAP } from "@gsap/react"
import { ArrowUpRight } from "lucide-react"

import { ParisClock } from "@/components/paris-clock"
import { gsap } from "@/lib/gsap"
import { HeroGrid } from "./hero-grid"

export function Hero() {
  const rootRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const lines = rootRef.current?.querySelectorAll("[data-hero-line]")
      if (!lines?.length) return

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches

      if (reduced) {
        gsap.set(lines, { clearProps: "all" })
        return
      }

      gsap.from(lines, {
        yPercent: 130,
        opacity: 0,
        duration: 1.1,
        stagger: 0.09,
        ease: "power3.out",
        delay: 0.15,
      })
    },
    { scope: rootRef }
  )

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-svh flex-col overflow-hidden px-6 pt-10 pb-8 md:px-6 md:pt-16 md:pb-10"
    >
      <HeroGrid />

      <div className="relative z-10 flex items-baseline justify-between gap-6 border-b border-border pb-4 font-mono text-xs text-muted-foreground">
        <div data-hero-line className="tracking-widest uppercase">
          Paris, France
        </div>
        <div data-hero-line className="tabular-nums">
          <ParisClock />
        </div>
      </div>

      <div className="relative z-10 flex flex-1 flex-col justify-center py-16 md:py-24">
        {/* The reveal masks need room for descenders (the J especially), so
            each line carries bottom padding and hands it straight back with a
            negative margin — the mask grows, the leading does not. */}
        <h1 className="font-heading text-[25vw] leading-[0.78] tracking-[-0.03em] md:text-[20vw] lg:text-[16vw]">
          <span className="mb-[-0.2em] block overflow-hidden pb-[0.2em] pl-[0.075em]">
            <span data-hero-line className="block">
              Julien
            </span>
          </span>
          <span className="mb-[-0.2em] block overflow-hidden pb-[0.2em] pl-[7%] md:pl-[12%]">
            <span data-hero-line className="block">
              Fernandes
            </span>
          </span>
        </h1>
      </div>

      <div className="relative z-10 flex flex-col gap-8 border-t border-border pt-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-sm">
          <p
            data-hero-line
            className="font-mono text-[0.6875rem] tracking-widest uppercase"
          >
            Creative technologist
          </p>
          <p
            data-hero-line
            className="mt-3 text-base leading-relaxed text-balance text-muted-foreground md:text-lg"
          >
            Across web, native, embedded and AI, I turn complex systems into
            experiences that feel clear, tactile and alive.
          </p>
        </div>

        <Link
          data-hero-line
          href="/projects"
          data-cursor-pointer
          className="group inline-flex items-center gap-3 self-start border-b border-foreground pb-1 font-mono text-xs tracking-widest uppercase transition-opacity duration-300 hover:opacity-60 md:self-end"
        >
          Selected work
          <ArrowUpRight
            aria-hidden
            className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </Link>
      </div>
    </section>
  )
}
