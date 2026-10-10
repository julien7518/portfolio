"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"

import { ParisClock } from "@/components/paris-clock"
import { gsap } from "@/lib/gsap"
import { contact, identity, location } from "@/resources"

/**
 * 01 / Read
 *
 * A live reading rather than a profile card. The two facts that define the
 * present — practice and availability — carry the scale; location, time and
 * status sit beneath as quieter coordinates. The four disciplines share one
 * continuous axis so they read as a range, not as a row of skill badges.
 */
export function IdentityCard() {
  const rootRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return

      const motion = gsap.matchMedia()

      motion.add("(prefers-reduced-motion: no-preference)", () => {
        const heading = root.querySelectorAll<HTMLElement>("[data-read-heading]")
        const masks = root.querySelectorAll<HTMLElement>("[data-read-mask]")
        const rules = root.querySelectorAll<HTMLElement>("[data-read-rule]")
        const signal = root.querySelector<HTMLElement>("[data-read-signal]")

        const timeline = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: root, start: "top 76%", once: true },
        })

        timeline
          .from(heading, { opacity: 0, y: 10, duration: 0.6, stagger: 0.06 })
          .from(
            rules,
            { scaleX: 0, transformOrigin: "left center", duration: 0.9 },
            0.08
          )
          .from(
            masks,
            {
              clipPath: "inset(0 0 105% 0)",
              y: 14,
              duration: 0.85,
              stagger: 0.07,
            },
            0.18
          )

        if (signal) {
          gsap.to(signal, {
            opacity: 0.28,
            scale: 1.75,
            duration: 2.4,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          })
        }
      })
    },
    { scope: rootRef }
  )

  return (
    <section
      ref={rootRef}
      aria-labelledby="vital-signs-title"
      className="pb-28 md:pb-44"
    >
      <header className="grid grid-cols-2 items-end gap-4 border-t border-border pt-3 pb-8 font-mono text-[0.625rem] tracking-[0.18em] uppercase md:grid-cols-12 md:pb-12">
        <h2 id="vital-signs-title" data-read-heading className="md:col-span-3">
          01 — Read
        </h2>
        <p
          data-read-heading
          className="text-right text-muted-foreground md:col-span-3 md:col-start-10"
        >
          Vital signs / Live state
        </p>
      </header>

      <div className="relative grid md:grid-cols-12">
        <span
          data-read-rule
          aria-hidden
          className="absolute inset-x-0 top-0 h-px bg-border"
        />

        <div className="py-10 md:col-span-8 md:py-16 md:pr-12 lg:py-20">
          <p
            data-read-mask
            className="font-mono text-[0.625rem] tracking-[0.18em] text-muted-foreground uppercase"
          >
            State / Building
          </p>
          <p
            data-read-mask
            className="mt-7 max-w-5xl font-heading text-[clamp(4rem,9vw,9rem)] leading-[0.78] tracking-[-0.045em]"
          >
            Creative
            <br />
            technologist
          </p>
        </div>

        <div className="relative flex flex-col justify-between border-t border-border py-8 md:col-span-4 md:border-t-0 md:border-l md:py-16 md:pl-8 lg:py-20 lg:pl-12">
          <div data-read-mask className="flex items-center gap-3">
            <span aria-hidden className="relative flex size-2">
              <span
                data-read-signal
                className="absolute inset-0 rounded-full bg-primary"
              />
              <span className="relative size-2 rounded-full bg-primary" />
            </span>
            <p className="font-mono text-[0.625rem] tracking-[0.18em] uppercase">
              Signal / Available
            </p>
          </div>

          <p
            data-read-mask
            className="mt-16 max-w-md font-heading text-3xl leading-[1.04] tracking-[-0.02em] text-balance md:mt-24 md:text-4xl lg:text-5xl"
          >
            {contact.availability}
          </p>
        </div>

        <span
          data-read-rule
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-px bg-border"
        />
      </div>

      <dl className="grid md:grid-cols-12">
        <Reading label="Coordinates" className="md:col-span-4">
          {location.label}
        </Reading>
        <Reading label="Local time" className="md:col-span-4 md:border-l md:px-8">
          <span className="font-mono tabular-nums">
            <ParisClock />
          </span>
        </Reading>
        <Reading label="Current mode" className="md:col-span-4 md:border-l md:pl-8">
          {identity.status}
        </Reading>
      </dl>

      <div className="relative mt-14 md:mt-20">
        <div className="flex items-end justify-between gap-6">
          <p
            data-read-mask
            className="font-mono text-[0.625rem] tracking-[0.18em] text-muted-foreground uppercase"
          >
            Operating range
          </p>
          <p
            data-read-mask
            className="hidden font-mono text-[0.5625rem] tracking-[0.18em] text-muted-foreground uppercase sm:block"
          >
            One practice / Four territories
          </p>
        </div>

        <ol className="relative mt-7 grid grid-cols-4">
          <span
            data-read-rule
            aria-hidden
            className="absolute inset-x-0 top-1.25 h-px bg-border"
          />
          {identity.focus.map((discipline, index) => (
            <li
              key={discipline}
              data-read-mask
              className="relative pt-7 font-mono text-[0.625rem] tracking-[0.12em] uppercase sm:text-xs"
            >
              <span
                aria-hidden
                className="absolute top-0 left-0 size-2.5 rounded-full border border-foreground/35 bg-background"
              />
              <span className={index > 0 ? "pl-2 sm:pl-0" : undefined}>
                {discipline}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Reading({
  label,
  className,
  children,
}: {
  label: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div
      data-read-mask
      className={`border-b border-border py-7 md:py-9 ${className ?? ""}`}
    >
      <dt className="font-mono text-[0.5625rem] tracking-[0.18em] text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="mt-3 text-base md:text-lg">{children}</dd>
    </div>
  )
}
