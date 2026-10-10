"use client"

import { useRef, type ReactNode } from "react"
import { useGSAP } from "@gsap/react"
import { gsap, ScrollTrigger } from "@/lib/gsap"
import { PARTS, SystemDiagram } from "./system-diagram"
import styles from "./about.module.css"

export function AboutExperience({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return
      const motion = gsap.matchMedia()
      motion.add(
        {
          allowMotion: "(prefers-reduced-motion: no-preference)",
          desktop: "(min-width: 768px)",
        },
        (context) => {
          if (!context.conditions?.allowMotion) return
          const mobile = !context.conditions?.desktop
          const pieces = Array.from(
            root.querySelectorAll<SVGGElement>(
              mobile ? "[data-mobile-part]" : "[data-system-part]"
            )
          )
          const connections = Array.from(
            root.querySelectorAll<SVGPathElement>("[data-connection]")
          )
          const chapters = Array.from(
            root.querySelectorAll<HTMLElement>("[data-version]")
          )
          const releases = Array.from(
            root.querySelectorAll<HTMLElement>("[data-release]")
          )
          const traces = Array.from(
            root.querySelectorAll<HTMLElement>("[data-trace]")
          )
          const route = root.querySelector<SVGPathElement>(
            mobile ? "[data-mobile-route]" : "[data-signal-route]"
          )
          const signal = root.querySelector<SVGCircleElement>(
            mobile ? "[data-mobile-signal]" : "[data-signal]"
          )
          const labels = root.querySelector("[data-part-labels]")
          if (!route || !signal) return

          pieces.forEach((piece, i) =>
            gsap.set(piece, {
              x: mobile ? (i % 2 ? -8 : 8) : PARTS[i].dx,
              y: mobile ? 0 : PARTS[i].dy,
              rotation: mobile ? 0 : PARTS[i].angle,
              svgOrigin: mobile ? "20 250" : `${PARTS[i].x} ${PARTS[i].y}`,
            })
          )
          gsap.set(connections, { opacity: 0.12 })
          gsap.set(labels, { opacity: 0 })
          const length = route.getTotalLength()
          const start = route.getPointAtLength(0)
          gsap.set(signal, { attr: { cx: start.x, cy: start.y } })
          const current = { progress: 0 }

          // One timeline for the entire page. Positions derive from the real copy,
          // so typography, viewport changes and reverse scrolling stay in sync.
          const timeline = gsap.timeline({
            paused: true,
            defaults: { ease: "none" },
          })
          const rebuild = () => {
            timeline.progress(0)
            timeline.clear()
            current.progress = 0
            const span = Math.max(1, root.offsetHeight - window.innerHeight)
            const at = (element: HTMLElement) =>
              Math.max(
                0,
                Math.min(
                  0.98,
                  (element.getBoundingClientRect().top -
                    root.getBoundingClientRect().top -
                    window.innerHeight * 0.4) /
                    span
                )
              )
            const beyond = root.querySelector<HTMLElement>('[data-act="1"]')!
            timeline.to(
              current,
              {
                progress: 1,
                duration: 1,
                onUpdate: () => {
                  const point = route.getPointAtLength(
                    current.progress * length
                  )
                  signal.setAttribute("cx", String(point.x))
                  signal.setAttribute("cy", String(point.y))
                },
              },
              0
            )
            timeline.to(labels, { opacity: 1, duration: 0.04 }, at(beyond))
            timeline.to(labels, { opacity: 0, duration: 0.05 }, at(chapters[0]))
            chapters.forEach((chapter, i) => {
              const position = at(chapter)
              timeline.to(
                pieces[i],
                { x: 0, y: 0, rotation: 0, duration: 0.075 },
                Math.max(0, position - 0.025)
              )
              timeline.to(
                connections[i],
                { opacity: 1, duration: 0.055 },
                position
              )
            })
          }
          rebuild()
          const trigger = ScrollTrigger.create({
            trigger: root,
            start: "top top",
            end: "bottom bottom",
            animation: timeline,
            scrub: 0.4,
            onRefreshInit: rebuild,
          })
          const releaseTriggers = chapters.map((chapter, i) =>
            ScrollTrigger.create({
              trigger: chapter,
              start: "top 55%",
              end: "bottom 55%",
              onToggle: (self) => {
                if (!self.isActive) return
                releases.forEach((release, j) =>
                  gsap.set(release, { opacity: i === j ? 1 : 0 })
                )
                traces.forEach((trace, j) =>
                  gsap.set(trace, { opacity: j <= i ? 1 : 0.25 })
                )
              },
            })
          )
          let disposed = false
          document.fonts.ready.then(() => {
            if (!disposed) ScrollTrigger.refresh()
          })
          return () => {
            disposed = true
            signal.setAttribute("cx", mobile ? "20" : "225")
            signal.setAttribute("cy", mobile ? "505" : "250")
            releases.forEach((release) =>
              release.style.removeProperty("opacity")
            )
            traces.forEach((trace) => trace.style.removeProperty("opacity"))
            trigger.kill()
            releaseTriggers.forEach((item) => item.kill())
          }
        }
      )
      return () => motion.revert()
    },
    { scope: rootRef }
  )

  return (
    <div ref={rootRef} className={styles.experience}>
      <SystemDiagram />
      <div className={styles.editorial}>{children}</div>
    </div>
  )
}
