"use client";

import { useEffect, useRef, useState } from "react";
import { useSound } from "@/components/providers/sound-provider";
import type { SceneConfig } from "@/lib/story-content";
import openingStyles from "./opening-scenes.module.css";
import { OpeningSceneThree } from "./scene-three";
import { OpeningSceneTwo } from "./scene-two";
import { usePinnedSectionProgress } from "../shared";
import {
  BEAT_VH,
  TRANSITION_BEATS,
  beatProgress,
  beatStyle,
  easeInOutSine,
  easeOutCubic,
  progressAtBeat,
} from "../shared";

const COMPARISON_TIMELINE_BEATS = 16;
const HEARTS = [
  { positionClassName: "heartLeftHigh", sizeClassName: "heartSmall", delay: 0.02, left: 16, top: 29 },
  { positionClassName: "heartLeftMid", sizeClassName: "heartLarge", delay: 0.1, left: 11, top: 52 },
  { positionClassName: "heartLeftLow", sizeClassName: "heartMedium", delay: 0.18, left: 18, top: 82 },
  { positionClassName: "heartRightHigh", sizeClassName: "heartMedium", delay: 0.26, left: 84, top: 55 },
  { positionClassName: "heartRightMid", sizeClassName: "heartLarge", delay: 0.34, left: 90, top: 67 },
  { positionClassName: "heartRightLow", sizeClassName: "heartSmall", delay: 0.42, left: 94, top: 82 },
];

export function SceneTwoThreeSection({
  sceneTwo,
  sceneThree,
  activeSceneId,
  onActiveChange,
}: {
  sceneTwo: SceneConfig;
  sceneThree: SceneConfig;
  activeSceneId: string;
  onActiveChange: (id: string) => void;
}) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  const lastReportedSceneRef = useRef(activeSceneId);

  usePinnedSectionProgress({
    sectionRef,
    scrollBudgetVh: COMPARISON_TIMELINE_BEATS * BEAT_VH,
    onEnter: () => {
      setProgress(0);
      if (lastReportedSceneRef.current !== sceneTwo.id) {
        lastReportedSceneRef.current = sceneTwo.id;
        onActiveChange(sceneTwo.id);
      }
    },
    onLeaveBack: () => {
      setProgress(0);
    },
    onProgress: (nextProgress) => {
      setProgress(nextProgress);

      // Scene 2/3 is one pinned horizontal strip. Keep the active scene in sync
      // with the horizontal beat window, but avoid reporting the edges where the
      // previous/next vertical sections are taking over.
      if (
        nextProgress > progressAtBeat(1, COMPARISON_TIMELINE_BEATS) &&
        nextProgress < progressAtBeat(15.5, COMPARISON_TIMELINE_BEATS)
      ) {
        const nextSceneId =
          nextProgress < progressAtBeat(10, COMPARISON_TIMELINE_BEATS) ? sceneTwo.id : sceneThree.id;
        if (lastReportedSceneRef.current !== nextSceneId) {
          lastReportedSceneRef.current = nextSceneId;
          onActiveChange(nextSceneId);
        }
      }
    },
    dependencies: [onActiveChange, sceneThree.id, sceneTwo.id],
  });

  useEffect(() => {
    lastReportedSceneRef.current = activeSceneId;
  }, [activeSceneId]);

  return (
    <section
      id={sceneTwo.id}
      ref={sectionRef}
      className="story-scene"
      style={{ minHeight: "100vh" }}
    >
      <div className="story-stage" style={{ background: "var(--color-bg-white)" }}>
        <SceneTwoThreeContent sceneTwo={sceneTwo} sceneThree={sceneThree} progress={progress} />
      </div>
    </section>
  );
}

