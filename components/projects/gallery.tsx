"use client"

import { useCallback, useRef, useState } from "react"
import Image from "next/image"
import { useGSAP } from "@gsap/react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { gsap } from "@/lib/gsap"
import { scrollToY } from "@/components/smooth-scroll"
import { cn } from "@/lib/utils"

export function Gallery({
  images,
  alts,
  name,
}: {
  images: string[]
  alts?: (string | undefined)[]
  name: string
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const tweenRef = useRef<gsap.core.Tween | null>(null)

  const [active, setActive] = useState(0)
  const count = images.length
  const single = count < 2

  useGSAP(
    () => {
      if (single) return

      const section = sectionRef.current
      const track = trackRef.current
      if (!section || !track) return

      const media = gsap.matchMedia()

      media.add("(min-width: 768px)", () => {
        const distance = () =>
          Math.max(0, track.scrollWidth - window.innerWidth)

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) =>
              setActive(Math.round(self.progress * (count - 1))),
          },
        })

        tweenRef.current = tween

        return () => {
          tweenRef.current = null
        }
      })

      media.add("(max-width: 767.98px)", () => {
        const onScroll = () => {
          const max = track.scrollWidth - track.clientWidth
          setActive(
            max > 0 ? Math.round((track.scrollLeft / max) * (count - 1)) : 0
          )
        }

        track.addEventListener("scroll", onScroll, { passive: true })

        return () => track.removeEventListener("scroll", onScroll)
      })

      return () => media.revert()
    },
    { scope: sectionRef, dependencies: [count] }
  )

  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.min(Math.max(index, 0), count - 1)
      const track = trackRef.current
      const section = sectionRef.current
      if (!track || !section) return

      if (window.matchMedia("(min-width: 768px)").matches) {
        const trigger = tweenRef.current?.scrollTrigger
        if (!trigger) return

        const distance = Math.max(0, track.scrollWidth - window.innerWidth)
        const ratio = count > 1 ? clamped / (count - 1) : 0

        scrollToY(trigger.start + distance * ratio)
        return
      }

      const step = track.clientWidth * 0.82
      track.scrollTo({ left: clamped * step, behavior: "smooth" })
    },
    [count]
  )

  const onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
    event.preventDefault()
    setActive((current) => {
      const next =
        event.key === "ArrowRight"
          ? Math.min(current + 1, count - 1)
          : Math.max(current - 1, 0)
      goTo(next)
      return next
    })
  }

  if (!count) return null

  return (
    <section
      ref={sectionRef}
      tabIndex={single ? undefined : 0}
      onKeyDown={onKeyDown}
      aria-roledescription={single ? undefined : "carousel"}
      aria-label={`${name} gallery`}
      className="relative mt-16 md:mt-24"
    >
      <div
        className={cn(
          "flex flex-col justify-center md:h-svh md:overflow-hidden",
          single && "py-4"
        )}
      >
        <div className="flex items-baseline justify-between border-b border-border px-6 pb-3">
          <span className="font-mono text-[0.625rem] tracking-widest text-muted-foreground uppercase">
            Gallery — {name}
          </span>
          <span className="font-mono text-[0.625rem] tracking-widest text-muted-foreground uppercase">
            <span className="text-primary tabular-nums">
              {String(active + 1).padStart(2, "0")}
            </span>
            {" / "}
            {String(count).padStart(2, "0")}
          </span>
        </div>

        <div
          ref={trackRef}
          className={cn(
            "flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 py-6 md:gap-10 md:overflow-visible md:px-[7vw] md:py-10",
            single && "md:justify-center"
          )}
        >
          {images.map((src, index) => (
            <figure
              key={src}
              className="w-[86vw] shrink-0 snap-center md:w-[78vw] md:max-w-[1180px]"
            >
              <div
                className={cn(
                  "relative aspect-[5/3] overflow-hidden bg-muted transition-[outline-offset] duration-500",
                  index === active &&
                    !single &&
                    "outline outline-1 outline-offset-4 outline-primary"
                )}
              >
                <Image
                  src={src}
                  alt={alts?.[index] ?? `${name} — screen ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 86vw, 78vw"
                  className="object-cover"
                />
              </div>

              <figcaption className="mt-4 flex items-baseline gap-3 font-mono text-[0.625rem] tracking-widest text-muted-foreground uppercase md:px-8">
                <span className="text-primary tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="truncate">{alts?.[index] ?? name}</span>
              </figcaption>
            </figure>
          ))}
        </div>

        {!single ? (
          <div className="flex items-center justify-between gap-6 border-t border-border px-6 py-4">
            <div className="flex items-center gap-2">
              {images.map((src, index) => (
                <button
                  key={src}
                  type="button"
                  data-cursor-pointer
                  onClick={() => goTo(index)}
                  aria-label={`Frame ${index + 1}`}
                  aria-current={index === active}
                  className={cn(
                    "h-px w-8 transition-colors duration-300 md:w-12",
                    index === active
                      ? "bg-primary"
                      : "bg-border hover:bg-foreground/40"
                  )}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                data-cursor-pointer
                onClick={() => goTo(active - 1)}
                disabled={active === 0}
                aria-label="Previous frame"
                className="flex size-9 items-center justify-center border border-border transition-colors duration-300 hover:bg-foreground hover:text-background disabled:pointer-events-none disabled:opacity-30"
              >
                <ChevronLeft aria-hidden className="size-4" />
              </button>
              <button
                type="button"
                data-cursor-pointer
                onClick={() => goTo(active + 1)}
                disabled={active === count - 1}
                aria-label="Next frame"
                className="flex size-9 items-center justify-center border border-border transition-colors duration-300 hover:bg-foreground hover:text-background disabled:pointer-events-none disabled:opacity-30"
              >
                <ChevronRight aria-hidden className="size-4" />
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  )
}
