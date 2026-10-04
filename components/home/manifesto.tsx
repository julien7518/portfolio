"use client"

import { Fragment, useRef } from "react"
import { useGSAP } from "@gsap/react"

import { gsap, ScrollTrigger } from "@/lib/gsap"
import { cn } from "@/lib/utils"
import { DisciplineModule, type DisciplineId } from "./manifesto-modules"

/**
 * The manifesto, staged as an act of assembly.
 *
 * The sentence arrives incomplete: the opening clause set in editorial type,
 * and four hairline slots where the disciplines belong. The disciplines
 * themselves lie loose around the viewport as physical modules — a window, a
 * listing, a board, a signal. Scrolling pulls each one into its slot in
 * reading order, where it collapses and hands over its word; once the thought
 * is whole it is distilled away, left to right, until only "It simply" is
 * left standing — and that gives up its last word to the dust it was always
 * made of.
 *
 * Every destination is measured from element bounds instead of being written
 * down, so the assembly holds together at any width the type scale can reach.
 */

type Discipline = {
  id: DisciplineId
  word: string
  /** Where the module waits, as a share of the stage it floats in. */
  place: string
}

const DISCIPLINES: readonly Discipline[] = [
  { id: "interfaces", word: "interfaces", place: "left-[3%] top-[5%]" },
  { id: "code", word: "code", place: "right-[4%] top-[1%]" },
  { id: "hardware", word: "hardware", place: "right-[1%] bottom-[11%]" },
  {
    id: "intelligence",
    word: "intelligence",
    place: "left-[4%] bottom-[9%]",
  },
]

const OPENING = "I build where disciplines overlap —"
const BRIDGE = "The best technology does not ask to be understood."
/** The last word of the closing line — the one that does not survive it. */
const TAIL = "disappears."
const GRAIN = ["size-0.5", "size-0.75", "size-0.5", "size-1"] as const

/**
 * That word, already taken apart underneath itself.
 *
 * Grains of it, laid across the footprint of the word so the dust rises out of
 * the letter it came from rather than out of a box, and pre-sorted left to
 * right so it can be released in reading order. Every number comes from a
 * fixed sequence rather than a chance: the dispersal is scrubbed against
 * scroll, and anything recomputed on refresh would reshuffle under the reader.
 */
const MOTES = Array.from({ length: 44 }, (_, index) => ({
  x: 2 + ((index * 0.618034) % 1) * 96,
  y: scatter(index + 1) * 100,
  size: GRAIN[index % GRAIN.length],
  // A few grains are struck out, so the dust has depth instead of one voice.
  tone: index % 4 === 0 ? "bg-primary/45" : "bg-primary",
})).sort((a, b) => a.x - b.x)

/** A stable number in [0, 1) — deterministic where Math.random is not. */
function scatter(n: number) {
  const value = Math.sin(n * 12.9898) * 43758.5453
  return value - Math.floor(value)
}

/**
 * The choreography, as fractions of the scene's scroll progress. Times are
 * absolute positions on a timeline whose duration is exactly 1, so every
 * number below is literally the percentage of the scroll it describes.
 */
const ACT = {
  /** The scene settles: the sentence arrives, the modules take their places. */
  settle: 0.08,
  /** Per discipline: the flight that carries it home, then the moment it lands. */
  flight: [
    [0.15, 0.3],
    [0.28, 0.42],
    [0.4, 0.54],
    [0.52, 0.65],
  ],
  resolve: [
    [0.27, 0.33],
    [0.39, 0.45],
    [0.51, 0.57],
    [0.62, 0.68],
  ],
  /** The second clause only makes sense once the first one is whole. */
  bridge: [0.62, 0.7],
  /** Hold the finished thought, then distil it away. */
  distill: 0.79,
  /** The closing line, arriving last and settling into the whole scene. */
  finale: [0.86, 0.9],
  /** And then the last word of it lets go. */
  disperse: 0.94,
} as const

