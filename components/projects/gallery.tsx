"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

type Drag = { startX: number; startLeft: number; moved: boolean } | null

export function Gallery({
  images,
  alts,
  name,
  className,
}: {
  images: string[]
  alts?: (string | undefined)[]
  name: string
  className?: string
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef<Drag>(null)

  const [active, setActive] = useState(0)
  const count = images.length
  const single = count < 2

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const onScroll = () => {
      const max = track.scrollWidth - track.clientWidth
      if (max <= 0) return
      setActive(
        Math.round(
          Math.min(1, Math.max(0, track.scrollLeft / max)) * (count - 1)
        )
      )
    }

    track.addEventListener("scroll", onScroll, { passive: true })

    return () => track.removeEventListener("scroll", onScroll)
  }, [count])

  const goTo = useCallback((index: number) => {
    const track = trackRef.current
    if (!track) return

    const item = track.children[index] as HTMLElement | undefined
    if (!item) return

    const max = Math.max(0, track.scrollWidth - track.clientWidth)
    const left = Math.min(
      Math.max(0, item.offsetLeft - (track.clientWidth - item.clientWidth) / 2),
      max
    )

    track.scrollTo({ left, behavior: "smooth" })
  }, [])

  const move = useCallback(
    (step: number) => {
      const next = Math.min(Math.max(active + step, 0), count - 1)

      setActive(next)
      goTo(next)
    },
    [active, count, goTo]
  )

  const onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return
    event.preventDefault()

    move(event.key === "ArrowRight" ? 1 : -1)
  }

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return

    const track = trackRef.current
    if (!track) return

    dragRef.current = {
      startX: event.clientX,
      startLeft: track.scrollLeft,
      moved: false,
    }

    track.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    const track = trackRef.current
    if (!drag || !track) return

    const delta = event.clientX - drag.startX

    if (Math.abs(delta) > 4) drag.moved = true
    if (!drag.moved) return

    track.scrollLeft = drag.startLeft - delta
  }

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current
    if (track?.hasPointerCapture(event.pointerId)) {
      track.releasePointerCapture(event.pointerId)
    }

    dragRef.current = null
  }

  if (!count) return null

  return (
    <section
      tabIndex={single ? undefined : 0}
      onKeyDown={onKeyDown}
      aria-roledescription={single ? undefined : "carousel"}
      aria-label={`${name} gallery`}
      className={cn("min-w-0", className)}
    >
      <div className="flex items-baseline justify-between border-b border-border pb-3">
        <span className="font-mono text-[0.625rem] tracking-widest text-muted-foreground uppercase">
          Gallery — {name}
        </span>
        <span className="font-mono text-[0.625rem] tracking-widest uppercase">
          <span className="text-primary tabular-nums">
            {String(active + 1).padStart(2, "0")}
          </span>
          <span className="text-muted-foreground">
            {" / "}
            {String(count).padStart(2, "0")}
          </span>
        </span>
      </div>

      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        className={cn(
          "relative flex snap-x snap-proximity gap-4 overflow-x-auto py-6 select-none",
          "scrollbar-none [&::-webkit-scrollbar]:hidden",
          "md:gap-8 md:py-8",
          single && "justify-center"
        )}
      >
        {images.map((src, index) => (
          <figure
            key={src}
            className={cn(
              "w-[82%] shrink-0 snap-center sm:w-[68%] md:w-140 lg:w-160",
              single && "w-full max-w-160"
            )}
          >
            <div
              className={cn(
                "relative aspect-5/3 overflow-hidden bg-muted transition-[outline-offset] duration-500",
                index === active &&
                  !single &&
                  "outline outline-offset-4 outline-primary"
              )}
            >
              <Image
                src={src}
                alt={alts?.[index] ?? `${name} — screen ${index + 1}`}
                fill
                sizes="(max-width: 768px) 82vw, 640px"
                draggable={false}
                className="object-cover"
              />
            </div>

            <figcaption className="mt-3 flex items-baseline gap-3 font-mono text-[0.625rem] tracking-widest text-muted-foreground uppercase">
              <span className="text-primary tabular-nums">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="truncate">{alts?.[index] ?? name}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      {!single ? (
        <div className="flex items-center justify-between gap-6 border-t border-border pt-4">
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
              onClick={() => move(-1)}
              disabled={active === 0}
              aria-label="Previous frame"
              className="flex size-9 items-center justify-center border border-border transition-colors duration-300 hover:bg-foreground hover:text-background disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronLeft aria-hidden className="size-4" />
            </button>
            <button
              type="button"
              data-cursor-pointer
              onClick={() => move(1)}
              disabled={active === count - 1}
              aria-label="Next frame"
              className="flex size-9 items-center justify-center border border-border transition-colors duration-300 hover:bg-foreground hover:text-background disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronRight aria-hidden className="size-4" />
            </button>
          </div>
        </div>
      ) : null}
    </section>
  )
}
