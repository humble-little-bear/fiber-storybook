"use client";

import { useEffect, useRef, useState } from "react";
import type { SceneConfig } from "@/lib/story-content";
import openingStyles from "./opening-scenes.module.css";
import { ChannelOpeningSceneContent } from "./scene-five";
import {
  MicropaymentsSceneContent,
  SCENE_SIX_END_SECONDS,
  SCENE_SIX_START_SECONDS,
} from "./scene-six";
import { usePinnedSectionProgress } from "../shared";
import { clamp01, progressAtBeat } from "../shared";

export type SceneSixSnapshot = {
  elapsedSeconds: number;
  paid: number;
  remaining: number;
  ratePerSecond: number;
};

export function SceneFiveSixSection({
  sceneFive,
  sceneSix,
  activeSceneId,
  onActiveChange,
  onSessionSnapshot,
  onRelease,
}: {
  sceneFive: SceneConfig;
  sceneSix: SceneConfig;
  activeSceneId: string;
  onActiveChange: (id: string) => void;
  onSessionSnapshot: (snapshot: SceneSixSnapshot) => void;
  onRelease?: () => void;
}) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  const lastReportedSceneRef = useRef(activeSceneId);
  const sceneFiveScrollBudget = sceneFive.scrollLength - 100;
  const sceneSixScrollBudget = sceneSix.scrollLength - 100;
  const combinedScrollBudget = sceneFiveScrollBudget + sceneSixScrollBudget;
  // Scene 5 and Scene 6 share one pinned section so the black circle can open
  // over the completed Scene 5 instead of jumping to a separate slide.
  const sceneFiveShare = sceneFiveScrollBudget / combinedScrollBudget;
  const sceneFiveProgress = clamp01(progress / sceneFiveShare);
  const sceneSixProgress = clamp01((progress - sceneFiveShare) / (1 - sceneFiveShare));
  const sceneSixCovered = sceneSixProgress >= progressAtBeat(0.5, 8);
  const fiveSixBackground = sceneSixCovered ? "var(--color-bg-inverse)" : "var(--color-bg-yellow)";

  usePinnedSectionProgress({
    sectionRef,
    scrollBudgetVh: combinedScrollBudget,
    onProgress: (nextProgress) => {
      const nextSceneId = nextProgress < sceneFiveShare ? sceneFive.id : sceneSix.id;
      setProgress(nextProgress);

      if (nextProgress > 0.02 && nextProgress < 0.98 && lastReportedSceneRef.current !== nextSceneId) {
        lastReportedSceneRef.current = nextSceneId;
        onActiveChange(nextSceneId);
      }
    },
    dependencies: [combinedScrollBudget, onActiveChange, sceneFive.id, sceneFiveShare, sceneSix.id],
  });

  useEffect(() => {
    lastReportedSceneRef.current = activeSceneId;
  }, [activeSceneId]);

  return (
    <section
      id={sceneFive.id}
      ref={sectionRef}
      className="story-scene story-scene--five-six"
      style={{ minHeight: "100vh", background: fiveSixBackground }}
    >
      <div className="story-stage" style={{ background: fiveSixBackground }}>
        <div className={openingStyles.fiveSixStage}>
          <div className={openingStyles.sceneFiveLayer}>
            <ChannelOpeningSceneContent progress={sceneFiveProgress} />
          </div>

          <div className={openingStyles.sceneSixLayer}>
            <MicropaymentsSceneContent
              progress={sceneSixProgress}
              sceneSixStartSeconds={SCENE_SIX_START_SECONDS}
              sceneSixEndSeconds={SCENE_SIX_END_SECONDS}
              isSceneActive={activeSceneId === sceneSix.id || (sceneSixProgress > 0 && sceneSixProgress < 1)}
              onSessionSnapshot={onSessionSnapshot}
              onRelease={onRelease}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
