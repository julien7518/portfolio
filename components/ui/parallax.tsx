"use client"

import { useRef, type ReactNode } from "react"
import { useGSAP } from "@gsap/react"

import { gsap } from "@/lib/gsap"
import { cn } from "@/lib/utils"

export function Parallax({
  children,
  className,
  amount = 8,
  scale = 1.15,
  start = "top bottom",
  end = "bottom top",
}: {
  children: ReactNode
  className?: string
  amount?: number
  scale?: number
  start?: string
  end?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      gsap.fromTo(
        ref.current,
        { yPercent: -amount, scale },
        {
          yPercent: amount,
          ease: "none",
          scrollTrigger: { trigger: ref.current, start, end, scrub: true },
        }
      )
    },
    { scope: ref, dependencies: [amount, scale, start, end] }
  )

  return (
    <div ref={ref} className={cn("will-change-transform", className)}>
      {children}
    </div>
  )
}
