"use client"

import { useRef } from "react"
import Image from "next/image"
import { useGSAP } from "@gsap/react"

import { gsap } from "@/lib/gsap"

/**
 * The portrait, shown as a specimen rather than a headshot.
 *
 * The photograph is set in a hairline mat and observed: a lowercase editorial
 * line answers it from the opposite column, anchored low so the image can run
 * tall above it, and a monospace note sits at the image's foot like a specimen
 * label. The one accent in the whole section is a short rule above the
 * sentence — a single mark of life, kept far from the face.
 *
 * The caption is a real sentence, so it stays in the flow at every width: on
 * mobile the photograph comes first and the note reads underneath it, which is
 * also the order the column grid collapses to.
 */

const CAPTION =
  "Building at the intersection of systems, stories and the spaces in between."

export function PortraitSection() {
  const rootRef = useRef<HTMLElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const annotationRef = useRef<HTMLElement>(null)
  const captionRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const root = rootRef.current
      const frame = frameRef.current
      const annotation = annotationRef.current
      const caption = captionRef.current

      if (!root || !frame || !annotation || !caption) return

      const motion = gsap.matchMedia()

      // Reduced motion keeps the markup exactly as written: no timeline is
      // ever built, so the photograph, its note and the sentence are all
      // visible from the first frame rather than waiting on a scroll.
      motion.add("(prefers-reduced-motion: no-preference)", () => {
        const timeline = gsap.timeline({
          delay: 0.15,
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: root, start: "top 85%", once: true },
        })

        // The photograph leads, then the note and the sentence follow it in,
        // each a beat later. Plain opacity throughout: every one of these is
        // text or carries it, so none of it ever leaves the accessibility
        // tree while it waits.
        timeline
          .from(frame, { y: 28, opacity: 0, duration: 1.1 }, 0)
          .from(annotation, { y: 12, opacity: 0, duration: 0.7 }, 0.24)
          .from(caption, { y: 22, opacity: 0, duration: 0.9 }, 0.36)
      })
    },
    { scope: rootRef }
  )

  return (
    <section
      ref={rootRef}
      aria-label="Portrait"
      className="relative pt-14 pb-24 md:pt-20 md:pb-36"
    >
      <div className="grid grid-cols-12 gap-x-6">
        <figure className="col-span-12 md:col-span-7 lg:col-span-6 lg:max-w-2xl">
          <div ref={frameRef} className="group border border-border p-2 md:p-3">
            <div className="relative overflow-hidden bg-muted">
              <Image
                src="/me/portrait.webp"
                alt="Portrait of Julien Fernandes."
                width={2720}
                height={3296}
                sizes="(min-width: 1280px) 672px, (min-width: 1024px) 47vw, (min-width: 768px) 54vw, 100vw"
                className="h-auto w-full transition-transform duration-1000 ease-out motion-safe:group-hover:scale-[1.02]"
              />
            </div>
          </div>

          <figcaption
            ref={annotationRef}
            className="mt-3 font-mono text-[0.625rem] tracking-[0.18em] text-muted-foreground uppercase"
          >
            Portrait / Paris, FR / 2026
          </figcaption>
        </figure>

        <div
          ref={captionRef}
          className="col-span-12 mt-14 md:col-span-4 md:col-start-9 md:mt-0 md:self-end md:pb-16"
        >
          <span aria-hidden className="block h-px w-10 bg-primary" />
          <p className="mt-6 max-w-md font-heading text-3xl leading-[1.1] text-balance italic md:text-4xl lg:text-[2.75rem]">
            {CAPTION}
          </p>
        </div>
      </div>
    </section>
  )
}
