/**
 * The four objects the manifesto assembles itself from.
 *
 * Each discipline arrives as a physical part rather than a word: a window, a
 * listing, a board, a signal. They are drawn entirely from hairlines, one
 * orange mark and a lot of air — no images, no icon set — and they share a
 * single frame so the four read as pieces of the same kit.
 *
 * Everything here is decorative. The words these modules carry are already
 * spoken by the sentence in manifesto.tsx, so the caller hides the whole kit
 * from assistive technology and the modules only ever repeat it visually.
 */

export type DisciplineId = "interfaces" | "code" | "hardware" | "intelligence"

/** The kit: one outlined panel for the discipline, one plate for its name. */
export function DisciplineModule({
  id,
  word,
}: {
  id: DisciplineId
  word: string
}) {
  return (
    <>
      <div
        data-module-body
        className="absolute inset-x-0 top-0 bottom-[18%] overflow-hidden rounded-lg border border-foreground/12 bg-card/60"
      >
        <Panel id={id} />
      </div>

      {/* Part number. Sits on its own plate so it can be handed over to the
          sentence while the body of the module collapses behind it. */}
      <div
        data-module-label
        className="absolute inset-x-0 bottom-0 flex h-[18%] items-center justify-center border-t border-foreground/10 font-mono text-[0.5rem] tracking-[0.22em] text-muted-foreground uppercase md:text-[0.5625rem]"
      >
        {word}
      </div>
    </>
  )
}

function Panel({ id }: { id: DisciplineId }) {
  switch (id) {
    case "interfaces":
      return <Window />
    case "code":
      return <Listing />
    case "hardware":
      return <Board />
    case "intelligence":
      return <Signal />
  }
}

/** Chrome of a window: a title bar and the three marks that always sit in it. */
function Window() {
  return (
    <div className="relative flex size-full flex-col">
      <div className="flex h-[21%] items-center gap-[4%] border-b border-foreground/10 px-[9%]">
        <span className="size-0.75 shrink-0 rounded-full bg-primary" />
        <span className="size-0.75 shrink-0 rounded-full bg-foreground/25" />
        <span className="size-0.75 shrink-0 rounded-full bg-foreground/25" />
        <span className="ml-auto h-0.5 w-[26%] rounded-full bg-foreground/12" />
      </div>

      <div className="flex h-[79%]">
        <div className="flex w-[27%] flex-col justify-center gap-[9%] border-r border-foreground/10 pr-[16%] pl-[14%]">
          <span className="h-0.5 w-full rounded-full bg-foreground/22" />
          <span className="h-0.5 w-[64%] rounded-full bg-foreground/12" />
          <span className="h-0.5 w-[86%] rounded-full bg-foreground/12" />
          <span className="h-0.5 w-[48%] rounded-full bg-foreground/12" />
        </div>

        <div className="relative flex flex-1 flex-col justify-center gap-[8%] overflow-hidden pr-[11%] pl-[12%]">
          <span className="h-0.75 w-[44%] rounded-full bg-foreground/32" />

          <div className="grid grid-cols-3 gap-[6%]">
            <Tile />
            <Tile />
            <Tile />
            <Tile />
            <Tile live />
            <Tile />
          </div>

          <span className="h-0.5 w-[72%] rounded-full bg-foreground/12" />

          {/* One column of the layout, still being resolved. */}
          <span
            data-detail
            className="absolute inset-x-[12%] top-0 h-[8%] bg-foreground/8"
          />
        </div>
      </div>
    </div>
  )
}

function Tile({ live = false }: { live?: boolean }) {
  return (
    <span
      className={
        live
          ? "aspect-5/4 rounded-xs border border-primary/45 bg-primary/20"
          : "aspect-5/4 rounded-xs border border-foreground/12 bg-foreground/4"
      }
    />
  )
}

/** Monospace lines, indented and weighted like a listing rather than text. */
const LISTING: readonly [indent: number, width: number, tone: string][] = [
  [0, 34, "bg-foreground/38"],
  [1, 54, "bg-foreground/20"],
  [1, 26, "bg-primary/75"],
  [2, 42, "bg-foreground/20"],
  [2, 60, "bg-foreground/12"],
  [1, 22, "bg-foreground/20"],
  [0, 46, "bg-foreground/12"],
]

