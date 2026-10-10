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
            root.querySelectorAll<SVGPathElement>(
              mobile ? "[data-mobile-connection]" : "[data-connection]"
            )
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

          gsap.set(connections, { opacity: 0.12 })
          gsap.set(labels, { opacity: 0 })
          const length = route.getTotalLength()
          const start = route.getPointAtLength(0)
          gsap.set(signal, { attr: { cx: start.x, cy: start.y } })
          const current = { progress: 0 }

          // Keep the scroll animation intact on refresh. Only its measured
          // chapter thresholds change; geometry always derives from fixed homes.
          const windows = chapters.map(() => ({ start: 0, connection: 0 }))
          let labelsStart = 0
          let labelsEnd = 0
          const clamp = gsap.utils.clamp(0, 1)
          const connectionSetters = connections.map((line) =>
            gsap.quickSetter(line, "opacity")
          )
          const setLabels = gsap.quickSetter(labels, "opacity")
          const measure = () => {
            const span = Math.max(1, root.offsetHeight - window.innerHeight)
            const rootTop = root.getBoundingClientRect().top
            const at = (element: HTMLElement) =>
              clamp(
                (element.getBoundingClientRect().top -
                  rootTop -
                  window.innerHeight * 0.4) /
                  span
              )
            labelsStart = at(root.querySelector<HTMLElement>('[data-act="1"]')!)
            labelsEnd = at(chapters[0])
            chapters.forEach((chapter, i) => {
              const position = Math.min(0.9, at(chapter))
              windows[i] = {
                start: Math.max(0, position - 0.025),
                connection: position,
              }
            })
          }
          const render = (progress: number) => {
            pieces.forEach((piece, i) => {
              const remaining = 1 - clamp((progress - windows[i].start) / 0.075)
              const x = (mobile ? (i % 2 ? -8 : 8) : PARTS[i].dx) * remaining
              const y = (mobile ? 0 : PARTS[i].dy) * remaining
              const angle = (mobile ? 0 : PARTS[i].angle) * remaining
              const origin = mobile
                ? `56 ${80 + i * 80}`
                : `${PARTS[i].x} ${PARTS[i].y}`
              // Native SVG transforms avoid cached origin compensation after
              // refresh. At assembly, every part has the exact identity transform.
              piece.setAttribute(
                "transform",
                `translate(${x} ${y}) rotate(${angle} ${origin})`
              )
              connectionSetters[i](
                0.12 + 0.88 * clamp((progress - windows[i].connection) / 0.055)
              )
            })
            setLabels(
              clamp((progress - labelsStart) / 0.04) *
                (1 - clamp((progress - labelsEnd) / 0.05))
            )
            const point = route.getPointAtLength(clamp(progress) * length)
            signal.setAttribute("cx", String(point.x))
            signal.setAttribute("cy", String(point.y))
          }
          measure()
          render(0)
          const animation = gsap.fromTo(
            current,
            { progress: 0 },
            {
              progress: 1,
              duration: 1,
              ease: "none",
              paused: true,
              onUpdate: () => render(current.progress),
            }
          )
          const trigger = ScrollTrigger.create({
            trigger: root,
            start: "top top",
            end: "bottom bottom",
            animation,
            scrub: 0.4,
            onRefresh: (self) => {
              measure()
              animation.progress(self.progress)
              render(self.progress)
            },
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
            signal.setAttribute("cx", mobile ? "108" : "225")
            signal.setAttribute("cy", mobile ? "505" : "250")
            releases.forEach((release) =>
              release.style.removeProperty("opacity")
            )
            traces.forEach((trace) => trace.style.removeProperty("opacity"))
            pieces.forEach((piece) => piece.removeAttribute("transform"))
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
