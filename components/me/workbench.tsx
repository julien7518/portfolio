"use client"

import { useRef, useState } from "react"
import { useGSAP } from "@gsap/react"

import { gsap } from "@/lib/gsap"

/**
 * The workbench — a practice, shown as a plate you can tune.
 *
 * Four controls, four forces, one instrument. Logic raises the ruled grid: with
 * it high the field is dense and even, with it low the rules thin out and drift
 * off their marks. Intuition bends the trace that runs across the plate, from a
 * nearly flat reading to a free, wandering line. Craft decides how finely the
 * system is measured — how many samples sit on the trace and how dense the
 * ruler at its foot becomes. Curiosity is reach: it scatters the field of nodes,
 * stretches them outward and lets them connect with one another.
 *
 * The single primary mark is the live sample, sitting where the trace crosses
 * the centre of the plate. It is the only colour on the surface and the only
 * thing that follows the eye; everything else is foreground at low opacity.
 *
 * All of it is inline SVG driven by React state, so the drawing is recomputed
 * from the numbers rather than animated toward them. Dragging is continuous and
 * needs no interpolation; the brief transitions below only smooth the few
 * properties that can cross-fade, and are dropped entirely under reduced motion.
 * The geometry is written so no value can push a mark past the plate: radii sit
 * inside a fixed reach and the trace is clamped to the field.
 */

type Settings = {
  logic: number
  intuition: number
  craft: number
  curiosity: number
}

type ControlId = keyof Settings

const INITIAL: Settings = { logic: 72, intuition: 64, craft: 82, curiosity: 91 }

const CONTROLS: readonly { id: ControlId; label: string }[] = [
  { id: "logic", label: "Logic" },
  { id: "intuition", label: "Intuition" },
  { id: "craft", label: "Craft" },
  { id: "curiosity", label: "Curiosity" },
]

/**
 * The plate, in its own coordinate space. Everything is measured from these
 * edges so the drawing holds its shape at any width the plate is given.
 */
const VB_W = 320
const VB_H = 240
const PAD = 26
const LEFT = PAD
const RIGHT = VB_W - PAD
const TOP = PAD
const BOTTOM = VB_H - PAD
const AREA_W = RIGHT - LEFT
const AREA_H = BOTTOM - TOP
const CX = (LEFT + RIGHT) / 2
const CY = (TOP + BOTTOM) / 2
/** How far the field may reach from the centre before it would leave the plate. */
const MAX_REACH = 92
const TRACE_STEPS = 72
const GOLDEN_ANGLE = 2.399963229728653

/**
 * The grid's departure from its even spacing, one fixed value per rule. Written
 * down rather than drawn from a random source so it never reshuffles under the
 * reader — and so the server and the client agree on it.
 */
const GRID_JITTER = [0.14, -0.62, 0.38, -0.2, 0.71, -0.45, 0.08, -0.83, 0.52]

const norm = (value: number) => value / 100

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value))

type Point = readonly [number, number]

/**
 * One point on the trace, at `u` across the plate. The first harmonic is always
 * present so a low intuition is a calm reading rather than a dead line; the
 * higher ones fade in with the setting and give the trace its freedom, while
 * the amplitude stays within the field.
 */
function tracePoint(u: number, freedom: number): Point {
  const amplitude = AREA_H * (0.04 + 0.3 * freedom)
  const wave =
    Math.sin(u * Math.PI * 1.6 + 0.5) * 0.8 +
    Math.sin(u * Math.PI * 3.7 + 2) * freedom * 0.38 +
    Math.sin(u * Math.PI * 6.1 + 3.6) * freedom * 0.18

  return [LEFT + u * AREA_W, clamp(CY - amplitude * wave, TOP + 4, BOTTOM - 4)]
}

/** Each node joined to its nearest few within reach, so curiosity adds links. */
function buildEdges(points: Point[], reach: number, perNode: number) {
  const edges: [number, number][] = []
  const seen = new Set<string>()

  points.forEach((from, i) => {
    const near = points
      .map((to, j) => ({
        j,
        distance: Math.hypot(from[0] - to[0], from[1] - to[1]),
      }))
      .filter(({ j, distance }) => j !== i && distance <= reach)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, perNode)

    near.forEach(({ j }) => {
      const key = i < j ? `${i}:${j}` : `${j}:${i}`
      if (seen.has(key)) return
      seen.add(key)
      edges.push([i, j])
    })
  })

  return edges
}

