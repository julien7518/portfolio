"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { useGSAP } from "@gsap/react"

import { gsap, ScrollTrigger } from "@/lib/gsap"
import { Parallax } from "@/components/ui/parallax"
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
  const scopeRef = useRef<HTMLDivElement>(null)
  const frameRefs = useRef<(HTMLElement | null)[]>([])
  const [active, setActive] = useState(0)
  const [inView, setInView] = useState(false)

  useGSAP(
    () => {
      if (!images.length) return

      ScrollTrigger.create({
        trigger: scopeRef.current,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => setInView(self.isActive),
      })

      frameRefs.current.forEach((frame, index) => {
        if (!frame) return

        ScrollTrigger.create({
          trigger: frame,
          start: "top 58%",
          end: "bottom 42%",
          onToggle: (self) => {
            if (self.isActive) setActive(index)
          },
        })

        gsap.from(frame, {
          clipPath: "inset(0% 0% 100% 0%)",
          duration: 1.2,
          ease: "power4.out",
          scrollTrigger: { trigger: frame, start: "top 85%", once: true },
        })
      })
    },
    { scope: scopeRef, dependencies: [images] }
  )

  if (!images.length) return null

  return (
    <div ref={scopeRef} className="mt-16 md:mt-24">
      <div className="mb-6 flex items-baseline justify-between border-b border-border pb-3">
        <span className="font-mono text-[0.625rem] tracking-widest text-muted-foreground uppercase">
          Gallery — {name}
        </span>
        <span className="font-mono text-[0.625rem] tracking-widest text-muted-foreground uppercase">
          {String(images.length).padStart(2, "0")} frames
        </span>
      </div>

      <div className="space-y-10 md:space-y-20">
        {images.map((src, index) => (
          <figure
            key={src}
            ref={(node) => {
              frameRefs.current[index] = node
            }}
            className="group/gallery"
          >
            <div className="relative aspect-[5/3] overflow-hidden bg-muted">
              <Parallax
                className="absolute inset-0"
                amount={index % 2 === 0 ? 7 : -7}
                scale={1.2}
              >
                <Image
                  src={src}
                  alt={alts?.[index] ?? `${name} — screen ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 68vw"
                  className="object-cover transition-transform duration-1000 ease-out group-hover/gallery:scale-[1.04]"
                />
              </Parallax>
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

      <div
        aria-hidden
        className={cn(
          "pointer-events-none fixed bottom-6 left-6 z-40 font-mono text-xs tracking-widest text-white uppercase tabular-nums mix-blend-difference transition-opacity duration-500",
          inView ? "opacity-100" : "opacity-0"
        )}
      >
        <span className="text-primary tabular-nums">
          {String(active + 1).padStart(2, "0")}
        </span>
        <span className="opacity-60">
          {" / "}
          {String(images.length).padStart(2, "0")}
        </span>
      </div>
    </div>
  )
}
