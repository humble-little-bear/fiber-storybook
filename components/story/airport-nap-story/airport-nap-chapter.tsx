"use client";

import { useEffect, useRef, useState } from "react";
import { paymentExample, type SceneConfig } from "@/lib/story-content";
import openingStyles from "./opening-scenes.module.css";
import { SettlementScene } from "./scene-eight";
import { SceneFiveSixSection } from "./scene-five-six-section";
import { TapToStartScene } from "./scene-four";
import { OpeningSceneOne } from "./scene-one";
import { SceneSevenPreviewSurface } from "./scene-seven";
import { SceneTwoThreeSection } from "./scene-two-three-section";
import { beatProgress, CueWatcher, easeOutCubic, SceneShell, scrollToStoryScene } from "../shared";

const SCENE_ONE_TIMELINE_BEATS = 4;
const EXACT_BILLING_TIMELINE_BEATS = 4;

export function AirportNapChapter({
  scenes,
  activeSceneId,
  onActiveChange,
}: {
  scenes: SceneConfig[];
  activeSceneId: string;
  onActiveChange: (id: string) => void;
}) {
  const chapterRef = useRef<HTMLDivElement | null>(null);
  const [sceneSixSnapshot, setSceneSixSnapshot] = useState({
    elapsedSeconds: paymentExample.elapsedSeconds,
    paid: paymentExample.paid,
    remaining: paymentExample.remaining,
    ratePerSecond: paymentExample.ratePerSecond,
  });

  return (
    <div ref={chapterRef}>
      <div className="relative w-full bg-[var(--color-bg-white)]">
        <ChapterBanner chapterLabel="Chapter 1" title="How pay-as-you-use works over time" />
        <SceneOneSection scene={scenes[0]} activeSceneId={activeSceneId} onActiveChange={onActiveChange} />
        <SceneTwoThreeSection
          sceneTwo={scenes[1]}
          sceneThree={scenes[2]}
          activeSceneId={activeSceneId}
          onActiveChange={onActiveChange}
        />
        <TapToStartScene scene={scenes[3]} activeSceneId={activeSceneId} onActiveChange={onActiveChange} />
        <SceneFiveSixSection
          sceneFive={scenes[4]}
          sceneSix={scenes[5]}
          activeSceneId={activeSceneId}
          onActiveChange={onActiveChange}
          onSessionSnapshot={setSceneSixSnapshot}
          onRelease={() => scrollToStoryScene("scene-7")}
        />
      </div>
      <SceneSevenEightSection
        settlementScene={scenes[6]}
        exactBillingScene={scenes[7]}
        activeSceneId={activeSceneId}
        onActiveChange={onActiveChange}
        sessionSnapshot={sceneSixSnapshot}
      />
    </div>
  );
}

function ChapterBanner({ chapterLabel, title }: { chapterLabel: string; title: string }) {
  return (
    <section
      id="chapter-1"
      className="grid min-h-[289px] w-full content-center justify-items-center gap-6 bg-[var(--color-yellow)] px-6 py-16 text-center text-[var(--color-text-primary)]"
      aria-label="Chapter banner"
    >
      <p className="m-0 text-[clamp(32px,3.125vw,40px)] leading-none font-bold [font-family:var(--font-chalk),var(--font-chalk-fallback)]">
        {chapterLabel}
      </p>
      <h2 className="m-0 text-[clamp(42px,4.375vw,56px)] leading-[1.15] font-bold [font-family:var(--font-chalk),var(--font-chalk-fallback)]">
        {title}
      </h2>
    </section>
  );
}

function SceneOneSection({
  scene,
  activeSceneId,
  onActiveChange,
}: {
  scene: SceneConfig;
  activeSceneId: string;
  onActiveChange: (id: string) => void;
}) {
  return (
    <SceneShell
      scene={scene}
      activeSceneId={activeSceneId}
      onActiveChange={onActiveChange}
      stageStyle={() => ({
        background: "transparent",
      })}
    >
      {(progress) => {
        const headlineReveal = easeOutCubic(beatProgress(progress, 0, 1, SCENE_ONE_TIMELINE_BEATS));
        const boardReveal = easeOutCubic(beatProgress(progress, 1, 1, SCENE_ONE_TIMELINE_BEATS));
        const footerOneReveal = easeOutCubic(beatProgress(progress, 2, 1, SCENE_ONE_TIMELINE_BEATS));
        const footerTwoReveal = easeOutCubic(beatProgress(progress, 3, 1, SCENE_ONE_TIMELINE_BEATS));

        return (
          <div className={openingStyles.content}>
            <div className={openingStyles.sceneLayer}>
              <OpeningSceneOne
                scene={scene}
                layerStyle={{
                  opacity: 1,
                  transform: "translateY(0) scale(1)",
                }}
                topStyle={{
                  opacity: headlineReveal,
                  transform: `translateY(${(1 - headlineReveal) * 24}px) scale(1)`,
                }}
                imageStyle={{
                  opacity: boardReveal,
                  transform: `translateY(${(1 - boardReveal) * 28}px) scale(${0.96 + boardReveal * 0.04})`,
                  transformOrigin: "center center",
                }}
                footerLineOneStyle={{
                  opacity: footerOneReveal,
                  transform: `translateY(${(1 - footerOneReveal) * 18}px) scale(1)`,
                }}
                footerLineTwoStyle={{
                  opacity: footerTwoReveal,
                  transform: `translateY(${(1 - footerTwoReveal) * 18}px) scale(1)`,
                }}
              />
            </div>
          </div>
        );
      }}
    </SceneShell>
  );
}

function SceneSevenEightSection({
  settlementScene,
  exactBillingScene,
  activeSceneId,
  onActiveChange,
  sessionSnapshot,
}: {
  settlementScene: SceneConfig;
  exactBillingScene: SceneConfig;
  activeSceneId: string;
  onActiveChange: (id: string) => void;
  sessionSnapshot: {
    elapsedSeconds: number;
    paid: number;
    remaining: number;
    ratePerSecond: number;
  };
}) {
  return (
    <div className="story-scene-pair">
      <SettlementScene scene={settlementScene} activeSceneId={activeSceneId} onActiveChange={onActiveChange} />

      <SceneShell
        scene={exactBillingScene}
        activeSceneId={activeSceneId}
        onActiveChange={onActiveChange}
        className="story-scene--exact-billing"
        stageStyle={() => ({ background: "var(--color-bg-white)" })}
      >
        {(progress) => {
          const leftReveal = easeOutCubic(beatProgress(progress, 0, 1, EXACT_BILLING_TIMELINE_BEATS));
          const leftEndReveal = easeOutCubic(beatProgress(progress, 1, 1, EXACT_BILLING_TIMELINE_BEATS));
          const rightReveal = easeOutCubic(beatProgress(progress, 2, 1, EXACT_BILLING_TIMELINE_BEATS));

          return (
            <>
            <CueWatcher
              progress={progress}
              cue="scene.phone-vibrate"
              threshold={1 / EXACT_BILLING_TIMELINE_BEATS}
              resetThreshold={0.08}
            />
            <SceneSevenPreviewSurface
              leftReveal={leftReveal}
              leftEndReveal={leftEndReveal}
              rightReveal={rightReveal}
              paid={sessionSnapshot.paid}
              remaining={sessionSnapshot.remaining}
              elapsedSeconds={sessionSnapshot.elapsedSeconds}
              ratePerSecond={sessionSnapshot.ratePerSecond}
            />
            </>
          );
        }}
      </SceneShell>
    </div>
  );
}
