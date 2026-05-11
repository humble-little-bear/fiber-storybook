"use client";

import { useSound } from "@/components/providers/sound-provider";
import styles from "./end-banner.module.css";

export function EndBanner() {
  const { playCue } = useSound();

  return (
    <section className={styles.banner} aria-label="Closing banner">
      <h2 className={styles.title}>Thanks for traveling with Pico.</h2>
      <p className={styles.copy}>What other journeys could Fiber power? Share your ideas and help shape the next one.</p>
      <button type="button" className={styles.button} onMouseEnter={() => playCue("ui.pop")}>
        Share your idea
      </button>
    </section>
  );
}
