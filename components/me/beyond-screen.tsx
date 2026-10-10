import styles from "./about.module.css"

export function BeyondScreen() {
  return (
    <section
      className={styles.beyond}
      aria-labelledby="beyond-title"
      data-act="1"
    >
      <div className={styles.rule}>
        <p>01 — BEYOND THE SCREEN</p>
        <span>Three parts / one person</span>
      </div>
      <h2 id="beyond-title">
        Built from
        <br />
        more than code.
      </h2>
      <dl className={styles.humanParts}>
        <div className={styles.service}>
          <dt>
            <span aria-hidden>01.1 / </span>SERVICE
          </dt>
          <dd>Paris Fire Brigade</dd>
          <dd className={styles.period}>2024 — now</dd>
          <span aria-hidden className={styles.partMark}>
            ┼
          </span>
        </div>
        <div className={styles.endurance}>
          <dt>
            <span aria-hidden>01.2 / </span>ENDURANCE
          </dt>
          <dd>
            Ironman 70.3
            <br />
            <em>Cervia</em>
          </dd>
          <dd className={styles.period}>September 2026</dd>
          <div aria-hidden className={styles.distance}>
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>
        <div className={styles.discipline}>
          <dt>
            <span aria-hidden>01.3 / </span>DISCIPLINE
          </dt>
          <dd>Paris Marathon</dd>
          <dd className={styles.years}>
            2025 <span>+</span> 2026
          </dd>
        </div>
      </dl>
      <p className={styles.humanConclusion}>
        Different arenas, same discipline: put in the work, perform under
        pressure and follow through.
      </p>
    </section>
  )
}
