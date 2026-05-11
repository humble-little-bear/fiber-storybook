"use client";

import { BEAT_VH, TRANSITION_BEATS } from "@/lib/story-timing";

export { BEAT_VH, TRANSITION_BEATS };

export function clamp01(value: number) {
  return Math.max(0, Math.min(1, value));
}

export function easeOutCubic(value: number) {
  return 1 - (1 - value) ** 3;
}

export function easeInOutSine(value: number) {
  return -(Math.cos(Math.PI * value) - 1) / 2;
}

export function progressAtBeat(beat: number, totalBeats: number) {
  return clamp01(beat / totalBeats);
}

export function beatProgress(progress: number, beat: number, duration = 1, totalBeats = 1) {
  const cursor = progress * totalBeats;

  return clamp01((cursor - beat) / duration);
}

export function beatStyle(
  progress: number,
  beat: number,
  {
    duration = 1,
    totalBeats = 1,
    translateY = 22,
    scaleFrom = 1,
  }: {
    duration?: number;
    totalBeats?: number;
    translateY?: number;
    scaleFrom?: number;
  } = {},
) {
  const local = easeOutCubic(beatProgress(progress, beat, duration, totalBeats));
  const scale = scaleFrom + (1 - scaleFrom) * local;

  return {
    opacity: local,
    transform: `translateY(${(1 - local) * translateY}px) scale(${scale})`,
  };
}

export function formatCkb(value: number) {
  const roundedToTenth = Math.round(value * 10) / 10;
  const hasFraction = Math.abs(roundedToTenth - Math.round(roundedToTenth)) > 1e-9;

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: hasFraction ? 1 : 0,
    maximumFractionDigits: 1,
  }).format(roundedToTenth);
}

export function formatSceneSixDuration(totalSeconds: number) {
  const safeValue = Math.max(0, Math.round(totalSeconds));
  const minutes = Math.floor(safeValue / 60);
  const seconds = safeValue % 60;
  return `${minutes} min ${seconds} s`;
}
