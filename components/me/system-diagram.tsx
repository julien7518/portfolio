import styles from "./about.module.css"

// Five physical parts, each with a stable home. The open socket is intentional.
export const PARTS = [
  { x: 145, y: 170, dx: -85, dy: -75, angle: -12 },
  { x: 305, y: 170, dx: 88, dy: -45, angle: 9 },
  { x: 305, y: 330, dx: 80, dy: 65, angle: -7 },
  { x: 145, y: 330, dx: -65, dy: 100, angle: 11 },
  { x: 225, y: 250, dx: -5, dy: -100, angle: -18 },
] as const

export function SystemDiagram() {
  return (
    <div className={styles.diagramTrack} aria-hidden="true">
      <div className={styles.diagramSticky}>
        <svg className={styles.diagram} viewBox="0 0 450 540" fill="none">
          <g className={styles.construction}>
            <path
              d="M30 170H420M30 330H420M145 45V490M305 45V490"
              strokeDasharray="2 7"
            />
            <path d="M60 90h18m-9-9v18M375 430h18m-9-9v18" />
            <circle cx="225" cy="250" r="168" strokeDasharray="1 10" />
          </g>
          <g className={styles.connections}>
            <path data-connection="0" d="M145 170H305" />
            <path data-connection="1" d="M305 170V330" />
            <path data-connection="2" d="M305 330H145" />
            <path data-connection="3" d="M145 330V170" />
            <path data-connection="4" d="M145 170L225 250L305 330" />
            <path d="M225 250V405h70" strokeDasharray="3 5" />
            <circle cx="302" cy="405" r="7" />
          </g>
          {PARTS.map((part, index) => (
            <g
              key={index}
              data-system-part={index}
              className={styles.systemPart}
            >
              <rect x={part.x - 42} y={part.y - 42} width="84" height="84" />
              {index === 0 ? (
                <circle cx={part.x} cy={part.y} r="24" />
              ) : index === 1 ? (
                <path
                  d={`M${part.x - 26} ${part.y - 18}h52m-52 18h36m-36 18h44`}
                />
              ) : index === 2 ? (
                <>
                  <circle cx={part.x} cy={part.y} r="25" />
                  <circle cx={part.x} cy={part.y} r="12" />
                </>
              ) : index === 3 ? (
                <path
                  d={`M${part.x - 24} ${part.y + 24}v-48h48v48h-48m12-12h24v-24h-24z`}
                />
              ) : (
                <path d={`M${part.x - 20} ${part.y}h40m-20-20v40`} />
              )}
              <text x={part.x - 42} y={part.y + 57}>
                0{index + 1}
              </text>
            </g>
          ))}
          <g className={styles.componentLabels} data-part-labels>
            <text x="75" y="110">
              SERVICE
            </text>
            <text x="300" y="265">
              ENDURANCE
            </text>
            <text x="65" y="425">
              DISCIPLINE
            </text>
          </g>
          <path
            data-signal-route
            d="M420 95H145V170H305V330H145V170L225 250L305 330V250H225"
            className={styles.signalRoute}
          />
          <circle
            data-signal
            cx="305"
            cy="405"
            r="5"
            className={styles.signal}
          />
        </svg>
        <svg
          className={styles.mobileDiagram}
          viewBox="0 0 40 540"
          fill="none"
          preserveAspectRatio="none"
        >
          <path
            data-mobile-route
            d="M20 15V505"
            className={styles.signalRoute}
          />
          {[80, 160, 240, 320, 400].map((y, i) => (
            <g key={y} data-mobile-part={i} className={styles.systemPart}>
              <path d={`M20 ${y - 14}v28`} />
              <rect x="14" y={y - 6} width="12" height="12" />
            </g>
          ))}
          <path
            d="M20 420v85"
            className={styles.connections}
            strokeDasharray="2 6"
          />
          <circle
            data-mobile-signal
            cx="20"
            cy="505"
            r="4"
            className={styles.signal}
          />
        </svg>
      </div>
    </div>
  )
}
