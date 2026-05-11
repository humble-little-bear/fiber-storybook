"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import type { SceneConfig } from "@/lib/story-content";
import { clamp01 } from "../shared";
import sceneStyles from "./scene-three.module.css";
import sharedStyles from "./opening-scenes.module.css";

type Heart = {
  delay: number;
  left: number;
  top: number;
  sizeClassName: string;
  positionClassName: string;
};

export function OpeningSceneThree({
  scene,
  panelStyle,
  headlineStyle,
  imageStyle,
  footerLineOneStyle,
  footerLineTwoStyle,
  hearts,
  heartsProgress,
}: {
  scene: SceneConfig;
  panelStyle: CSSProperties;
  headlineStyle: CSSProperties;
  imageStyle: CSSProperties;
  footerLineOneStyle: CSSProperties;
  footerLineTwoStyle: CSSProperties;
  hearts: Heart[];
  heartsProgress: number;
}) {
  return (
    <>
      <div className={`${sharedStyles.introPanel} ${sceneStyles.scene}`} style={panelStyle}>
        <p className={sceneStyles.lead} style={headlineStyle}>
          {scene.copy.headline}
        </p>

        <div className={sceneStyles.board} style={imageStyle}>
          <Image
            src="/chapter1/c1-storyboard-3.svg"
            alt={scene.assetAlt}
            fill
            className={sceneStyles.boardImage}
          />
        </div>

        <div className={sceneStyles.footer}>
          <p style={footerLineOneStyle}>{scene.copy.body}</p>
          <p style={footerLineTwoStyle}>{scene.copy.caption}</p>
        </div>
      </div>

      <div className={sceneStyles.hearts} aria-hidden="true">
        {hearts.map((heart) => {
          const local = clamp01((heartsProgress - heart.delay) / 0.28);

          return (
            <div
              key={`${heart.positionClassName}-${heart.sizeClassName}`}
              className={[sceneStyles.heart, sceneStyles[heart.positionClassName], sceneStyles[heart.sizeClassName]]
                .filter(Boolean)
                .join(" ")}
              style={{
                left: `${heart.left}%`,
                top: `${heart.top}%`,
                opacity: local,
                transform: `translate(-50%, -50%) translate(${(1 - local) * (50 - heart.left)}vw, ${(1 - local) * (100 - heart.top)}vh) scale(${0.28 + local * 0.72})`,
              }}
            >
              <Image src="/chapter1/heart.svg" alt="" width={48} height={44} />
            </div>
          );
        })}
      </div>
    </>
  );
}
