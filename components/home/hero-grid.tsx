"use client"

import { useEffect, useRef } from "react"

/**
 * A very fine grid of squares that behaves like a soft surface around the
 * pointer.
 *
 * The resting grid is baked into a canvas pattern once per resize, so a frame
 * costs one clear, one pattern fill, and a bounded set of displaced cells.
 * What sells it as a surface rather than a field of dots is that the cells are
 * coupled: each one is pulled toward the average displacement of its four
 * neighbours, which turns a pile of independent springs into a membrane that
 * ripples. Cells live in flat typed arrays and are pooled, so the simulation
 * never allocates and the count stays capped whatever the viewport.
 */

const SPACING = 25
const DOT = 3

/** Radius within which the pointer pushes on the surface. */
const PUSH_RADIUS = 165
/** Cells stay simulated and settle out here, which reads as the trail. */
const DRAW_RADIUS = 215
/**
 * Hard ceiling on how far a cell may ever live from the pointer. Recycling at
 * rest alone is not a bound: a fast sweep drags a wake several hundred pixels
 * long, the wake is still in motion when the pointer has moved on, and the
 * pool drains until nothing new can be claimed. Dropping anything past this
 * is invisible, because painting already culls at DRAW_RADIUS.
 */
const HARD_RADIUS = 250

const MAX_OFFSET = 16
const MAX_DPR = 2
/**
 * Above the ~440 cells a full spawn square plus its wake can occupy, so the
 * hard ceiling is what actually bounds residency, not this number.
 */
const POOL_SIZE = 560

/** Accelerations, in px per second squared. */
const REPEL = 1000
const CURL = 240
/** How hard the pointer's own motion drags the surface along with it. */
const DRAG = 1.4
/** Membrane tension: pull toward the average displacement of the neighbours. */
const COUPLE = 5.2
/** Pull back to rest. */
const SPRING = 58
/** Low enough to stay underdamped, so the surface wobbles instead of easing. */
const DAMPING = 5.2
/** Glow decay, decoupled from position, so the trail outlives the movement. */
const COOLING = 1.5
/** How fast the pointer's own velocity fades once it stops. */
const DRAG_DECAY = 12

const SPIN_RATE = 3.2
const SPIN_DECAY = 3.6
const MAX_SPIN = 1.15

const SCALE_GAIN = 1.5
const ALPHA_GAIN = 1.1
const PEAK_ALPHA = 1

const REST_EPSILON = 0.004
const SETTLED_OFFSET = 0.12
const SETTLED_VELOCITY = 0.4

const MAX_POINTER_SPEED = 1600

const REST_VARIABLE = "--muted-foreground"
const REST_ALPHA = 0.28
const HOT_VARIABLE = "--primary"

function clamp(value: number, min: number, max: number) {
  return value < min ? min : value > max ? max : value
}

function colourOf(variable: string, fallback: string) {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim()

  return value || fallback
}

