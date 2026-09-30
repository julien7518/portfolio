"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"

import { gsap } from "@/lib/gsap"

export function ScrollProgress({ target }: { target?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.to(ref.current, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: target ?? document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.3,
      },
    })
  }, [])

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-40 h-px bg-border">
      <div ref={ref} className="h-full origin-left scale-x-0 bg-primary" />
    </div>
  )
}