export function Manifesto() {
  const rootRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const root = rootRef.current
      const scroller = root?.querySelector<HTMLElement>("[data-scene]")
      const field = root?.querySelector<HTMLElement>("[data-field]")
      const sentence = root?.querySelector<HTMLElement>("[data-sentence]")
      const bridge = root?.querySelector<HTMLElement>("[data-bridge]")
      const finale = root?.querySelector<HTMLElement>("[data-finale]")

      if (!root || !scroller || !field || !sentence || !bridge || !finale) {
        return
      }

      const modules = collect<HTMLElement>(root, "[data-module]")
      const bodies = modules.map(pick<HTMLElement>("[data-module-body]"))
      const labels = modules.map(pick<HTMLElement>("[data-module-label]"))
      const idles = modules.map(pick<HTMLElement>("[data-module-idle]"))
      const slots = collect<HTMLElement>(root, "[data-slot]")
      const frames = slots.map(pick<HTMLElement>("[data-slot-frame]"))
      const pulses = slots.map(pick<HTMLElement>("[data-slot-pulse]"))
      const landed = slots.map(pick<HTMLElement>("[data-slot-word]"))
      const meters = collect<HTMLElement>(root, "[data-meter]")
      const letters = collect<HTMLElement>(finale, "[data-letter]")
      const motes = collect<HTMLElement>(finale, "[data-mote]")

      if (modules.length !== DISCIPLINES.length) return

      /**
       * Centre of an element in the layout space of an ancestor.
       *
       * getBoundingClientRect cannot be used here: it reports the *current*
       * transform, so a module caught mid-flight would measure its flight
       * position as its resting one and every destination would drift. Walking
       * offsetLeft/offsetTop reads the untransformed layout instead, and the
       * sum is only valid because both ends of the journey share an ancestor.
       */
      const centre = (element: HTMLElement, ancestor: HTMLElement) => {
        let node: HTMLElement | null = element
        let x = 0
        let y = 0

        while (node && node !== ancestor) {
          x += node.offsetLeft
          y += node.offsetTop
          node = node.offsetParent as HTMLElement | null
        }

        return {
          x: x + element.offsetWidth / 2,
          y: y + element.offsetHeight / 2,
        }
      }

      /** The flight a module takes home, as two points and the bow between. */
      const route = (index: number) => {
        const from = centre(modules[index], field)
        const to = centre(slots[index], field)
        const pull = centre(sentence, field)
        const dx = to.x - from.x
        const dy = to.y - from.y
        const span = Math.hypot(dx, dy) || 1

        // The arc bows toward the sentence rather than away from it: the
        // modules are drawn to it, not thrown at it.
        const bow = Math.min(span * 0.2, 130)

        return {
          dx,
          dy,
          bowX: dx + ((pull.x - from.x) / span) * bow,
          bowY: dy + ((pull.y - from.y) / span) * bow,
        }
      }

      /** The angle a module is left lying at until it flies home. */
      const tilt = (index: number) => (index % 2 ? -7 : 7)

      const motion = gsap.matchMedia()

      // Reduced motion gets the finished, readable statement instead of the
      // scene: no timeline is ever built, so the static stylesheet below — the
      // slots resolved, the closing line present — is what renders.
      motion.add("(prefers-reduced-motion: no-preference)", () => {
        modules.forEach((module, index) => {
          // Idle life for the waiting modules: a slow drift on the inner
          // wrapper, so it never fights the flight on the module itself.
          const idle = idles[index]
          if (idle) {
            gsap.to(idle, {
              y: index % 2 ? 7 : -7,
              rotation: index % 2 ? -1.2 : 1.2,
              duration: 5.4 + index * 0.9,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              delay: index * 0.8,
            })
          }

          // And one micro-detail each, so no two parts read alike.
          const detail = module.querySelector<HTMLElement>("[data-detail]")
          if (!detail) return

          if (index === 0) {
            gsap.fromTo(
              detail,
              { yPercent: -140 },
              {
                yPercent: 1400,
                duration: 4.2,
                repeat: -1,
                ease: "none",
              }
            )
          } else if (index === 1) {
            gsap.to(detail, {
              opacity: 0,
              duration: 0.42,
              repeat: -1,
              repeatDelay: 0.42,
              ease: "steps(1)",
            })
          } else if (index === 2) {
            gsap.to(detail, {
              opacity: 0.35,
              duration: 1.9,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
            })
          } else {
            gsap.fromTo(
              detail,
              { attr: { r: 4 }, opacity: 0.7 },
              {
                attr: { r: 15 },
                opacity: 0,
                duration: 2.8,
                repeat: -1,
                ease: "power2.out",
              }
            )
          }
        })

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: scroller,
            start: "top top",
            end: "bottom bottom",
            // Scrubbed straight off the scroll: Lenis feeds ScrollTrigger on
            // every frame, so the scene is driven, never hijacked.
            scrub: true,
            // Destinations are measured from the DOM, so they have to be
            // measured again whenever that DOM changes shape.
            invalidateOnRefresh: true,
          },
        })

        // 1. Entrance — the first clause settles into place, still missing four
        // words, and the four parts drift in around it. Plain opacity, never
        // autoAlpha: anything that is text stays in the accessibility tree
        // even while it is not being shown yet.
        timeline.fromTo(
          sentence,
          { opacity: 0.4 },
          { opacity: 1, duration: ACT.settle },
          0
        )

        frames.forEach((frame, index) => {
          timeline.fromTo(
            frame,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.04 },
            0.02 + index * 0.012
          )
        })

        // The modules drift in, and are left lying slightly askew. The angle
        // is wound off by the flight that follows, so it is established here
        // rather than snapped in when the flight starts.
        modules.forEach((module, index) => {
          timeline.fromTo(
            module,
            { autoAlpha: 0, scale: 0.92, rotation: 0 },
            {
              autoAlpha: 1,
              scale: 1,
              rotation: tilt(index),
              duration: 0.1,
            },
            0.01 + index * 0.02
          )
        })

        // 2. Assembly — each module travels to the slot waiting for it and
        // resolves into its word, in reading order.
        modules.forEach((module, index) => {
          const [leave, arrive] = ACT.flight[index]
          const [land, shut] = ACT.resolve[index]
          const travel = arrive - leave
          const bow = leave + travel * 0.56
          const body = bodies[index]
          const label = labels[index]
          const frame = frames[index]
          const pulse = pulses[index]
          const word = landed[index]

          // Two legs through a control point, so the approach curves instead of
          // sliding on rails.
          timeline
            .fromTo(
              module,
              { x: () => 0, y: () => 0, rotation: () => tilt(index) },
              {
                x: () => route(index).bowX,
                y: () => route(index).bowY,
                rotation: 0,
                duration: bow - leave,
                ease: "power2.inOut",
                immediateRender: false,
              },
              leave
            )
            .fromTo(
              module,
              {
                x: () => route(index).bowX,
                y: () => route(index).bowY,
              },
              {
                x: () => route(index).dx,
                y: () => route(index).dy,
                duration: arrive - bow,
                ease: "power2.inOut",
                immediateRender: false,
              },
              bow
            )

          // Landing: the body folds away into the word it was carrying.
          if (body) {
            timeline.fromTo(
              body,
              { filter: "blur(0px)", scale: 1 },
              {
                filter: "blur(8px)",
                scale: 0.55,
                autoAlpha: 0,
                duration: shut - land,
                ease: "power2.in",
                immediateRender: false,
              },
              land
            )
          }

          if (label) {
            timeline.fromTo(
              label,
              { autoAlpha: 1, scale: 1, yPercent: 0 },
              {
                autoAlpha: 0,
                scale: 1.6,
                yPercent: -40,
                duration: (shut - land) * 0.85,
                ease: "power2.in",
                immediateRender: false,
              },
              land
            )
          }

          if (word) {
            timeline.fromTo(
              word,
              { opacity: 0, y: 10, scale: 1.08 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: shut - land,
                ease: "power2.out",
                immediateRender: false,
              },
              land + (shut - land) * 0.3
            )
          }

          // The slot gives up its outline, and answers with one small pulse.
          if (frame) {
            timeline.fromTo(
              frame,
              { autoAlpha: 1, scale: 1 },
              {
                autoAlpha: 0,
                scale: 1.1,
                duration: (shut - land) * 0.8,
                immediateRender: false,
              },
              land
            )
          }

          if (pulse) {
            timeline.fromTo(
              pulse,
              { autoAlpha: 0.9, scale: 0.7 },
              {
                autoAlpha: 0,
                scale: 1.8,
                duration: (shut - land) * 2,
                immediateRender: false,
              },
              land
            )
          }

          const meter = meters[index]

          if (meter) {
            timeline.fromTo(
              meter,
              { scaleX: 0 },
              { scaleX: 1, duration: 0.03, immediateRender: false },
              land
            )
          }
        })

        // The second clause arrives once the first is whole. It is text, so it
        // is faded rather than hidden — a screen reader has it from the start.
        timeline.fromTo(
          bridge,
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: ACT.bridge[1] - ACT.bridge[0],
            ease: "power2.out",
            immediateRender: false,
          },
          ACT.bridge[0]
        )

        // 3. Resolution — the assembled thought is read, then distilled away
        // from the left, leading text and disciplines together, as if the
        // system had boiled it down to the one line that was left.
        //
        // Collected by one selector so document order *is* reading order:
        // the commas go with the word they introduce, and the full stop
        // goes last, instead of the list being left hanging on the marks
        // after its words have gone.
        //
        // Nothing travels vertically on the way out. At 1.08 the leading is
        // shorter than the type is tall, so a line's descenders already reach
        // into the space of the next one: lifting a word while it is still
        // legible dropped it straight through the line above it. Each word
        // contracts inside its own box instead — a transform never reflows,
        // so it cannot reach its neighbours — and the sweep is carried by the
        // stagger alone.
        const cascade = collect<HTMLElement>(
          sentence,
          "[data-chunk], [data-punctuation], [data-slot-word]"
        )

        timeline.fromTo(
          cascade,
          { opacity: 1, scale: 1 },
          {
            opacity: 0,
            scale: 0.96,
            duration: 0.04,
            ease: "power2.in",
            stagger: { each: 0.005, from: "start" },
            immediateRender: false,
          },
          ACT.distill
        )

        timeline.fromTo(
          collect<HTMLElement>(bridge, "[data-chunk]"),
          { opacity: 1, scale: 1 },
          {
            opacity: 0,
            scale: 0.96,
            duration: 0.04,
            ease: "power2.in",
            stagger: { each: 0.005, from: "start" },
            immediateRender: false,
          },
          ACT.distill + 0.03
        )

        // 4. The closing line, alone, arriving out of the space the others left.
        // Text again, so it is faded rather than hidden from the tree.
        timeline.fromTo(
          finale,
          { opacity: 0, y: 30, scale: 0.96, filter: "blur(12px)" },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            // Let go of the filter at the very end of the scene: it is the one
            // thing left on screen, and it should be set like the rest of the
            // page rather than sitting inside one.
            clearProps: "filter",
            duration: ACT.finale[1] - ACT.finale[0],
            ease: "power2.out",
            immediateRender: false,
          },
          ACT.finale[0]
        )

        // 5. And then the last word of it lets go: it dissolves upward in
        // reading order, handing itself to the dust waiting underneath.
        timeline.fromTo(
          letters,
          { opacity: 1, y: 0, scale: 1 },
          {
            opacity: 0,
            y: -12,
            scale: 0.94,
            duration: 0.03,
            ease: "power2.in",
            stagger: { each: 0.003, from: "start" },
            immediateRender: false,
          },
          ACT.disperse
        )

        // Released left to right with the letters, climbing and opening as it
        // goes, so the word comes apart into a cloud instead of translating.
        motes.forEach((mote, index) => {
          const column = index / Math.max(motes.length - 1, 1)
          const released = ACT.disperse + column * 0.025
          const drift = (column - 0.5) * 130 + (scatter(index + 11) - 0.5) * 60
          const climb = 24 + scatter(index + 29) * 84

          timeline
            .fromTo(
              mote,
              { opacity: 0 },
              { opacity: 0.9, duration: 0.005, immediateRender: false },
              released
            )
            .fromTo(
              mote,
              { x: 0, y: 0 },
              {
                x: drift,
                y: -climb,
                opacity: 0,
                duration: 0.028,
                ease: "power1.out",
                immediateRender: false,
              },
              released + 0.004
            )
        })

        // An empty tween spanning the whole timeline, so its duration is
        // exactly 1 and the positions above are the scroll percentages.
        timeline.to({}, { duration: 1 }, 0)

        // Slot positions depend on the typeface. Self-hosted fonts swap in
        // after hydration, so give ScrollTrigger one more look once they land.
        document.fonts?.ready.then(() => ScrollTrigger.refresh())
      })
    },
    { scope: rootRef }
  )

  return (
    <section
      ref={rootRef}
      aria-label="Approach"
      className="relative pb-16 md:pb-24"
    >
      {/* The scroll area. svh throughout so the sticky stage travels exactly
          as far as the timeline it drives — and gone entirely when the scene
          is not wanted, which is what reduced motion gets. */}
      <div
        data-scene
        className="relative h-[320svh] motion-reduce:h-auto motion-reduce:pt-24 md:motion-reduce:pt-32"
      >
        <div
          data-stage
          className="sticky top-0 flex h-svh flex-col overflow-hidden px-6 motion-reduce:relative motion-reduce:h-auto motion-reduce:overflow-visible"
        >
          <div className="flex items-baseline justify-between gap-6 border-b border-border pt-6 pb-4 md:pt-10">
            <p className="font-mono text-[0.625rem] tracking-widest text-muted-foreground uppercase">
              Approach
            </p>

            {/* Assembly readout: one tick per discipline, filled as each one
                locks into the sentence. */}
            <div aria-hidden className="flex items-center gap-1.5">
              {DISCIPLINES.map((discipline) => (
                <span
                  key={discipline.id}
                  data-meter
                  className="h-px w-5 origin-left scale-x-0 bg-primary md:w-7"
                />
              ))}
            </div>
          </div>

          <div
            data-field
            className="relative flex flex-1 items-center justify-center"
          >
            <div className="relative mx-auto w-full max-w-4xl md:max-w-5xl lg:max-w-6xl">
              <p
                data-sentence
                className="font-heading text-4xl leading-[1.08] text-balance italic md:text-6xl lg:text-7xl"
              >
                {words(OPENING)}

                <span data-material-keywords className="not-italic">
                  {DISCIPLINES.map((discipline, index) => (
                    <Fragment key={discipline.id}>
                      {/* Punctuation rides ahead of its own word, so the list
                          reads as assembled only as far as it has actually
                          been, and is carried off by the distillation with the
                          word it introduces. A comma takes no space before it
                          and "and" takes one on both sides, which is only
                          English — and every one of those spaces lives outside
                          the span, where an inline-block would swallow it. */}
                      {index > 0 ? (
                        <>
                          {index === 3 ? " " : null}
                          <span data-punctuation className="inline-block">
                            {index === 3 ? "and" : ","}
                          </span>{" "}
                        </>
                      ) : null}
                      <Slot word={discipline.word} />
                    </Fragment>
                  ))}

                  <span data-punctuation className="inline-block">
                    .
                  </span>
                </span>
              </p>

              <p
                data-bridge
                className="mt-[0.35em] max-w-4xl font-heading text-4xl leading-[1.08] text-balance italic opacity-100 motion-safe:opacity-0 md:text-6xl lg:text-7xl"
              >
                {words(BRIDGE)}
              </p>

              {/* The closing line, absolutely centred on the space the
                  assembled statement vacates. Without the scene there is no
                  space to vacate, so it rejoins the flow. */}
              <div className="pointer-events-none absolute inset-0 grid place-items-center motion-reduce:static motion-reduce:mt-8">
                <p
                  data-finale
                  className="font-heading text-[clamp(2rem,7.4vw,5.5rem)] leading-[1.04] text-balance italic opacity-100 motion-safe:opacity-0"
                >
                  It simply{" "}
                  <span data-disperses className="relative inline-block">
                    {/* One box per character: they have to be separable to
                            be released in reading order. */}
                    {Array.from(TAIL).map((character, index) => (
                      <span
                        key={`${character}-${index}`}
                        data-letter
                        className="inline-block"
                      >
                        {character}
                      </span>
                    ))}

                    <span
                      data-motes
                      aria-hidden
                      className="pointer-events-none absolute inset-0 motion-reduce:hidden"
                    >
                      {MOTES.map((mote, index) => (
                        <span
                          key={index}
                          data-mote
                          className={cn(
                            "absolute rounded-full",
                            mote.size,
                            mote.tone
                          )}
                          style={{
                            left: `${mote.x}%`,
                            top: `${mote.y}%`,
                          }}
                        />
                      ))}
                    </span>
                  </span>
                </p>
              </div>
            </div>

            {DISCIPLINES.map((discipline) => (
              <div
                key={discipline.id}
                data-module
                aria-hidden
                className={cn(
                  "absolute aspect-square w-28 md:w-40 lg:w-44",
                  discipline.place,
                  "motion-reduce:hidden"
                )}
              >
                <div data-module-idle className="absolute inset-0">
                  <DisciplineModule id={discipline.id} word={discipline.word} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/**
 * The opening clause, one inline-block word at a time. Words have to be their
 * own boxes so the distillation can take them apart in reading order, and so
 * no word is ever broken across a line while it moves.
 */
function words(source: string) {
  return source.split(" ").map((word, index) => (
    <Fragment key={`${word}-${index}`}>
      <span data-chunk className="inline-block">
        {word}
      </span>{" "}
    </Fragment>
  ))
}

/**
 * A place a discipline is meant to end up. The word sits inside at full size
 * from the start and simply held back, so the sentence is already the right
 * width when the word arrives — nothing reflows as the scene assembles.
 */
function Slot({ word }: { word: string }) {
  return (
    <span data-slot className="relative inline-block">
      <span
        data-slot-frame
        aria-hidden
        className="absolute inset-x-[-0.06em] inset-y-[-0.08em] rounded-[0.18em] border border-foreground/15 opacity-0"
      />
      <span
        data-slot-pulse
        aria-hidden
        className="absolute inset-x-[-0.06em] inset-y-[-0.08em] rounded-[0.18em] border border-primary opacity-0"
      />
      <span
        data-slot-word
        className="inline-block text-primary opacity-0 motion-reduce:opacity-100"
      >
        {word}
      </span>
    </span>
  )
}

function collect<T extends Element>(root: ParentNode, selector: string) {
  return Array.from(root.querySelectorAll<T>(selector))
}

function pick<T extends Element>(selector: string) {
  return (root: Element): T | null => root.querySelector<T>(selector)
}
