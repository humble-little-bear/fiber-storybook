"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import type { SceneConfig } from "@/lib/story-content";
import sceneStyles from "./scene-one.module.css";
import sharedStyles from "./opening-scenes.module.css";

export function OpeningSceneOne({
  scene,
  layerStyle,
  topStyle,
  imageStyle,
  footerLineOneStyle,
  footerLineTwoStyle,
}: {
  scene: SceneConfig;
  layerStyle: CSSProperties;
  topStyle: CSSProperties;
  imageStyle: CSSProperties;
  footerLineOneStyle: CSSProperties;
  footerLineTwoStyle: CSSProperties;
}) {
  return (
    <div className={sharedStyles.introOpening} style={layerStyle}>
      <div className={`${sharedStyles.introPanel} ${sceneStyles.scene}`}>
        <p className={sceneStyles.lead} style={topStyle}>
          {scene.copy.headline}
        </p>

        <div className={sceneStyles.board} style={imageStyle}>
          <div className={sceneStyles.boardFrame}>
            <Image
              src="/chapter1/c1-storyboard-1-start.svg"
              alt={scene.assetAlt}
              fill
              priority
              className={sceneStyles.boardImage}
            />
          </div>
        </div>

        <div className={sceneStyles.footer}>
          <p style={footerLineOneStyle}>{scene.copy.body}</p>
          <p style={footerLineTwoStyle}>{scene.copy.caption}</p>
        </div>
      </div>
    </div>
  );
}