/** Stable per-cell randomness, so the surface is never perfectly uniform. */
function noiseAt(column: number, row: number) {
  const n = Math.sin(column * 12.9898 + row * 78.233) * 43758.5453

  return n - Math.floor(n)
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
    let hot = colourOf(HOT_VARIABLE, "#c2410c")

    let frame = 0
    let last = 0
    let pageVisible = true
    let heroVisible = true
    let tracking = false

    const pointer = { x: 0, y: 0, vx: 0, vy: 0 }
    let previousX = 0
    let previousY = 0
    let previousAt = 0

    // Pooled per-cell state, parallel arrays keyed by slot.
    const offsetX = new Float32Array(POOL_SIZE)
    const offsetY = new Float32Array(POOL_SIZE)
    const velocityX = new Float32Array(POOL_SIZE)
    const velocityY = new Float32Array(POOL_SIZE)
    const heat = new Float32Array(POOL_SIZE)
    const spin = new Float32Array(POOL_SIZE)
    const bias = new Float32Array(POOL_SIZE)
    const phase = new Float32Array(POOL_SIZE)

    /** Grid key -> slot. */
    const occupied = new Map<number, number>()
    /** Slots not currently in use, so eviction can hand them back. */
    const released: number[] = []
    let poolUsed = 0

    const keyAt = (column: number, row: number) => row * columns + column

    // Last resort if the pool is somehow dry: drop the cell furthest from the
    // pointer rather than refusing the claim, so the field degrades instead of
    // going inert in a region the pointer has just reached.
    const evictFarthest = () => {
      let worstKey = -1
      let worstSlot = -1
      let worstDistance = -1

      for (const [candidate, slot] of occupied) {
        const column = candidate % columns
        const row = (candidate - column) / columns
        const dx = pointer.x - (column + 0.5) * SPACING
        const dy = pointer.y - (row + 0.5) * SPACING
        const distance = dx * dx + dy * dy

        if (distance > worstDistance) {
          worstDistance = distance
          worstKey = candidate
          worstSlot = slot
        }
      }

      if (worstSlot !== -1) {
        occupied.delete(worstKey)
        released.push(worstSlot)

        offsetX[worstSlot] = 0
        offsetY[worstSlot] = 0
        velocityX[worstSlot] = 0
        velocityY[worstSlot] = 0
        heat[worstSlot] = 0
        spin[worstSlot] = 0
      }
    }

    const claim = (key: number, column: number, row: number) => {
      const noise = noiseAt(column, row)
      let slot = released.pop()

      if (slot === undefined) {
        if (poolUsed >= POOL_SIZE) {
          evictFarthest()
          slot = released.pop()
        }

        if (slot === undefined) {
          // Only bail once the pool is genuinely dry. Returning early here
          // instead would starve every claim and leave the grid inert.
          if (poolUsed >= POOL_SIZE) return -1

          slot = poolUsed++
        }
      }

      occupied.set(key, slot)

      bias[slot] = 0.78 + noise * 0.44
      phase[slot] = noise * Math.PI * 2

      offsetX[slot] = 0
      offsetY[slot] = 0
      velocityX[slot] = 0
      velocityY[slot] = 0
      heat[slot] = 0
      spin[slot] = 0

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
      spin[slot] = 0
    }

    const resetPool = () => {
      occupied.clear()
      released.length = 0
      poolUsed = 0
    }

    const buildPattern = () => {
      const size = Math.max(1, Math.round(SPACING * pixelRatio))
      const tile = document.createElement("canvas")

      tile.width = size
      tile.height = size

      const tileContext = tile.getContext("2d")
      if (!tileContext) return

      const dot = DOT * pixelRatio

      // Warm grey rather than --border, which is a neutral hairline and reads
      // as dust next to the accent.
      tileContext.globalAlpha = REST_ALPHA
      tileContext.fillStyle = colourOf(REST_VARIABLE, "#8c8279")
      tileContext.fillRect((size - dot) / 2, (size - dot) / 2, dot, dot)

      pattern = context.createPattern(tile, "repeat")
    }

    const paint = () => {
      context.setTransform(1, 0, 0, 1, 0, 0)
      context.clearRect(0, 0, canvas.width, canvas.height)
      if (!pattern) return

      context.fillStyle = pattern
      context.fillRect(0, 0, canvas.width, canvas.height)

      if (occupied.size === 0) return

      const dot = DOT * pixelRatio
      const reach = DRAW_RADIUS * pixelRatio
      const pointerX = pointer.x * pixelRatio
      const pointerY = pointer.y * pixelRatio

      context.fillStyle = hot

      for (const [key, slot] of occupied) {
        const glow = heat[slot]
        if (glow < REST_EPSILON) continue

        const column = key % columns
        const row = (key - column) / columns

        const x = ((column + 0.5) * SPACING + offsetX[slot]) * pixelRatio
        const y = ((row + 0.5) * SPACING + offsetY[slot]) * pixelRatio

        const dx = x - pointerX
        const dy = y - pointerY

        if (dx * dx + dy * dy > reach * reach) continue

        const size = dot * (1 + glow * SCALE_GAIN)
        const angle = spin[slot]
        const cosine = Math.cos(angle)
        const sine = Math.sin(angle)

        context.globalAlpha = Math.min(1, glow * ALPHA_GAIN) * PEAK_ALPHA

        // setTransform swaps the matrix outright, which is cheaper than a
        // save/translate/rotate/restore around every single square.
        context.setTransform(cosine, sine, -sine, cosine, x, y)
        context.fillRect(-size / 2, -size / 2, size, size)
      }

      context.setTransform(1, 0, 0, 1, 0, 0)
      context.globalAlpha = 1
    }

    const step = (delta: number) => {
      const damping = Math.exp(-DAMPING * delta)
      const cooling = Math.exp(-COOLING * delta)
      const spinDecay = Math.exp(-SPIN_DECAY * delta)
      const dragX = pointer.vx * DRAG
      const dragY = pointer.vy * DRAG

      for (const [key, slot] of occupied) {
        const column = key % columns
        const row = (key - column) / columns

        let accelX = 0
        let accelY = 0

        // --- the pointer field
        const dx = pointer.x - (column + 0.5) * SPACING
        const dy = pointer.y - (row + 0.5) * SPACING
        const distance = Math.sqrt(dx * dx + dy * dy) + 0.001

        if (distance < PUSH_RADIUS) {
          const falloff = 1 - distance / PUSH_RADIUS
          const push = falloff * falloff * bias[slot]

          const normalX = dx / distance
          const normalY = dy / distance

          // Outward, so the squares open up rather than clump.
          accelX += normalX * push * REPEL
          accelY += normalY * push * REPEL

          // A little vorticity, so it reads as a fluid and not a bulge.
          accelX += -normalY * push * CURL
          accelY += normalX * push * CURL

          // Advection: the surface is dragged along with the pointer's own
          // motion, which is what leaves a wake behind a fast gesture.
          accelX += dragX * push
          accelY += dragY * push

          if (push > heat[slot]) heat[slot] = push

          // Rotation follows the swirl, opposed above and below the pointer.
          spin[slot] += normalY * push * SPIN_RATE
        }

        // --- membrane tension: tend toward the neighbours' displacement.
        // Averaging over active neighbours only means the edge of the field
        // couples weakly, so the trail keeps its energy instead of snapping.
        let sumX = 0
        let sumY = 0
        let count = 0

        if (column > 0) {
          const neighbour = occupied.get(key - 1)
          if (neighbour !== undefined) {
            sumX += offsetX[neighbour]
            sumY += offsetY[neighbour]
            count++
          }
        }

        if (column < columns - 1) {
          const neighbour = occupied.get(key + 1)
          if (neighbour !== undefined) {
            sumX += offsetX[neighbour]
            sumY += offsetY[neighbour]
            count++
          }
        }

        if (row > 0) {
          const neighbour = occupied.get(key - columns)
          if (neighbour !== undefined) {
            sumX += offsetX[neighbour]
            sumY += offsetY[neighbour]
            count++
          }
        }

        if (row < rows - 1) {
          const neighbour = occupied.get(key + columns)
          if (neighbour !== undefined) {
            sumX += offsetX[neighbour]
            sumY += offsetY[neighbour]
            count++
          }
        }

        if (count > 0) {
          accelX += (sumX / count - offsetX[slot]) * COUPLE
          accelY += (sumY / count - offsetY[slot]) * COUPLE
        }

        // --- spring to rest, then integrate
        accelX -= offsetX[slot] * SPRING
        accelY -= offsetY[slot] * SPRING

        const nextVelocityX = (velocityX[slot] + accelX * delta) * damping
        const nextVelocityY = (velocityY[slot] + accelY * delta) * damping

        let nextOffsetX = offsetX[slot] + nextVelocityX * delta
        let nextOffsetY = offsetY[slot] + nextVelocityY * delta

        const offset = Math.sqrt(
          nextOffsetX * nextOffsetX + nextOffsetY * nextOffsetY
        )

        if (offset > MAX_OFFSET) {
          const scale = MAX_OFFSET / offset

          nextOffsetX *= scale
          nextOffsetY *= scale

          velocityX[slot] = nextVelocityX * 0.45
          velocityY[slot] = nextVelocityY * 0.45
        } else {
          velocityX[slot] = nextVelocityX
          velocityY[slot] = nextVelocityY
        }

        offsetX[slot] = nextOffsetX
        offsetY[slot] = nextOffsetY

        spin[slot] = clamp(
          spin[slot] * spinDecay + Math.sin(phase[slot]) * heat[slot] * 0.12,
          -MAX_SPIN,
          MAX_SPIN
        )

        heat[slot] *= cooling

        if (distance > HARD_RADIUS) {
          release(key, slot)
          continue
        }

        // Otherwise recycle only once a cell is genuinely at rest, so the
        // wake keeps its energy instead of being cut the frame it appears.
        if (
          distance > PUSH_RADIUS &&
          heat[slot] < REST_EPSILON &&
          Math.abs(nextOffsetX) < SETTLED_OFFSET &&
          Math.abs(nextOffsetY) < SETTLED_OFFSET &&
          Math.abs(nextVelocityX) < SETTLED_VELOCITY &&
          Math.abs(nextVelocityY) < SETTLED_VELOCITY
        ) {
          release(key, slot)
        }
      }
    }

    const tick = (now: number) => {
      frame = 0

      const delta = Math.min((now - last) / 1000, 1 / 30)
      last = now

      const dragDecay = Math.exp(-DRAG_DECAY * delta)

      pointer.vx *= dragDecay
      pointer.vy *= dragDecay

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

      if (occupied.has(key)) return

      // A spawn square is a square, so its corners sit at 1.41x the reach —
      // further out than the hard ceiling, which step() would release on the
      // very next frame. Skipping them here keeps claim and release balanced
      // instead of churning the pool on every pointer move.
      const dx = pointer.x - (column + 0.5) * SPACING
      const dy = pointer.y - (row + 0.5) * SPACING

      if (dx * dx + dy * dy > HARD_RADIUS * HARD_RADIUS) return

      claim(key, column, row)
    }

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return

      const rect = host.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      const at = performance.now()

      if (previousAt > 0) {
        const elapsed = clamp((at - previousAt) / 1000, 1 / 240, 0.1)

        // Smoothed, and capped, so one jittery event cannot fling the field.
        pointer.vx +=
          (clamp(
            (x - previousX) / elapsed,
            -MAX_POINTER_SPEED,
            MAX_POINTER_SPEED
          ) -
            pointer.vx) *
          0.4
        pointer.vy +=
          (clamp(
            (y - previousY) / elapsed,
            -MAX_POINTER_SPEED,
            MAX_POINTER_SPEED
          ) -
            pointer.vy) *
          0.4
      }

      previousX = x
      previousY = y
      previousAt = at

      pointer.x = x
      pointer.y = y

      const column = Math.floor(x / SPACING)
      const row = Math.floor(y / SPACING)

      if (!tracking) {
        tracking = true

        // Seed on first contact, so the surface responds where the pointer
        // already is rather than trailing it across the hero.
        for (let r = row - 3; r <= row + 3; r++) {
          for (let c = column - 3; c <= column + 3; c++) occupy(c, r)
        }
      }

      // Spawn a little past the push radius so the membrane has somewhere to
      // ripple out to, and so the trail is made of real cells rather than a
      // hard cut at the edge of the field.
      const reach = Math.ceil(DRAW_RADIUS / SPACING)

      for (let r = row - reach; r <= row + reach; r++) {
        for (let c = column - reach; c <= column + reach; c++) occupy(c, r)
      }

      start()
    }

    const onPointerLeave = () => {
      tracking = false
      previousAt = 0
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

    const resizeObserver = new ResizeObserver(resize)
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
      hot = colourOf(HOT_VARIABLE, "#c2410c")
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
