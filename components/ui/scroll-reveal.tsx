"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

export function ScrollReveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transitionDelay = `${delay}ms`
          el.classList.add("animate-scroll-reveal")
          observer.unobserve(el)
        }
      },
      { threshold: 0.5, rootMargin: "0px 0px -40px 0px" }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [delay])

  return (
    <div ref={ref} className={cn("scroll-reveal-initial", className)}>
      {children}
    </div>
  )
}
