import styles from "./about.module.css"

const VERSIONS = [
  {
    version: "v0.1",
    period: "Early years",
    title: "TAKING THINGS APART",
    text: "Before I knew how to build, I wanted to understand. Toys rarely survived intact for long.",
  },
  {
    version: "v1.0",
    period: "2022–24",
    title: "LEARNING RIGOR",
    text: "Scientific preparatory school taught me to work through complexity, build strong foundations and keep going when the answer was not obvious.",
  },
  {
    version: "v1.5",
    period: "2023",
    title: "SHIPPING",
    text: "My first web project turned code into something another person could actually use. Building was no longer an exercise — it had consequences.",
  },
  {
    version: "v2.0",
    period: "2024–now",
    title: "BECOMING A MAKER",
    text: "Creative Technology changed the scale of what I thought I could make. Software became one material among others, alongside electronics, physical fabrication, AI and design.",
  },
  {
    version: "v2.6",
    period: "Now",
    title: "CURRENT BUILD",
    text: "I design and engineer products across disciplines, moving quickly without losing care for the details that make an experience feel right.",
  },
] as const

export function VersionTimeline() {
  return (
    <section
      className={styles.versions}
      aria-labelledby="versions-title"
      data-act="2"
    >
      <div className={styles.rule}>
        <h2 id="versions-title">02 — VERSIONS</h2>
        <span>Release notes / a living system</span>
      </div>
      <div className={styles.versionGrid}>
        <div className={styles.versionScene} aria-hidden="true">
          <div className={styles.versionSticky}>
            <p className={styles.micro}>Understand → Rebuild</p>
            <div className={styles.versionReadout}>
              {VERSIONS.map((entry, index) => (
                <span key={entry.version} data-release={index}>
                  {entry.version}
                </span>
              ))}
            </div>
            <p className={styles.sceneNote}>
              A system shaped by every
              <br />
              problem it learned to solve.
            </p>
            <div className={styles.releaseTraces}>
              {VERSIONS.map((entry, index) => (
                <span key={entry.version} data-trace={index}>
                  {entry.version}
                </span>
              ))}
            </div>
          </div>
        </div>
        <ol className={styles.releaseList}>
          {VERSIONS.map((entry, index) => (
            <li key={entry.version} data-version={index}>
              <div className={styles.releaseMeta}>
                <span>{entry.version}</span>
                <span>{entry.period}</span>
              </div>
              <div className={styles.releaseBody}>
                <h3>{entry.title}</h3>
                <p>
                  <span>{entry.text}</span>
                </p>
              </div>
              <span className={styles.releaseIndex} aria-hidden>
                PART {String(index + 1).padStart(2, "0")} / 05
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