/**
 * The whole drawing, derived from the four settings. Pure and cheap: the plate
 * is small, and recomputing it on every input event is exactly what keeps drag
 * continuous.
 */
function buildScene(settings: Settings) {
  const logic = norm(settings.logic)
  const intuition = norm(settings.intuition)
  const craft = norm(settings.craft)
  const curiosity = norm(settings.curiosity)

  // Logic — the ruled field: more rules, and straighter, as it climbs.
  const columns = 3 + Math.round(logic * 6)
  const gap = AREA_W / (columns + 1)
  const grid = Array.from(
    { length: columns },
    (_, i) => LEFT + (i + 1) * gap + GRID_JITTER[i] * (1 - logic) * gap * 0.42
  )

  // Intuition — the trace itself.
  const trace = Array.from({ length: TRACE_STEPS + 1 }, (_, i) =>
    tracePoint(i / TRACE_STEPS, intuition)
  )
  const tracePath = trace
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(2)} ${y.toFixed(2)}`)
    .join(" ")

  // Craft — how finely the trace is read, and how fine the ruler.
  const samples = 5 + Math.round(craft * 9)
  const samplePoints = Array.from({ length: samples }, (_, i) =>
    tracePoint((i + 0.5) / samples, intuition)
  )
  const sampleSize = 3 - 1.3 * craft
  const ticks = 6 + Math.round(craft * 22)

  // Curiosity — the field's reach, its population and its links.
  const nodeCount = 5 + Math.round(curiosity * 5)
  const spread = 0.42 + 0.58 * curiosity
  const constellation = Array.from({ length: nodeCount }, (_, i) => {
    const angle = i * GOLDEN_ANGLE
    const radius =
      10 + (MAX_REACH - 10) * Math.sqrt((i + 0.5) / nodeCount) * spread

    return [
      CX + radius * Math.cos(angle),
      CY + radius * Math.sin(angle),
    ] as Point
  })
  const edges = buildEdges(
    constellation,
    MAX_REACH * (0.15 + 0.37 * curiosity),
    2
  )

  return {
    grid,
    gridOpacity: 0.35 + 0.65 * logic,
    tracePath,
    samplePoints,
    sampleSize,
    ticks,
    constellation,
    edges,
    signal: tracePoint(0.5, intuition),
  }
}

export function Workbench() {
  const rootRef = useRef<HTMLElement>(null)
  const [settings, setSettings] = useState<Settings>(INITIAL)
  const scene = buildScene(settings)

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return

      const motion = gsap.matchMedia()

      // Reduced motion keeps the bench exactly as written: no timeline is ever
      // built, so the plate and its controls are on screen from the first frame.
      motion.add("(prefers-reduced-motion: no-preference)", () => {
        const intro = root.querySelectorAll<HTMLElement>(
          "[data-workbench-intro]"
        )
        const sceneEl = root.querySelector<HTMLElement>(
          "[data-workbench-scene]"
        )
        const rows = root.querySelectorAll<HTMLElement>(
          "[data-workbench-control]"
        )

        const timeline = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: { trigger: root, start: "top 78%", once: true },
        })

        timeline
          .from(intro, { opacity: 0, y: 12, duration: 0.6, stagger: 0.08 }, 0)
          .from(sceneEl, { opacity: 0, y: 22, duration: 0.9 }, 0.16)

        if (rows.length) {
          timeline.from(
            rows,
            { opacity: 0, y: 16, duration: 0.7, stagger: 0.07 },
            0.3
          )
        }
      })
    },
    { scope: rootRef }
  )

  const update = (id: ControlId, value: number) =>
    setSettings((current) => ({ ...current, [id]: value }))

  return (
    <section
      ref={rootRef}
      aria-labelledby="workbench"
      className="pb-24 md:pb-32"
    >
      <header className="max-w-2xl">
        <h2
          id="workbench"
          data-workbench-intro
          className="font-mono text-[0.6875rem] tracking-widest text-muted-foreground uppercase"
        >
          04 — The workbench
        </h2>

        <p
          data-workbench-intro
          className="mt-6 font-heading text-4xl leading-[1.05] text-balance italic md:text-5xl"
        >
          A practice in balance.
        </p>

        <p
          data-workbench-intro
          className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg"
        >
          Move the controls to see the forces behind how I build.
        </p>
      </header>

      <div className="mt-12 grid gap-y-12 lg:mt-16 lg:grid-cols-12 lg:gap-x-12">
        {/* The scene leads in the markup so it also comes first on mobile, where
            it reads under the title and before the controls. */}
        <div data-workbench-scene className="lg:col-span-8">
          <div className="relative aspect-4/3 w-full border border-border">
            <svg
              viewBox={`0 0 ${VB_W} ${VB_H}`}
              preserveAspectRatio="xMidYMid meet"
              role="img"
              aria-label="A live schematic: the four controls change its grid, its curve, its level of detail and its reach."
              className="h-full w-full text-foreground"
            >
              {/* The plate's axes: one corner, open to the top and right. */}
              <path
                d={`M ${LEFT} ${TOP} V ${BOTTOM} H ${RIGHT}`}
                className="fill-none stroke-foreground/25"
                strokeWidth={0.8}
                strokeLinecap="square"
              />

              {/* The ruler at its foot — fine as craft rises. */}
              <g
                className="stroke-foreground/20"
                strokeWidth={0.7}
                strokeLinecap="square"
              >
                {Array.from({ length: scene.ticks }, (_, i) => {
                  const x = LEFT + ((i + 0.5) / scene.ticks) * AREA_W

                  return (
                    <line key={i} x1={x} y1={BOTTOM} x2={x} y2={BOTTOM + 3.5} />
                  )
                })}
              </g>

              {/* Logic: the ruled field. */}
              <g
                className="stroke-foreground/15 transition-opacity duration-300 ease-out motion-reduce:transition-none"
                strokeWidth={0.75}
                style={{ opacity: scene.gridOpacity }}
              >
                {scene.grid.map((x, i) => (
                  <line key={i} x1={x} y1={TOP} x2={x} y2={BOTTOM} />
                ))}
              </g>

              {/* Curiosity: the links, then the nodes. */}
              <g className="stroke-foreground/10" strokeWidth={0.6}>
                {scene.edges.map(([a, b]) => (
                  <line
                    key={`${a}:${b}`}
                    x1={scene.constellation[a][0]}
                    y1={scene.constellation[a][1]}
                    x2={scene.constellation[b][0]}
                    y2={scene.constellation[b][1]}
                  />
                ))}
              </g>

              <g className="fill-foreground/30">
                {scene.constellation.map(([x, y], i) => (
                  <circle key={i} cx={x} cy={y} r={1.4} />
                ))}
              </g>

              {/* Intuition: the trace, then Craft's samples read off it. */}
              <path
                d={scene.tracePath}
                className="fill-none stroke-foreground/45"
                strokeWidth={1.1}
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              <g className="fill-foreground/55">
                {scene.samplePoints.map(([x, y], i) => (
                  <rect
                    key={i}
                    x={x - scene.sampleSize / 2}
                    y={y - scene.sampleSize / 2}
                    width={scene.sampleSize}
                    height={scene.sampleSize}
                  />
                ))}
              </g>

              {/* The one signal: the live sample at the centre of the plate. */}
              <circle
                cx={scene.signal[0]}
                cy={scene.signal[1]}
                r={7}
                className="fill-none stroke-primary/40"
                strokeWidth={0.8}
              />
              <circle
                cx={scene.signal[0]}
                cy={scene.signal[1]}
                r={2.3}
                className="fill-primary"
              />
            </svg>
          </div>
        </div>

        <div data-workbench-controls className="lg:col-span-4">
          <div className="flex flex-col gap-7">
            {CONTROLS.map(({ id, label }) => (
              <div key={id} data-workbench-control>
                <div className="flex items-baseline justify-between gap-4">
                  <label
                    htmlFor={`workbench-${id}`}
                    className="font-mono text-[0.6875rem] tracking-widest uppercase"
                  >
                    {label}
                  </label>
                  <span
                    aria-hidden
                    className="font-mono text-xs text-muted-foreground tabular-nums"
                  >
                    {settings[id]}
                  </span>
                </div>

                <input
                  id={`workbench-${id}`}
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={settings[id]}
                  onChange={(event) => update(id, Number(event.target.value))}
                  className="workbench-range mt-1"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
