import Image from "next/image"
import styles from "./about.module.css"

export function PortraitSection() {
  return (
    <section
      className={styles.takeApart}
      aria-labelledby="take-apart-title"
      data-act="0"
    >
      <div className={styles.rule}>
        <p>00 — TAKE APART</p>
        <span>Origin / curiosity</span>
      </div>
      <div className={styles.portraitGrid}>
        <figure className={styles.portrait}>
          <div className={styles.photo}>
            <Image
              src="/me/portrait.webp"
              width={2720}
              height={3296}
              alt="Julien Fernandes outdoors, looking directly at the camera."
              sizes="(min-width: 768px) 42vw, 90vw"
              preload
            />
            <span aria-hidden className={styles.photoFrame} />
            <span aria-hidden className={styles.photoMeasure}>
              A—A / HUMAN COMPONENT
            </span>
          </div>
          <figcaption>
            <span>Fig. 00 / Julien Fernandes</span>
            <span>Not a finished object.</span>
          </figcaption>
        </figure>
        <div className={styles.originCopy}>
          <p className={styles.micro}>Take apart / Understand / Rebuild</p>
          <h2 id="take-apart-title">
            I’ve always needed to know what’s inside.
          </h2>
          <div className={styles.bodyCopy}>
            <p>
              As a kid, that meant taking apart remote-controlled helicopters
              just to understand how they worked.
            </p>
            <p>
              Today, the objects have changed, but the instinct has not. I move
              between software, electronics, AI and design — learning each part
              well enough to make the whole feel clear.
            </p>
          </div>
          <p className={styles.positioning}>
            I help turn uncertain ideas into working digital products and
            prototypes, from interface to infrastructure and sometimes beyond
            the screen.
          </p>
        </div>
      </div>
    </section>
  )
}
