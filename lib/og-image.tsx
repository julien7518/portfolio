import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"
import type { ProjectType } from "@/app/projects/project"
import { identity, location } from "@/resources"

export const ogSize = { width: 1200, height: 630 }

const fonts = Promise.all([
  readFile(join(process.cwd(), "assets/fonts/InstrumentSerif-Regular.ttf")),
  readFile(join(process.cwd(), "assets/fonts/GeistMono.ttf")),
])

export async function renderOgImage(project?: ProjectType) {
  const [serif, mono] = await fonts
  const preview = project?.imageSrc
    ? `data:image/${project.imageSrc.endsWith(".jpg") || project.imageSrc.endsWith(".jpeg") ? "jpeg" : "png"};base64,${await readFile(join(process.cwd(), "public", project.imageSrc), "base64")}`
    : undefined
  const muted = "#82766f"
  const accent = "#a65322"
  const label = {
    fontFamily: "Geist Mono",
    fontSize: 16,
    letterSpacing: 2,
    color: muted,
  }

  return new ImageResponse(
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        background: "#ffffff",
        color: "#191715",
        padding: "42px 52px",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 480,
          top: -140,
          display: "flex",
          width: 760,
          height: 910,
          opacity: 0.48,
        }}
      >
        <svg width="760" height="910" viewBox="0 0 450 540" fill="none">
          <g stroke="#c7bdb5" strokeWidth="0.7">
            <path
              d="M30 170H420M30 330H420M145 45V490M305 45V490"
              strokeDasharray="2 7"
            />
            <path d="M60 90h18m-9-9v18M375 430h18m-9-9v18" />
            <circle cx="225" cy="250" r="168" strokeDasharray="1 10" />
            <circle cx="225" cy="250" r="205" strokeDasharray="4 12" />
          </g>
          <g stroke="#ac9d91" strokeWidth="1">
            <path d="M145 170H305V330H145V170L225 250L305 330" />
            <path d="M225 250V405h70" strokeDasharray="3 5" />
            <circle cx="302" cy="405" r="7" />
          </g>
          <g stroke="#ac9d91" fill="#fffaf6" fillOpacity="0.7">
            <rect
              x="103"
              y="128"
              width="84"
              height="84"
              transform="rotate(-12 145 170)"
            />
            <rect
              x="263"
              y="128"
              width="84"
              height="84"
              transform="rotate(9 305 170)"
            />
            <rect
              x="263"
              y="288"
              width="84"
              height="84"
              transform="rotate(-7 305 330)"
            />
            <rect
              x="103"
              y="288"
              width="84"
              height="84"
              transform="rotate(11 145 330)"
            />
            <rect
              x="183"
              y="208"
              width="84"
              height="84"
              transform="rotate(-18 225 250)"
            />
          </g>
          <g stroke="#ac9d91">
            <circle cx="145" cy="170" r="24" />
            <path d="M279 152h52m-52 18h36m-36 18h44" />
            <circle cx="305" cy="330" r="25" />
            <circle cx="305" cy="330" r="12" />
            <path d="M121 354v-48h48v48h-48m12-12h24v-24h-24zM205 250h40m-20-20v40" />
          </g>
          <path
            d="M420 95H145V170H305V330H145V170L225 250L305 330V250H225"
            stroke="#a65322"
            strokeWidth="1.2"
            strokeDasharray="3 6"
          />
          <circle cx="305" cy="405" r="5" fill="#a65322" />
        </svg>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "relative",
          borderBottom: "1px solid #e8e3df",
          paddingBottom: 20,
          ...label,
        }}
      >
        <span
          style={
            project
              ? {
                  fontFamily: "Instrument Serif",
                  fontSize: 56,
                  letterSpacing: -1.5,
                  color: "#191715",
                  lineHeight: 1,
                }
              : undefined
          }
        >
          {project ? identity.name : location.label.toUpperCase()}
        </span>
        <span style={{ color: accent }}>
          {project ? "PORTFOLIO / SELECTED WORK" : "PORTFOLIO / JF"}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          flex: 1,
          alignItems: "center",
          gap: 36,
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: preview ? 560 : 1096,
          }}
        >
          {project && (
            <div
              style={{
                ...label,
                display: "flex",
                color: accent,
                marginBottom: 18,
              }}
            >
              PROJECT / {project.date.toUpperCase()}
            </div>
          )}
          {project ? (
            <div
              style={{
                fontFamily: "Instrument Serif",
                fontSize:
                  project.name.length > 20
                    ? 60
                    : project.name.length > 12
                      ? 74
                      : 92,
                lineHeight: 1.02,
                letterSpacing: -2,
              }}
            >
              {project.name}
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontFamily: "Instrument Serif",
                fontSize: 144,
                lineHeight: 0.92,
                letterSpacing: -4,
              }}
            >
              <span>Julien</span>
              <span style={{ marginLeft: 130 }}>Fernandes</span>
            </div>
          )}
          {project && (
            <div
              style={{
                fontFamily: "Geist Mono",
                fontSize: 19,
                lineHeight: 1.5,
                color: muted,
                marginTop: 24,
              }}
            >
              {project.subtitle ?? project.description}
            </div>
          )}
        </div>
        {preview && (
          <div
            style={{
              display: "flex",
              width: 500,
              height: 320,
              border: "1px solid #e8e3df",
              background: "#f7f5f3",
              padding: 12,
            }}
          >
            {/* ImageResponse embeds local image bytes in the generated PNG. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt={project?.imageAlt ?? project?.name ?? ""}
              width={474}
              height={294}
              style={{ objectFit: "contain" }}
            />
          </div>
        )}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          position: "relative",
          borderTop: "1px solid #e8e3df",
          paddingTop: 22,
          ...label,
        }}
      >
        <span style={{ color: accent }}>
          {project
            ? (
                project.categories?.slice(0, 3).join(" / ") ?? "SELECTED WORK"
              ).toUpperCase()
            : identity.role.toUpperCase()}
        </span>
        <span>
          {project
            ? location.label.toUpperCase()
            : identity.focus.join(" / ").toUpperCase()}
        </span>
      </div>
    </div>,
    {
      ...ogSize,
      fonts: [
        { name: "Instrument Serif", data: serif, weight: 400, style: "normal" },
        { name: "Geist Mono", data: mono, weight: 400, style: "normal" },
      ],
    }
  )
}
