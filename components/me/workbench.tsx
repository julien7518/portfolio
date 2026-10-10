"use client"

import { useRef, useState } from "react"
import { useGSAP } from "@gsap/react"

import { gsap } from "@/lib/gsap"
import styles from "./workbench.module.css"

type Settings = {
  logic: number
  intuition: number
  craft: number
  curiosity: number
}

type ControlId = keyof Settings

const INITIAL: Settings = { logic: 72, intuition: 64, craft: 82, curiosity: 91 }

const CONTROLS: readonly {
  id: ControlId
  label: string
  from: string
  to: string
}[] = [
  { id: "logic", label: "Logic", from: "Loose", to: "Ordered" },
  { id: "intuition", label: "Intuition", from: "Quiet", to: "Free" },
  { id: "craft", label: "Craft", from: "Raw", to: "Resolved" },
  { id: "curiosity", label: "Curiosity", from: "Known", to: "Open" },
]

const SCATTER = [-0.72, 0.34, -0.18, 0.8, -0.48, 0.19, -0.86, 0.57, -0.28]
const NODES = [
  [11, 19],
  [29, 10],
  [52, 18],
  [82, 12],
  [91, 42],
  [75, 76],
  [46, 88],
  [17, 79],
  [8, 49],
] as const

/**
 * 03 / Tune
 *
 * The final instrument returns to the face from chapter zero. Four forces pull
 * one portrait between order and instinct: strips align, drift, multiply and
 * open out while the page's hairline grid and single live signal remain. It is
 * recognisably the same person at every value, but never quite the same system.
 */
