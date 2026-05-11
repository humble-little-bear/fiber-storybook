"use client";

import type { SceneConfig } from "@/lib/story-content";
import { beatProgress, TwoPanelStoryboardScene } from "../shared";

const SCENE_FOUR_TIMELINE_BEATS = 4;

export function TapToStartScene({
  scene,
  activeSceneId,
  onActiveChange,
}: {
  scene: SceneConfig;
  activeSceneId: string;
  onActiveChange: (id: string) => void;
}) {
  return (
    <TwoPanelStoryboardScene
      scene={scene}
      activeSceneId={activeSceneId}
      onActiveChange={onActiveChange}
      stageStyle={(progress) => ({
        background: `color-mix(in srgb, var(--color-bg-yellow) ${
          beatProgress(progress, 3, 1, SCENE_FOUR_TIMELINE_BEATS) * 100
        }%, var(--color-bg-white))`,
      })}
      assets={{
        leftStart: "/chapter1/c1-storyboard-4-left-start.svg",
        leftStartAlt: "Fiber pod start screen before Pico taps the payment board.",
        leftEnd: "/chapter1/c1-storyboard-4-left-end.svg",
        leftEndAlt: "Fiber pod screen after Pico taps the payment board.",
        rightStart: "/chapter1/c1-storyboard-4-right.svg",
        rightStartAlt: "Fiber phone confirmation screen with deposit and rate details.",
      }}
    />
  );
}
