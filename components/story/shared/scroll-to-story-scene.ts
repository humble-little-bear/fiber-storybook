"use client";

import { ScrollTrigger } from "gsap/ScrollTrigger";

type ScrollToStorySceneOptions = {
  durationMs?: number;
};

export function scrollToStoryScene(sceneId: string, options: ScrollToStorySceneOptions = {}) {
  if (typeof window === "undefined") {
    return;
  }

  const target = document.getElementById(sceneId);

  if (!target) {
    return;
  }

  const sceneTrigger = ScrollTrigger.getAll().find((trigger) => trigger.trigger === target);
  const fallbackTarget = target.parentElement?.classList.contains("pin-spacer") ? target.parentElement : target;
  const top = sceneTrigger ? sceneTrigger.start + 1 : fallbackTarget.getBoundingClientRect().top + window.scrollY;
  const hash = sceneId === "chapter-1" || sceneId === "chapter-2" ? `#${sceneId}` : "";
  const url = `${window.location.pathname}${window.location.search}${hash}`;

  scrollToStoryPosition(top, { ...options, url });
}

export function scrollToStoryPosition(top: number, options: ScrollToStorySceneOptions & { url?: string } = {}) {
  if (typeof window === "undefined") {
    return;
  }

  const durationMs = options.durationMs ?? 900;
  const start = window.scrollY;
  const distance = top - start;
  const startedAt = performance.now();

  const animateScroll = (now: number) => {
    const elapsed = now - startedAt;
    const local = Math.min(1, elapsed / durationMs);
    const eased = 0.5 - Math.cos(local * Math.PI) / 2;

    window.scrollTo(0, start + distance * eased);
    ScrollTrigger.update();

    if (local < 1) {
      window.requestAnimationFrame(animateScroll);
    } else {
      window.scrollTo(0, top);
      ScrollTrigger.update();
    }
  };

  if (options.url !== undefined) {
    window.history.replaceState(null, "", options.url);
  }

  window.requestAnimationFrame(animateScroll);

  if (options.url !== undefined) {
    window.setTimeout(() => {
      window.history.replaceState(null, "", options.url ?? window.location.href);
    }, durationMs + 100);
  }
}