function Listing() {
  return (
    <div className="relative flex size-full flex-col justify-center gap-[7%] px-[12%]">
      {LISTING.map(([indent, width, tone]) => (
        <span
          key={`${indent}-${width}`}
          className={`h-0.75 rounded-full ${tone}`}
          style={{ marginLeft: `${indent * 9}%`, width: `${width}%` }}
        />
      ))}

      {/* The caret at the end of the last line. */}
      <span
        data-detail
        className="absolute right-[12%] bottom-[16%] h-2.25 w-0.5 bg-primary/80"
      />
    </div>
  )
}

/** Pins run 26/38/50/62 along every edge of the board. */
const LEADS = [26, 38, 50, 62] as const

function Board() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="size-full text-foreground"
      fill="none"
      aria-hidden
    >
      <g className="fill-foreground/20">
        {LEADS.map((at) => (
          <rect key={`w${at}`} x="10" y={at} width="6" height="4" rx="1" />
        ))}
        {LEADS.map((at) => (
          <rect key={`e${at}`} x="84" y={at} width="6" height="4" rx="1" />
        ))}
        {LEADS.map((at) => (
          <rect key={`n${at}`} x={at} y="10" width="4" height="6" rx="1" />
        ))}
        {LEADS.map((at) => (
          <rect key={`s${at}`} x={at} y="84" width="4" height="6" rx="1" />
        ))}
      </g>

      {/* The one live pin. */}
      <rect
        x="10"
        y="50"
        width="6"
        height="4"
        rx="1"
        className="fill-primary"
      />

      <rect
        x="18"
        y="18"
        width="64"
        height="64"
        rx="5"
        className="stroke-foreground/30"
        strokeWidth="0.7"
      />

      <g
        className="stroke-foreground/25"
        strokeWidth="0.7"
        strokeLinecap="square"
      >
        <path d="M33 40H26V31" />
        <path d="M67 60H74V69" />
        <path d="M50 33V26" />
        <path d="M50 67V74" />
      </g>

      <rect
        x="32"
        y="32"
        width="36"
        height="36"
        rx="3"
        className="fill-foreground/5 stroke-foreground/35"
        strokeWidth="0.7"
      />

      {/* The die, and the core inside it that is doing the thinking. */}
      <rect
        data-detail
        x="44"
        y="44"
        width="12"
        height="12"
        rx="1.5"
        className="fill-primary"
      />

      <g
        className="stroke-foreground/30"
        strokeWidth="0.7"
        strokeLinecap="square"
      >
        <path d="M22 26V22H26" />
        <path d="M78 74V78H74" />
      </g>
    </svg>
  )
}

/** The field: nine nodes and the edges between them. */
const NODES = [
  [22, 24],
  [50, 16],
  [79, 29],
  [31, 51],
  [58, 46],
  [84, 59],
  [20, 78],
  [48, 82],
  [74, 76],
] as const

const EDGES = [
  [0, 1],
  [1, 2],
  [0, 3],
  [3, 4],
  [4, 5],
  [2, 5],
  [3, 6],
  [4, 7],
  [5, 8],
  [6, 7],
  [7, 8],
  [1, 4],
] as const

function Signal() {
  return (
    <svg
      viewBox="0 0 100 100"
      className="size-full text-foreground"
      fill="none"
      aria-hidden
    >
      <g className="stroke-foreground/22" strokeWidth="0.7">
        {EDGES.map(([from, to]) => (
          <line
            key={`${from}-${to}`}
            x1={NODES[from][0]}
            y1={NODES[from][1]}
            x2={NODES[to][0]}
            y2={NODES[to][1]}
          />
        ))}
      </g>

      {/* A halo around the hub, built from two soft discs rather than a
          gradient so it costs nothing to composite. */}
      <circle cx="58" cy="46" r="15" className="fill-primary/[0.07]" />
      <circle cx="58" cy="46" r="9" className="fill-primary/10" />

      <g className="fill-foreground/30">
        {NODES.filter((_, index) => index !== 4).map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" />
        ))}
      </g>

      <circle cx="58" cy="46" r="2.6" className="fill-primary" />

      <circle
        data-detail
        cx="58"
        cy="46"
        r="5"
        className="stroke-primary"
        strokeWidth="0.7"
      />
    </svg>
  )
}
