"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import Lenis from "lenis"

import { gsap, ScrollTrigger } from "@/lib/gsap"

import "lenis/dist/lenis.css"

let lenis: Lenis | null = null

export function SmoothScroll() {
  const pathname = usePathname()

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    lenis = new Lenis({
      lerp: 0.085,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
    })

    lenis.on("scroll", ScrollTrigger.update)

    const raf = (time: number) => lenis?.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    ScrollTrigger.refresh()

    return () => {
      gsap.ticker.remove(raf)
      lenis?.destroy()
      lenis = null
    }
  }, [])

  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true })

    const frame = requestAnimationFrame(() => ScrollTrigger.refresh())

    return () => cancelAnimationFrame(frame)
  }, [pathname])

  return null
}

export function scrollToY(target: number, immediate = false) {
  if (lenis) {
    lenis.scrollTo(target, { immediate })
    return
  }

  window.scrollTo({ top: target, behavior: immediate ? "auto" : "smooth" })
}
