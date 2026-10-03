"use client"

import { useEffect, useRef } from "react"

/**
 * A very fine grid of squares that behaves like a soft surface around the
 * pointer. The resting grid is baked into a canvas pattern once per resize,
 * so a frame costs one clear, one pattern fill, and a bounded number of
 * displaced cells — cells are pooled in flat typed arrays, never allocated
 * per frame, and the count is capped regardless of viewport size.
 */

const SPACING = 26
const DOT = 2.5

/** Radius within which the pointer pushes on the surface. */
const PUSH_RADIUS = 150
/** Cells stay drawn and settle a little further out, which reads as a trail. */
const DRAW_RADIUS = PUSH_RADIUS * 1.35

const MAX_OFFSET = 9
const MAX_DPR = 2

/** ~3x the cells a full field holds, so a trail never starves the pool. */
const POOL_SIZE = 420

const SEED_SPREAD = 5
const PUSH_STRENGTH = 26
const SPRING = 60
const DAMPING = 9
const COOLING = 1.6

const REST_EPSILON = 0.002
const SETTLED_OFFSET = 0.15
const SETTLED_VELOCITY = 0.5

const WARM_SECTORS = "--border"
const HOT_COLOUR = "--primary"

function colourOf(variable: string, fallback: string) {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim()

  return value || fallback
}

