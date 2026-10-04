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
/** Three decimals: fine enough to look exact, coarse enough to round-trip. */
const place = (n: number) => Math.round(n * 1000) / 1000

/**
 * Four sizes of grain, and what each of them is for.
 *
 * The largest are the nearest: they climb furthest and are the first to be
 * gone. The finest hang on longest and barely stir — a two-and-a-half times
 * longer flight than the big ones, so there is still something in the air when
 * everything else has landed. Without that spread the dust is one flat sheet
 * of dots sliding sideways at the same speed, which is what particle work
 * always looks like when nobody has thought about how far away each dot is.
 *
 * `reach` scales the climb, so depth is what carries the parallax. `flight` is
 * the whole journey of one grain as a fraction of the closing beat — from a
 * sixth of it for the heaviest to nearly half — so a longer ending is a
 * slower one rather than the same thing with more scroll left over it.
 */
const DUST = [
  { size: "size-1.5", tone: "bg-primary", reach: 1, flight: 0.17 },
  { size: "size-1", tone: "bg-primary", reach: 0.7, flight: 0.23 },
  { size: "size-0.75", tone: "bg-primary/80", reach: 0.45, flight: 0.33 },
  { size: "size-0.5", tone: "bg-primary/50", reach: 0.28, flight: 0.46 },
] as const

/**
 * That word, already taken apart underneath itself.
 *
 * Grains of it, laid across the footprint of the word so the dust rises out of
 * the letter it came from rather than out of a box, and pre-sorted left to
 * right so it can be released in reading order. Every number comes from a
 * fixed sequence rather than a chance: the dispersal is scrubbed against
 * scroll, and anything recomputed on refresh would reshuffle under the reader.
 *
 * Placed at three decimals, which is the whole reason this can be rendered at
 * all. These are inline styles, and the CSSOM serialises a number back to six
 * significant digits — so `61.331264%` is read out of the DOM as `61.3313%`,
 * React finds the attribute it hydrated disagreeing with the one it computed,
 * and throws a hydration mismatch. A value of three decimals fits in six
 * digits across this range, so it survives the round trip untouched.
 */
const MOTES = Array.from({ length: 96 }, (_, index) => {
  const x = place(2 + ((index * 0.618034) % 1) * 96)

  // Weight the heavy grains towards the thick of the word and let the fine
  // ones thin out at its edges, which is how a cloud ends up shaped by
  // whatever threw it. Taken from the grain's own position rather than its
  // index, so it still holds once the array is sorted into reading order.
  const centre = 1 - Math.abs((x - 50) / 48)
  const bias = scatter(index + 71) * 0.65 + centre * 0.35

  return {
    x,
    y: place(scatter(index + 1) * 100),
    grain: DUST[bias > 0.78 ? 0 : bias > 0.58 ? 1 : bias > 0.32 ? 2 : 3],
  }
}).sort((a, b) => a.x - b.x)

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
  /**
   * And then the last word lets go. The ink goes first and quickly, the word
   * diffuses behind it, and the dust it left is still in the air when the
   * scene ends — an ending with something in it beats an ending at zero.
   */
  disperse: [0.93, 1],
} as const

/**
 * Where the closing beat begins, as a fraction of the scroll — and the only
 * number that decides how long the ending lasts.
 *
 * Everything above it is squeezed toward the top of the page to make room, and
 * the difference is spent on the one beat worth spending it on: the last word
 * coming apart. Tuning that from sixteen positions by hand every time is how
 * timings drift out of step with each other, so it is done once here instead.
 */