export function Workbench() {
  const rootRef = useRef<HTMLElement>(null)
  const [settings, setSettings] = useState<Settings>(INITIAL)

  useGSAP(
    () => {
      const root = rootRef.current
      if (!root) return

      const motion = gsap.matchMedia()
      motion.add("(prefers-reduced-motion: no-preference)", () => {
        const heading = root.querySelectorAll<HTMLElement>("[data-tune-heading]")
        const instrument = root.querySelector<HTMLElement>("[data-tune-instrument]")
        const controls = root.querySelectorAll<HTMLElement>("[data-tune-control]")

        gsap
          .timeline({
            defaults: { ease: "power3.out" },
            scrollTrigger: { trigger: root, start: "top 78%", once: true },
          })
          .from(heading, { opacity: 0, y: 10, duration: 0.6, stagger: 0.06 })
          .from(instrument, { opacity: 0, y: 28, duration: 1 }, 0.12)
          .from(
            controls,
            { opacity: 0, y: 16, duration: 0.65, stagger: 0.07 },
            0.28
          )
      })
    },
    { scope: rootRef }
  )

  const update = (id: ControlId, value: number) => {
    setSettings((current) => ({ ...current, [id]: value }))
  }

  return (
    <section ref={rootRef} aria-labelledby="workbench" className="pb-24 md:pb-36">
      <header className="grid grid-cols-2 items-end gap-4 border-t border-border pt-3 pb-8 font-mono text-[0.625rem] tracking-[0.18em] uppercase md:grid-cols-12 md:pb-12">
        <h2 id="workbench" data-tune-heading className="md:col-span-3">
          03 — Tune
        </h2>
        <p
          data-tune-heading
          className="text-right text-muted-foreground md:col-span-3 md:col-start-10"
        >
          Workbench / Live instrument
        </p>
      </header>

      <div className="grid gap-y-12 lg:grid-cols-12 lg:gap-x-12">
        <div data-tune-instrument className="lg:col-span-8">
          <PortraitInstrument settings={settings} />
        </div>

        <div className="flex flex-col lg:col-span-4">
          <div data-tune-heading>
            <p className="font-heading text-5xl leading-[0.88] tracking-[-0.035em] md:text-6xl lg:text-7xl">
              A practice
              <br />
              in balance.
            </p>
            <p className="mt-7 max-w-sm text-base leading-relaxed text-muted-foreground">
              Move the controls. The portrait holds; the system around it changes.
            </p>
          </div>

          <div className="mt-14 border-t border-border lg:mt-auto">
            {CONTROLS.map((control) => (
              <Control
                key={control.id}
                {...control}
                value={settings[control.id]}
                onChange={(value) => update(control.id, value)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-20 grid border-t border-border pt-6 md:mt-28 md:grid-cols-12">
        <p className="font-mono text-[0.625rem] tracking-[0.18em] text-muted-foreground uppercase md:col-span-3">
          Output / Always unfinished
        </p>
        <p className="mt-10 max-w-5xl font-heading text-5xl leading-[0.92] tracking-[-0.035em] text-balance md:col-span-8 md:col-start-5 md:mt-0 md:text-7xl lg:text-8xl">
          No fixed formula.
          <br />
          Only a way of working.
        </p>
      </div>
    </section>
  )
}

function PortraitInstrument({ settings }: { settings: Settings }) {
  const logic = settings.logic / 100
  const intuition = settings.intuition / 100
  const craft = settings.craft / 100
  const curiosity = settings.curiosity / 100
  const slices = 4 + Math.round(craft * 5)
  const gap = 0.6 + curiosity * 3.4
  const gridLines = 2 + Math.round(logic * 6)
  const detailTicks = 8 + Math.round(craft * 20)

  const wave = Array.from({ length: 9 }, (_, index) => {
    const x = 5 + index * 11.25
    const y = 50 + Math.sin(index * 1.18 + 0.5) * (5 + intuition * 19)
    return `${index === 0 ? "M" : "L"}${x} ${y}`
  }).join(" ")

  return (
    <div
      role="img"
      aria-label="An abstract portrait of Julien that changes its order, movement, detail and reach with the four controls."
      className="relative aspect-[4/5] overflow-hidden border border-border bg-muted/35 sm:aspect-[5/4]"
    >
      <div className="absolute inset-0">
        {Array.from({ length: gridLines }, (_, index) => (
          <span
            key={`vertical-${index}`}
            aria-hidden
            className="absolute top-0 bottom-0 w-px bg-foreground/10 transition-[left,opacity] duration-500 motion-reduce:transition-none"
            style={{
              left: `${((index + 1) / (gridLines + 1)) * 100}%`,
              opacity: 0.35 + logic * 0.65,
            }}
          />
        ))}
        {Array.from({ length: 3 }, (_, index) => (
          <span
            key={`horizontal-${index}`}
            aria-hidden
            className="absolute right-0 left-0 h-px bg-foreground/10"
            style={{ top: `${25 + index * 25}%` }}
          />
        ))}
      </div>

      <div className="absolute inset-[7%] overflow-hidden border border-foreground/15">
        {Array.from({ length: slices }, (_, index) => {
          const width = 100 / slices
          const drift = SCATTER[index] * (1 - logic) * 54
          const rotation = SCATTER[(index + 3) % SCATTER.length] * intuition * 4

          return (
            <span
              key={`${slices}-${index}`}
              aria-hidden
              className="absolute top-0 h-full overflow-hidden transition-[left,width,transform] duration-500 ease-out motion-reduce:transition-none"
              style={{
                left: `calc(${index * width}% + ${gap / 2}px)`,
                width: `calc(${width}% - ${gap}px)`,
                transform: `translateY(${drift}px) rotate(${rotation}deg) scale(${1 + curiosity * 0.025})`,
              }}
            >
              <span
                className="absolute top-0 h-full bg-[url('/me/portrait.webp')] bg-no-repeat grayscale transition-[filter] duration-500 motion-reduce:transition-none"
                style={{
                  left: `${-index * 100}%`,
                  width: `${slices * 100}%`,
                  backgroundSize: "100% auto",
                  backgroundPosition: "50% 42%",
                  filter: `grayscale(1) contrast(${0.9 + craft * 0.45}) brightness(${1.06 - craft * 0.12})`,
                }}
              />
            </span>
          )
        })}

        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden
          className="absolute inset-0 size-full"
        >
          <path
            d={wave}
            vectorEffect="non-scaling-stroke"
            className="fill-none stroke-background/70 mix-blend-difference transition-[d] duration-500 motion-reduce:transition-none"
            strokeWidth="0.8"
          />
        </svg>

        {NODES.map(([x, y], index) => (
          <span
            key={index}
            aria-hidden
            className="absolute size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-background/65 bg-foreground/20 mix-blend-difference transition-[top,left,opacity] duration-500 motion-reduce:transition-none"
            style={{
              left: `${50 + (x - 50) * (0.25 + curiosity * 0.75)}%`,
              top: `${50 + (y - 50) * (0.25 + curiosity * 0.75)}%`,
              opacity: 0.18 + curiosity * 0.82,
            }}
          />
        ))}

        <span
          aria-hidden
          className="absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary transition-[top,left] duration-500 ease-out motion-reduce:transition-none"
          style={{
            left: `${50 + (curiosity - 0.5) * 34}%`,
            top: `${50 + Math.sin(intuition * Math.PI * 2) * 15}%`,
          }}
        />
      </div>

      <div className="absolute inset-x-[7%] bottom-[2.6%] flex h-2 items-end justify-between">
        {Array.from({ length: detailTicks }, (_, index) => (
          <span
            key={index}
            aria-hidden
            className="h-1 w-px bg-foreground/25"
          />
        ))}
      </div>

      <div className="absolute inset-x-4 top-4 flex justify-between font-mono text-[0.5rem] tracking-[0.18em] text-muted-foreground uppercase sm:inset-x-5 sm:top-5">
        <span>Composite / Subject 00</span>
        <span>Live</span>
      </div>
    </div>
  )
}

function Control({
  id,
  label,
  from,
  to,
  value,
  onChange,
}: {
  id: ControlId
  label: string
  from: string
  to: string
  value: number
  onChange: (value: number) => void
}) {
  return (
    <div data-tune-control className="border-b border-border py-6">
      <div className="flex items-baseline justify-between gap-6">
        <label
          htmlFor={`workbench-${id}`}
          className="font-mono text-[0.625rem] tracking-[0.18em] uppercase"
        >
          {label}
        </label>
        <output
          htmlFor={`workbench-${id}`}
          className="font-mono text-xs text-muted-foreground tabular-nums"
        >
          {String(value).padStart(2, "0")}
        </output>
      </div>

      <input
        id={`workbench-${id}`}
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(event) => onChange(Number(event.currentTarget.value))}
        className={styles.range}
        style={{ "--range-progress": `${value}%` } as React.CSSProperties}
      />

      <div className="mt-2 flex justify-between font-mono text-[0.5rem] tracking-[0.14em] text-muted-foreground uppercase">
        <span>{from}</span>
        <span>{to}</span>
      </div>
    </div>
  )
}
