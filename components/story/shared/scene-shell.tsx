"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type DependencyList,
  type ReactNode,
  type RefObject,
} from "react";
import { ScrollTrigger, type ScrollTrigger as ScrollTriggerInstance } from "gsap/ScrollTrigger";
import { useSound, type CueId } from "@/components/providers/sound-provider";
import type { SceneConfig } from "@/lib/story-content";

type PinnedProgressOptions = {
  sectionRef: RefObject<HTMLElement | null>;
  scrollBudgetVh: number | (() => number);
  onProgress: (progress: number, self: ScrollTriggerInstance) => void;
  onEnter?: () => void;
  onEnterBack?: () => void;
  onLeaveBack?: () => void;
  dependencies?: DependencyList;
};

export function usePinnedSectionProgress({
  sectionRef,
  scrollBudgetVh,
  onProgress,
  onEnter,
  onEnterBack,
  onLeaveBack,
  dependencies = [],
}: PinnedProgressOptions) {
  useLayoutEffect(() => {
    const section = sectionRef.current;

    if (!section) {
      return undefined;
    }

    const resolveScrollBudget = () => (typeof scrollBudgetVh === "function" ? scrollBudgetVh() : scrollBudgetVh);

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: () => `+=${(window.innerHeight * Math.max(1, resolveScrollBudget())) / 100}`,
      pin: section,
      pinSpacing: true,
      scrub: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onEnter,
      onEnterBack,
      onLeaveBack,
      onUpdate: (self) => {
        onProgress(self.progress, self);
      },
    });

    return () => trigger.kill();
  }, dependencies);
}

type SceneShellProps = {
  scene: SceneConfig;
  activeSceneId: string;
  onActiveChange: (id: string) => void;
  className?: string;
  stageStyle?: (progress: number) => CSSProperties;
  children: (progress: number) => ReactNode;
};

export function SceneShell({
  scene,
  activeSceneId,
  onActiveChange,
  className,
  stageStyle,
  children,
}: SceneShellProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);

  usePinnedSectionProgress({
    sectionRef,
    scrollBudgetVh: scene.scrollLength - 100,
    onProgress: setProgress,
    dependencies: [scene.scrollLength],
  });

  useEffect(() => {
    if (progress > 0.05 && progress < 0.9 && activeSceneId !== scene.id) {
      onActiveChange(scene.id);
    }
  }, [activeSceneId, onActiveChange, progress, scene.id]);

  return (
    <section
      id={scene.id}
      ref={sectionRef}
      className={`story-scene ${className ?? ""}`}
      style={{ minHeight: "100vh" }}
    >
      <div className="story-stage" style={stageStyle?.(progress)}>
        {children(progress)}
      </div>
    </section>
  );
}

function useCueTrigger(progress: number, cue: CueId, threshold: number, resetThreshold: number) {
  const { playCue } = useSound();
  const firedRef = useRef(false);

  useEffect(() => {
    if (!firedRef.current && progress >= threshold) {
      playCue(cue);
      firedRef.current = true;
    } else if (firedRef.current && progress <= resetThreshold) {
      firedRef.current = false;
    }
  }, [cue, playCue, progress, resetThreshold, threshold]);
}

export function CueWatcher({
  progress,
  cue,
  threshold,
  resetThreshold,
}: {
  progress: number;
  cue: CueId;
  threshold: number;
  resetThreshold: number;
}) {
  useCueTrigger(progress, cue, threshold, resetThreshold);
  return null;
}
