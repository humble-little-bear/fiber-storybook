"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SoundToggle } from "@/components/sound-toggle";
import { useSound } from "@/components/providers/sound-provider";
import type { ChapterConfig } from "@/lib/story-content";
import { AirportNapChapter } from "./airport-nap-story/airport-nap-chapter";
import { ChapterBubbleMenu } from "./chapter-bubble-menu";
import { EndBanner } from "./end-banner";
import { MultiServiceStory } from "./multi-service-story/multi-service-story";
import { OpeningHeroScene } from "./airport-nap-story/scene-hero";

gsap.registerPlugin(ScrollTrigger);

export function FiberStorybook({
  chapter,
}: {
  chapter: ChapterConfig;
}) {
  const chapterOneRef = useRef<HTMLDivElement | null>(null);
  const chapterTwoRef = useRef<HTMLDivElement | null>(null);
  const scenes = useMemo(() => chapter.scenes, [chapter.scenes]);
  const [activeSceneId, setActiveSceneId] = useState(scenes[0]?.id ?? "");
  const [chapterProgress, setChapterProgress] = useState([0, 0]);
  const { setSoundscape } = useSound();
  const activeScene = scenes.find((scene) => scene.id === activeSceneId);
  const activeStageId = activeScene?.stageId ?? "opening-world";

  useLayoutEffect(() => {
    const chapterSections = [chapterOneRef.current, chapterTwoRef.current];
    const triggers = chapterSections.flatMap((section, index) => {
      if (!section) {
        return [];
      }

      return ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          setChapterProgress((previous) => {
            if (previous[index] === self.progress) {
              return previous;
            }

            const next = [...previous];
            next[index] = self.progress;
            return next;
          });
        },
        onLeave: () => {
          setChapterProgress((previous) => {
            if (previous[index] === 1) {
              return previous;
            }

            const next = [...previous];
            next[index] = 1;
            return next;
          });
        },
        onLeaveBack: () => {
          setChapterProgress((previous) => {
            if (previous[index] === 0) {
              return previous;
            }

            const next = [...previous];
            next[index] = 0;
            return next;
          });
        },
      });
    });

    return () => {
      triggers.forEach((trigger) => trigger.kill());
    };
  }, []);

  useEffect(() => {
    if (activeSceneId === "scene-6") {
      setSoundscape("sleep");
      return;
    }

    setSoundscape("airport");
  }, [activeSceneId, setSoundscape]);

  return (
    <main
      className={`relative w-full pt-0 chapter-shell--stage-${activeStageId}`}
    >
      <div
        className="fixed left-0 top-0 z-[60] grid h-2 w-full grid-cols-2 gap-px overflow-hidden bg-[var(--overlay-black-08)] [transform:translateZ(0)]"
        aria-hidden="true"
      >
        {chapterProgress.map((progress, index) => (
          <div key={`chapter-progress-${index}`} className="h-full w-full bg-[var(--overlay-black-08)]">
            <div
              className="h-full w-full origin-left bg-[var(--color-yellow)]"
              style={{ transform: `scaleX(${progress})` }}
            />
          </div>
        ))}
      </div>

      <div className="fixed left-6 top-6 z-[70] max-[720px]:left-4 max-[720px]:top-4">
        <SoundToggle />
      </div>
      <ChapterBubbleMenu />

      <div className="chapter-flow relative z-[2] w-full">
        <OpeningHeroScene />
        <div ref={chapterOneRef}>
          <AirportNapChapter
            scenes={scenes.slice(0, 8)}
            activeSceneId={activeSceneId}
            onActiveChange={setActiveSceneId}
          />
        </div>
        <div ref={chapterTwoRef}>
          <MultiServiceStory
            scenes={scenes.slice(8, 25)}
            activeSceneId={activeSceneId}
            onActiveChange={setActiveSceneId}
          />
        </div>
        <EndBanner />
      </div>
    </main>
  );
}
