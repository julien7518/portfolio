"use client"

import { useRef, type ReactNode } from "react"
import { useGSAP } from "@gsap/react"

import { gsap } from "@/lib/gsap"
import { cn } from "@/lib/utils"

type RevealProps = {
  children: ReactNode
  className?: string
  y?: number
  delay?: number
  duration?: number
  start?: string
  stagger?: number
}

export function Reveal({
  children,
  className,
  y = 26,
  delay = 0,
  duration = 0.9,
  start = "top 88%",
  stagger,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const targets = stagger
        ? ref.current!.querySelectorAll("[data-reveal-item]")
        : null

      gsap.from(targets ?? ref.current!, {
        autoAlpha: 0,
        y,
        duration,
        delay,
        stagger,
        ease: "power3.out",
        scrollTrigger: { trigger: ref.current!, start, once: true },
      })
    },
    { scope: ref, dependencies: [y, delay, duration, start, stagger] }
  )

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  )
}
