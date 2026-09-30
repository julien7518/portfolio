"use client"

import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

const SENTINEL = "#010203"
const FALLBACK = "#8a8a8a"
const POINTER_RADIUS = 150
const POINTER_FORCE = 0.045
const LINK_DISTANCE = 168
const LINK_ALPHA = 0.16

type Node = {
  x: number
  y: number
  vx: number
  vy: number
  r: number
}

export function AmbientCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const context = canvas.getContext("2d", { alpha: true })

    if (!context) return

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)")

    let width = 0
    let height = 0
    let ratio = 1
    let nodes: Node[] = []
    let stroke = FALLBACK
    let frame = 0
    let running = true

    const pointer = { x: -9999, y: -9999, active: false }

    const resolveStroke = () => {
      const raw = getComputedStyle(document.documentElement)
        .getPropertyValue("--foreground")
        .trim()

      context.fillStyle = SENTINEL
      context.fillStyle = raw || FALLBACK
      stroke = context.fillStyle === SENTINEL ? FALLBACK : context.fillStyle
    }

    const seed = () => {
      const area = width * height
      const count = Math.round(Math.min(72, Math.max(26, area / 26000)))

      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.16,
        vy: (Math.random() - 0.5) * 0.16,
        r: Math.random() * 1.4 + 0.5,
      }))
    }

    const resize = () => {
      ratio = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = Math.round(width * ratio)
      canvas.height = Math.round(height * ratio)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      seed()
    }

    const draw = () => {
      if (!running) return
      frame = requestAnimationFrame(draw)

      context.clearRect(0, 0, width, height)
      context.globalAlpha = 1
      context.lineWidth = 1
      context.strokeStyle = stroke

      for (const node of nodes) {
        if (pointer.active) {
          const dx = node.x - pointer.x
          const dy = node.y - pointer.y
          const distance = Math.hypot(dx, dy)

          if (distance < POINTER_RADIUS && distance > 0.01) {
            const pull = (1 - distance / POINTER_RADIUS) * POINTER_FORCE
            node.vx += (dx / distance) * pull
            node.vy += (dy / distance) * pull
          }
        }

        node.vx *= 0.985
        node.vy *= 0.985
        node.x += node.vx
        node.y += node.vy

        if (node.x < -20) node.x = width + 20
        if (node.x > width + 20) node.x = -20
        if (node.y < -20) node.y = height + 20
        if (node.y > height + 20) node.y = -20
      }

      context.beginPath()
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i]
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const distance = Math.hypot(dx, dy)

          if (distance > LINK_DISTANCE) continue

          context.globalAlpha = LINK_ALPHA * (1 - distance / LINK_DISTANCE)
          context.moveTo(a.x, a.y)
          context.lineTo(b.x, b.y)
        }
      }
      context.stroke()

      context.globalAlpha = LINK_ALPHA * 1.8
      context.beginPath()
      for (const node of nodes) {
        context.moveTo(node.x + node.r, node.y)
        context.arc(node.x, node.y, node.r, 0, Math.PI * 2)
      }
      context.stroke()
    }

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX
      pointer.y = event.clientY
      pointer.active = true
    }

    const onPointerLeave = () => {
      pointer.active = false
    }

    const onVisibility = () => {
      running = document.visibilityState === "visible"
    }

    resolveStroke()
    resize()
    if (!reduced.matches) draw()

    const observer = new MutationObserver(resolveStroke)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    })

    const onReducedChange = () => {
      if (reduced.matches) {
        cancelAnimationFrame(frame)
        context.clearRect(0, 0, width, height)
      }
    }

    window.addEventListener("resize", resize)
    window.addEventListener("pointermove", onPointerMove, { passive: true })
    window.addEventListener("pointerleave", onPointerLeave)
    document.addEventListener("visibilitychange", onVisibility)
    reduced.addEventListener("change", onReducedChange)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener("resize", resize)
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerleave", onPointerLeave)
      document.removeEventListener("visibilitychange", onVisibility)
      reduced.removeEventListener("change", onReducedChange)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0 z-0 opacity-70",
        className
      )}
    />
  )
}
