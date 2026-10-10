"use client"

import { Fragment, useRef, type ReactNode } from "react"
import { useGSAP } from "@gsap/react"

import { ParisClock } from "@/components/paris-clock"
import { gsap } from "@/lib/gsap"
import { cn } from "@/lib/utils"
import { contact, identity, location } from "@/resources"

/**
 * The identity sheet, kept as a printed index rather than a profile card.
 *
 * Six concrete facts about Julien, set on a single hairline-ruled grid: a
 * monospace label, then a value that carries the voice. The serif is allowed
 * only twice — the role and the current availability — so the two lines that
 * are about him rather than about the listing stand slightly apart. The one
 * accent in the whole sheet is a small primary dot on that availability, and
 * it is the only thing that moves on its own.
 *
 * Nothing here is ornamental: no radius, no shadow, no badge, no background.
 * The composition is carried entirely by rules, alignment and air, so it reads
 * as a page of a specimen book and never as a dashboard.
 *
 * The section closes on generous space so the next chapter (the timeline) has
 * room to begin, without this one trying to draw it.
 */

export function IdentityCard() {
  const rootRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return

      const motion = gsap.matchMedia()

      // Reduced motion keeps the whole sheet exactly as written: no timeline is
      // ever built and no pulse is ever started, so every fact is on screen
      // from the first frame.
      motion.add("(prefers-reduced-motion: no-preference)", () => {
        const header = root.querySelector<HTMLElement>("[data-identity-header]")
        const cells = root.querySelectorAll<HTMLElement>("[data-identity-cell]")
        const pulse = root.querySelector<HTMLElement>("[data-identity-pulse]")

        const timeline = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: root, start: "top 82%", once: true },
        })

        // The heading lands first, then the cells follow it in, one line of the
        // sheet at a time. Plain opacity: this is all text, so none of it ever
        // leaves the accessibility tree while it waits.
        if (header) {
          timeline.from(header, { opacity: 0, y: 10, duration: 0.6 }, 0)
        }

        if (cells.length) {
          timeline.from(
            cells,
            { opacity: 0, y: 18, duration: 0.7, stagger: 0.07 },
            0.12
          )
        }

        // The presence signal is the one living mark on the sheet: a slow,
        // shallow breath, and nothing louder than that.
        if (pulse) {
          gsap.to(pulse, {
            opacity: 0.3,
            duration: 2.8,
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
      aria-labelledby="current-signal"
      className="pb-24 md:pb-40"
    >
      <h2
        id="current-signal"
        data-identity-header
        className="font-mono text-[0.6875rem] tracking-widest text-muted-foreground uppercase"
      >
        01 — Current signal
      </h2>

      <dl className="mt-10 grid grid-cols-1 border-t border-border sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-3">
        <Field label="Base">{location.label}</Field>

        <Field
          label="Role"
          valueClassName="font-heading text-2xl leading-[1.1] italic md:text-3xl"
        >
          {identity.role}
        </Field>

        <Field label="Status">{identity.status}</Field>

        <Field
          label="Currently"
          signal
          valueClassName="font-heading text-2xl leading-[1.2] text-balance italic md:text-3xl"
        >
          {contact.availability}
        </Field>

        <Field
          label="Local time"
          valueClassName="font-mono text-xl tabular-nums md:text-2xl"
        >
          <ParisClock />
        </Field>

        <Field label="Focus">
          {identity.focus.map((item, index) => (
            <Fragment key={item}>
              {index > 0 ? (
                <span className="mx-1.5 text-muted-foreground">/</span>
              ) : null}
              {item}
            </Fragment>
          ))}
        </Field>
      </dl>
    </section>
  )
}

function Field({
  label,
  signal = false,
  valueClassName,
  children,
}: {
  label: string
  signal?: boolean
  valueClassName?: string
  children: ReactNode
}) {
  return (
    <div data-identity-cell className="border-b border-border py-7 md:py-9">
      <dt className="flex items-center gap-2 font-mono text-[0.625rem] tracking-widest text-muted-foreground uppercase">
        {signal ? (
          <span aria-hidden className="relative inline-flex size-1.5 shrink-0">
            <span
              data-identity-pulse
              className="absolute inset-0 rounded-full bg-primary"
            />
          </span>
        ) : null}
        {label}
      </dt>
      <dd className={cn("mt-3 text-lg md:text-xl", valueClassName)}>
        {children}
      </dd>
    </div>
  )
}