function SceneTwoThreeContent({
  sceneTwo,
  sceneThree,
  progress,
}: {
  sceneTwo: SceneConfig;
  sceneThree: SceneConfig;
  progress: number;
}) {
  const swapCueTriggeredRef = useRef(false);
  const heartCueStateRef = useRef<boolean[]>([]);
  const { playCue } = useSound();
  const sceneTwoHeadlineReveal = easeOutCubic(beatProgress(progress, 0, 1, COMPARISON_TIMELINE_BEATS));
  const sceneTwoBoardReveal = easeOutCubic(beatProgress(progress, 1, 1, COMPARISON_TIMELINE_BEATS));
  const boardSwapped = progress >= progressAtBeat(2, COMPARISON_TIMELINE_BEATS);
  const sceneTwoQuestionReveal = easeOutCubic(beatProgress(progress, 3, 1, COMPARISON_TIMELINE_BEATS));
  const horizontalProgress = easeInOutSine(
    beatProgress(progress, 4, TRANSITION_BEATS, COMPARISON_TIMELINE_BEATS),
  );
  const sceneTwoShiftPercent = horizontalProgress * 160;
  const sceneThreeSlideProgress = horizontalProgress;
  const sceneThreeVisible = progress >= progressAtBeat(4, COMPARISON_TIMELINE_BEATS);
  const fiberHeadlineStyle = beatStyle(progress, 10, {
    totalBeats: COMPARISON_TIMELINE_BEATS,
    translateY: 20,
  });
  const fiberImageReveal = easeOutCubic(beatProgress(progress, 11, 1, COMPARISON_TIMELINE_BEATS));
  const fiberFooterLineOneStyle = beatStyle(progress, 12, {
    totalBeats: COMPARISON_TIMELINE_BEATS,
    translateY: 18,
  });
  const fiberFooterLineTwoStyle = beatStyle(progress, 13, {
    totalBeats: COMPARISON_TIMELINE_BEATS,
    translateY: 18,
  });
  const heartsProgress = beatProgress(progress, 14, 2, COMPARISON_TIMELINE_BEATS);

  useEffect(() => {
    if (!swapCueTriggeredRef.current && boardSwapped) {
      playCue("scene.hmmmm");
      swapCueTriggeredRef.current = true;
    } else if (swapCueTriggeredRef.current && !boardSwapped) {
      swapCueTriggeredRef.current = false;
    }
  }, [boardSwapped, playCue]);

  useEffect(() => {
    HEARTS.forEach((heart, index) => {
      const hasTriggered = heartCueStateRef.current[index] ?? false;

      if (!hasTriggered && heartsProgress >= heart.delay) {
        playCue("scene.heart-pop");
        heartCueStateRef.current[index] = true;
      } else if (hasTriggered && heartsProgress <= Math.max(0, heart.delay - 0.08)) {
        heartCueStateRef.current[index] = false;
      }
    });
  }, [heartsProgress, playCue]);

  return (
    <div className={openingStyles.content}>
      <div className={openingStyles.comparisonStrip} style={{ opacity: 1, transform: "translateY(0) scale(1)" }}>
        <OpeningSceneTwo
          scene={sceneTwo}
          panelStyle={{
            opacity: 1,
            transform: `translateX(${-50 - sceneTwoShiftPercent}%) scale(1)`,
          }}
          headlineStyle={{
            opacity: sceneTwoHeadlineReveal,
            transform: `translateY(${(1 - sceneTwoHeadlineReveal) * 20}px)`,
          }}
          imageStyle={{
            opacity: sceneTwoBoardReveal,
            transform: `translateY(${(1 - sceneTwoBoardReveal) * 18}px) scale(${0.985 + sceneTwoBoardReveal * 0.015})`,
          }}
          bottomStyle={{
            opacity: sceneTwoQuestionReveal,
            transform: `translateY(${(1 - sceneTwoQuestionReveal) * 16}px)`,
          }}
          boardSwapped={boardSwapped}
        />
        <OpeningSceneThree
          scene={sceneThree}
          panelStyle={{
            opacity: sceneThreeVisible ? 1 : 0,
            transform: `translateX(${150 - sceneThreeSlideProgress * 200}%)`,
          }}
          headlineStyle={fiberHeadlineStyle}
          imageStyle={{
            opacity: fiberImageReveal,
            transform: `translateY(${(1 - fiberImageReveal) * 22}px) scale(${0.97 + fiberImageReveal * 0.03})`,
          }}
          footerLineOneStyle={fiberFooterLineOneStyle}
          footerLineTwoStyle={fiberFooterLineTwoStyle}
          hearts={HEARTS}
          heartsProgress={heartsProgress}
        />
      </div>
    </div>
  );
}
