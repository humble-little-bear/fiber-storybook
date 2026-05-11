"use client";

import Image from "next/image";
import styles from "./scene-hero.module.css";

export function OpeningHeroOverlay({
  fadeOpacity,
  veilOpacity,
  standalone = false,
}: {
  fadeOpacity: number;
  veilOpacity: number;
  standalone?: boolean;
}) {
  return (
    <div
      className={[styles.hero, standalone ? styles.heroStandalone : ""].filter(Boolean).join(" ")}
      style={{
        opacity: fadeOpacity,
      }}
    >
      <div className={styles.heroBackground}>
        <Image
          src="/hero/global-hero-bg.png"
          alt="Airport terminal background for the Fiber storybook."
          fill
          priority
          className={styles.backgroundImage}
        />
        <div className={styles.backgroundWhiteout} style={{ opacity: veilOpacity }} />
      </div>

      <div className={styles.heroMascot}>
        <Image
          src="/hero/pico-pulling-suitcase.svg"
          alt="Pico pulling a suitcase through the airport."
          width={340}
          height={470}
          priority
          className={styles.heroMascotImage}
        />
      </div>

      <div className={styles.heroCopy}>
        <div className={styles.heroCopyPanel}>
          <h1 className={styles.heroTitle}>
            Meet Pico.
            <br />
            Just passing through
            <br />
            the airport.
          </h1>
          <p className={styles.heroSubtitle}>
            Powered by <strong>Fiber</strong> behind the scenes
          </p>
        </div>
      </div>

      <div className={styles.scrollCue} aria-hidden="true">
        <span>Scroll to start</span>
        <span className={styles.scrollArrow} />
      </div>
    </div>
  );
}

export function OpeningHeroScene() {
  return (
    <section id="scene-hero" className={`story-scene ${styles.heroScene}`} style={{ minHeight: "100svh" }}>
      <div className={`story-stage ${styles.storyStageHero}`}>
        <OpeningHeroOverlay fadeOpacity={1} veilOpacity={0} standalone />
      </div>
    </section>
  );
}
