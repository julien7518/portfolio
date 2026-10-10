import styles from "./about.module.css"

export function CurrentBuild() {
  return (
    <section
      className={styles.current}
      aria-labelledby="current-title"
      data-act="3"
    >
      <div className={styles.rule}>
        <p>03 — CURRENT BUILD</p>
        <span>v2.6 / open-ended</span>
      </div>
      <div className={styles.currentCopy}>
        <h2 id="current-title">
          Versatile by nature.
          <br />
          Precise by habit.
        </h2>
        <p>
          I learn fast, move comfortably between disciplines and care about the
          final five percent — the part that turns something functional into
          something considered.
        </p>
      </div>
      <div className={styles.finale}>
        <p>
          Still taking things apart.
          <br />
          <em>Just building better things now.</em>
        </p>
        <span className={styles.micro}>Assembly continues.</span>
      </div>
    </section>
  )
}