const CLOSE = 0.845

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
      const disperses = root?.querySelector<HTMLElement>("[data-disperses]")

      if (
        !root ||
        !scroller ||
        !field ||
        !sentence ||
        !bridge ||
        !finale ||
        !disperses
      ) {
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
      const letters = collect<HTMLElement>(disperses, "[data-letter]")
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

        // The choreography above, packed into the scroll that is left for it.
        // Every position and duration before the closing beat is scaled by the
        // same factor, so the assembly keeps its shape — only faster to cross.
        const pack = CLOSE / ACT.disperse[0]
        const beat = {
          settle: ACT.settle * pack,
          flight: ACT.flight.map(([from, to]) => [from * pack, to * pack]),
          resolve: ACT.resolve.map(([from, to]) => [from * pack, to * pack]),
          bridge: [ACT.bridge[0] * pack, ACT.bridge[1] * pack],
          distill: ACT.distill * pack,
          finale: [ACT.finale[0] * pack, ACT.finale[1] * pack],
          disperse: [CLOSE, 1],
        } as const

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
          { opacity: 1, duration: beat.settle },
          0
        )

        frames.forEach((frame, index) => {
          timeline.fromTo(
            frame,
            { autoAlpha: 0 },
            { autoAlpha: 1, duration: 0.04 * pack },
            pack * (0.02 + index * 0.012)
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
              duration: 0.1 * pack,
            },
            pack * (0.01 + index * 0.02)
          )
        })

        // 2. Assembly — each module travels to the slot waiting for it and
        // resolves into its word, in reading order.
        modules.forEach((module, index) => {
          const [leave, arrive] = beat.flight[index]
          const [land, shut] = beat.resolve[index]
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
                // Same reason as the sweep: drawn with its line, not apart
                // from it.
                force3D: false,
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
              { scaleX: 1, duration: 0.03 * pack, immediateRender: false },
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
            duration: beat.bridge[1] - beat.bridge[0],
            ease: "power2.out",
            immediateRender: false,
          },
          beat.bridge[0]
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
        //
        // force3D: false keeps a line in one rasterised layer. GSAP promotes
        // every element it animates onto its own 3D-transformed layer for the
        // length of the tween, and a scene scrubbed against scroll is one very
        // long tween — so each word was being drawn apart from the line it
        // belongs to. Chrome absorbs that; WebKit snaps a layer's bounds to
        // whole pixels and an italic's overhang does not survive it, which is
        // what printed words over one another on the way out. Nothing on this
        // scene moves in depth, so there is nothing to lose by staying 2D —
        // and it spares the compositor fourteen layer promotions.
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
            duration: 0.04 * pack,
            ease: "power2.in",
            stagger: { each: 0.005 * pack, from: "start" },
            force3D: false,
            immediateRender: false,
          },
          beat.distill
        )

        timeline.fromTo(
          collect<HTMLElement>(bridge, "[data-chunk]"),
          { opacity: 1, scale: 1 },
          {
            opacity: 0,
            scale: 0.96,
            duration: 0.04 * pack,
            ease: "power2.in",
            stagger: { each: 0.005 * pack, from: "start" },
            force3D: false,
            immediateRender: false,
          },
          beat.distill + 0.03 * pack
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
            duration: beat.finale[1] - beat.finale[0],
            ease: "power2.out",
            immediateRender: false,
          },
          beat.finale[0]
        )

        // 5. And then the last word of it lets go, in three passes that
        // never overlap: the ink goes first, letter by letter and off the
        // metronome; the word diffuses behind them as one piece; and the dust
        // it left behind is still up when the scene runs out.
        //
        // Everything inside this beat is written as a proportion of the beat,
        // so CLOSE is the only thing that has to move to make the ending
        // longer: the wave, the flight of the dust and the haze that outlives
        // it all stretch together and keep the rhythm they were given.
        const [ink, cleared] = beat.disperse
        const span = cleared - ink
        const at = (fraction: number) => ink + fraction * span

        // Left to right, but unevenly — paper does not let go of itself at
        // even intervals, and the small jitter keeps the word from looking
        // like a progress bar emptying.
        letters.forEach((letter, index) => {
          timeline.fromTo(
            letter,
            { opacity: 1 },
            {
              opacity: 0,
              duration: span * 0.23,
              ease: "power2.in",
              // Held, then dropped: the word thins out before it goes.
              force3D: false,
              immediateRender: false,
            },
            at(index * 0.031 + scatter(index + 3) * 0.021)
          )
        })

        // The word itself, once its letters are already leaving. Lifted, drawn
        // in a little, and losing its edges — released rather than dissolved,
        // which is a different thing to watch.
        //
        // On the word and not on the letters, so all eleven glyphs diffuse
        // inside a single rasterised layer rather than each being promoted out
        // of the line it belongs to.
        timeline.fromTo(
          disperses,
          { scale: 1, y: 0, filter: "blur(0px)" },
          {
            scale: 0.94,
            y: -20,
            filter: "blur(4px)",
            clearProps: "filter",
            duration: span,
            ease: "power1.out",
            force3D: false,
            immediateRender: false,
          },
          ink
        )

        // The dust. Released left to right across the first stretch of the
        // beat, and every grain flies on its own two-legged path: a burst,
        // mostly upward, then a sideways spread as it slows down. A straight
        // line at one speed is what makes particle work look like a screensaver.
        //
        // The budget is the beat: released by 0.46 of it, and the longest
        // flight is 0.46 of it, so the last grain lands at 0.92 and the beat
        // closes on empty air. The grains are looked up by index because they
        // were rendered straight out of MOTES, in order.
        motes.forEach((mote, index) => {
          const column = index / Math.max(motes.length - 1, 1)
          const { reach, flight } = MOTES[index].grain
          const life = flight * span
          const released = at(column * 0.43 + scatter(index + 17) * 0.03)

          // How high it gets is how near it was; where it ends up sideways is
          // where it happened to be born. Two different questions.
          const climb = (8 + reach * 84) * (0.7 + scatter(index + 23) * 0.6)
          const drift = (column - 0.5) * 64 + (scatter(index + 11) - 0.5) * 48

          timeline
            .fromTo(
              mote,
              { opacity: 0, scale: 0.5 },
              {
                opacity: 0.35 + reach * 0.6,
                scale: 0.9,
                duration: life * 0.16,
                immediateRender: false,
              },
              released
            )
            // Up first, and fast.
            .fromTo(
              mote,
              { x: 0, y: 0 },
              {
                x: drift * 0.25,
                y: -climb * 0.78,
                duration: life * 0.42,
                ease: "power2.out",
                force3D: false,
                immediateRender: false,
              },
              released
            )
            // Then out and down to a stop, shrinking as it thins away.
            .fromTo(
              mote,
              {
                x: () => drift * 0.25,
                y: () => -climb * 0.78,
                scale: 0.9,
              },
              {
                x: drift,
                y: -climb,
                scale: 0.4,
                opacity: 0,
                duration: life * 0.58,
                ease: "power1.out",
                force3D: false,
                immediateRender: false,
              },
              released + life * 0.42
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
        className="relative h-[360svh] motion-reduce:h-auto motion-reduce:pt-24 md:motion-reduce:pt-32"
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
                  {/* The letters and the dust are boxed separately on
                      purpose: the word itself is lifted and diffused as one
                      piece while its letters leave it, and the grains must not
                      inherit either transform. */}
                  <span className="relative inline-block">
                    <span data-disperses className="inline-block">
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
                    </span>

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
                            // Held back until its own tween releases it: the
                            // dust is under the word, not printed on it.
                            "absolute rounded-full opacity-0",
                            mote.grain.size,
                            mote.grain.tone
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
