"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

import { ScrollTrigger } from "@/lib/gsap"

export function SmoothScroll() {
  const pathname = usePathname()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" })

    const frame = requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => cancelAnimationFrame(frame)
  }, [pathname])

  return null
}

function scrollToY(target: number, immediate = false) {
  window.scrollTo({ top: target, behavior: immediate ? "auto" : "smooth" })
}

export function scrollToElement(element: HTMLElement, offset = 120) {
  const top = element.getBoundingClientRect().top + window.scrollY - offset

  scrollToY(Math.max(0, top), true)
}