export function HeroGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const host = canvas.parentElement
    const context = canvas.getContext("2d")
    if (!host || !context) return

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    const pointerQuery = window.matchMedia("(hover: hover) and (pointer: fine)")
    const interactive = !motionQuery.matches && pointerQuery.matches

    let width = 0
    let height = 0
    let pixelRatio = 1
    let columns = 0
    let rows = 0

    let pattern: CanvasPattern | null = null
    let hot = colourOf(HOT_COLOUR, "#c2410c")

    let frame = 0
    let last = 0
    let pageVisible = true
    let heroVisible = true
    let tracking = false

    const pointer = { x: 0, y: 0 }

    // Pooled per-cell state. Parallel arrays keyed by a slot index, so the
    // simulation never touches the allocator.
    const cellX = new Float32Array(POOL_SIZE)
    const cellY = new Float32Array(POOL_SIZE)
    const offsetX = new Float32Array(POOL_SIZE)
    const offsetY = new Float32Array(POOL_SIZE)
    const velocityX = new Float32Array(POOL_SIZE)
    const velocityY = new Float32Array(POOL_SIZE)
    const heat = new Float32Array(POOL_SIZE)

    /** Grid key -> slot. */
    const occupied = new Map<number, number>()
    /** Slots not currently in use, so eviction can hand them back. */
    const released: number[] = []
    let poolUsed = 0

    const claim = (key: number, column: number, row: number) => {
      const reused = released.pop()

      if (reused !== undefined) {
        occupied.set(key, reused)
        cellX[reused] = column * SPACING
        cellY[reused] = row * SPACING
        return reused
      }

      if (poolUsed >= POOL_SIZE) return -1

      const slot = poolUsed++
      occupied.set(key, slot)
      cellX[slot] = column * SPACING
      cellY[slot] = row * SPACING

      return slot
    }

    const release = (key: number, slot: number) => {
      occupied.delete(key)
      released.push(slot)

      offsetX[slot] = 0
      offsetY[slot] = 0
      velocityX[slot] = 0
      velocityY[slot] = 0
      heat[slot] = 0
    }

    const keyAt = (column: number, row: number) => row * columns + column

    const resetPool = () => {
      occupied.clear()
      released.length = 0
      poolUsed = 0

      offsetX.fill(0)
      offsetY.fill(0)
      velocityX.fill(0)
      velocityY.fill(0)
      heat.fill(0)
    }

    const buildPattern = () => {
      const size = Math.max(1, Math.round(SPACING * pixelRatio))
      const tile = document.createElement("canvas")

      tile.width = size
      tile.height = size

      const tileContext = tile.getContext("2d")
      if (!tileContext) return

      const dot = DOT * pixelRatio

      tileContext.fillStyle = colourOf(WARM_SECTORS, "#e7e5e4")
      tileContext.fillRect((size - dot) / 2, (size - dot) / 2, dot, dot)

      pattern = context.createPattern(tile, "repeat")
    }

    const paint = () => {
      context.clearRect(0, 0, canvas.width, canvas.height)
      if (!pattern) return

      context.fillStyle = pattern
      context.fillRect(0, 0, canvas.width, canvas.height)

      if (occupied.size === 0) return

      const dot = DOT * pixelRatio
      const reach = DRAW_RADIUS

      context.fillStyle = hot

      for (const [key, slot] of occupied) {
        const distance = Math.hypot(
          (cellX[slot] - pointer.x) * pixelRatio,
          (cellY[slot] - pointer.y) * pixelRatio
        )

        if (distance > reach) continue

        // Squared falloff keeps the influence local and the edge soft.
        const falloff = 1 - distance / reach
        const strength = falloff * falloff * heat[slot]

        if (strength < REST_EPSILON) continue

        const size = dot * (1 + strength * 1.6)
        const x = (cellX[slot] + offsetX[slot]) * pixelRatio
        const y = (cellY[slot] + offsetY[slot]) * pixelRatio
        const shear = strength * 3

        context.globalAlpha = Math.min(1, strength * 1.1) * 0.9

        // A sheared square reads as a soft surface giving way, and avoids
        // saving and restoring a transform for every cell.
        context.beginPath()
        context.moveTo(x - size / 2, y - size / 2)
        context.lineTo(x + size / 2, y - size / 2 + shear)
        context.lineTo(x + size / 2, y + size / 2)
        context.lineTo(x - size / 2, y + size / 2 - shear)
        context.closePath()
        context.fill()

        if (strength < REST_EPSILON && distance > PUSH_RADIUS * pixelRatio) {
          release(key, slot)
        }
      }

      context.globalAlpha = 1
    }

    const step = (delta: number) => {
      const damping = Math.exp(-DAMPING * delta)
      const cooling = Math.exp(-COOLING * delta)
      const pushReach = PUSH_RADIUS

      for (const [key, slot] of occupied) {
        const dx = pointer.x - cellX[slot]
        const dy = pointer.y - cellY[slot]
        const distance = Math.hypot(dx, dy)

        if (distance < pushReach) {
          const falloff = 1 - distance / pushReach
          const push = falloff * falloff

          if (push > heat[slot]) heat[slot] = push

          const inverse = distance > 0.001 ? 1 / distance : 0

          // Pushed outward, so neighbours open up instead of clumping.
          velocityX[slot] += dx * inverse * push * PUSH_STRENGTH * delta
          velocityY[slot] += dy * inverse * push * PUSH_STRENGTH * delta
        }

        // Spring back to rest: this is the inertia and the trail.
        velocityX[slot] -= offsetX[slot] * SPRING * delta
        velocityY[slot] -= offsetY[slot] * SPRING * delta

        velocityX[slot] *= damping
        velocityY[slot] *= damping

        offsetX[slot] += velocityX[slot] * delta
        offsetY[slot] += velocityY[slot] * delta

        const offset = Math.hypot(offsetX[slot], offsetY[slot])

        if (offset > MAX_OFFSET) {
          offsetX[slot] *= MAX_OFFSET / offset
          offsetY[slot] *= MAX_OFFSET / offset
        }

        heat[slot] *= cooling

        // Recycle only once a cell has come to rest well outside the field,
        // otherwise the pool would drain mid-gesture and the grid would
        // stop responding under a slow drag.
        if (
          distance > pushReach &&
          heat[slot] < REST_EPSILON &&
          Math.abs(offsetX[slot]) < SETTLED_OFFSET &&
          Math.abs(offsetY[slot]) < SETTLED_OFFSET &&
          Math.abs(velocityX[slot]) < SETTLED_VELOCITY &&
          Math.abs(velocityY[slot]) < SETTLED_VELOCITY
        ) {
          release(key, slot)
        }
      }
    }

    const tick = (now: number) => {
      frame = 0

      const delta = Math.min((now - last) / 1000, 1 / 30)
      last = now

      step(delta)
      paint()

      if (pageVisible && heroVisible) frame = requestAnimationFrame(tick)
    }

    const start = () => {
      if (frame) return

      last = performance.now()
      frame = requestAnimationFrame(tick)
    }

    const occupy = (column: number, row: number) => {
      if (column < 0 || row < 0 || column >= columns || row >= rows) return

      const key = keyAt(column, row)

      if (!occupied.has(key)) claim(key, column, row)
    }

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return

      const rect = host.getBoundingClientRect()

      pointer.x = event.clientX - rect.left
      pointer.y = event.clientY - rect.top

      const column = Math.floor(pointer.x / SPACING)
      const row = Math.floor(pointer.y / SPACING)

      if (!tracking) {
        tracking = true

        // Seed the field around the cursor on first contact, so the surface
        // responds where the pointer already is rather than trailing it.
        const half = Math.ceil(SEED_SPREAD / 2)

        for (let r = row - half; r <= row + half; r++) {
          for (let c = column - half; c <= column + half; c++) occupy(c, r)
        }
      }

      const reach = Math.ceil(PUSH_RADIUS / SPACING)

      for (let r = row - reach; r <= row + reach; r++) {
        for (let c = column - reach; c <= column + reach; c++) occupy(c, r)
      }

      start()
    }

    const onPointerLeave = () => {
      tracking = false
    }

    const resize = () => {
      const rect = host.getBoundingClientRect()

      width = rect.width
      height = rect.height
      pixelRatio = Math.min(window.devicePixelRatio || 1, MAX_DPR)

      canvas.width = Math.max(1, Math.round(width * pixelRatio))
      canvas.height = Math.max(1, Math.round(height * pixelRatio))

      columns = Math.ceil(width / SPACING) + 1
      rows = Math.ceil(height / SPACING) + 1

      resetPool()
      buildPattern()
      paint()
    }

    const onResize = () => resize()

    const onVisibilityChange = () => {
      pageVisible = document.visibilityState === "visible"
      if (pageVisible && tracking) start()
    }

    // Honour a mid-session change of preference, such as reduced motion being
    // switched on in the OS while the page is open.
    const onPreferenceChange = () => {
      if (motionQuery.matches || !pointerQuery.matches) {
        if (frame) cancelAnimationFrame(frame)
        frame = 0
        tracking = false
        resetPool()
        paint()
        return
      }

      host.addEventListener("pointermove", onPointerMove, { passive: true })
      host.addEventListener("pointerleave", onPointerLeave, { passive: true })
    }

    const resizeObserver = new ResizeObserver(onResize)
    resizeObserver.observe(host)

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        heroVisible = entry.isIntersecting
        if (heroVisible && tracking && pageVisible) start()
      },
      { threshold: 0 }
    )
    intersectionObserver.observe(host)

    // next-themes toggles a class on <html>; repaint when the palette flips so
    // the resting grid and the accent both follow the theme.
    const themeObserver = new MutationObserver(() => {
      hot = colourOf(HOT_COLOUR, "#c2410c")
      buildPattern()
      paint()
    })
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    document.addEventListener("visibilitychange", onVisibilityChange)
    motionQuery.addEventListener("change", onPreferenceChange)
    pointerQuery.addEventListener("change", onPreferenceChange)

    if (interactive) {
      host.addEventListener("pointermove", onPointerMove, { passive: true })
      host.addEventListener("pointerleave", onPointerLeave, { passive: true })
    }

    resize()

    return () => {
      if (frame) cancelAnimationFrame(frame)

      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      themeObserver.disconnect()

      document.removeEventListener("visibilitychange", onVisibilityChange)
      host.removeEventListener("pointermove", onPointerMove)
      host.removeEventListener("pointerleave", onPointerLeave)

      motionQuery.removeEventListener("change", onPreferenceChange)
      pointerQuery.removeEventListener("change", onPreferenceChange)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      // Dissolve into the page instead of stopping at the section edge.
      style={{
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, black 16%, black 58%, transparent 100%)",
        maskImage:
          "linear-gradient(to bottom, transparent 0%, black 16%, black 58%, transparent 100%)",
      }}
      className="pointer-events-none absolute inset-0 size-full opacity-70"
    />
  )
}
