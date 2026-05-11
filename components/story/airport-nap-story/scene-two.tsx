"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import type { SceneConfig } from "@/lib/story-content";
import sceneStyles from "./scene-two.module.css";
import sharedStyles from "./opening-scenes.module.css";

export function OpeningSceneTwo({
  scene,
  panelStyle,
  headlineStyle,
  imageStyle,
  bottomStyle,
  boardSwapped,
}: {
  scene: SceneConfig;
  panelStyle: CSSProperties;
  headlineStyle: CSSProperties;
  imageStyle: CSSProperties;
  bottomStyle: CSSProperties;
  boardSwapped: boolean;
}) {
  return (
    <div className={`${sharedStyles.introPanel} ${sceneStyles.scene}`} style={panelStyle}>
      <p className={sceneStyles.lead} style={headlineStyle}>
        {scene.copy.headline}
      </p>

      <div className={sceneStyles.board} style={imageStyle}>
        <Image
          src={
            boardSwapped
              ? "/chapter1/c1-storyboard-2-end.svg"
              : "/chapter1/c1-storyboard-2-start.svg"
          }
          alt={scene.assetAlt}
          fill
          className={sceneStyles.boardImage}
        />
      </div>

      <div className={sceneStyles.footer}>
        <p className={sceneStyles.question} style={bottomStyle}>
          {scene.copy.body}
        </p>
        <p className={`${sceneStyles.question} ${sceneStyles.questionPlaceholder}`} aria-hidden="true">
          {scene.copy.body}
        </p>
      </div>
    </div>
  );
}
