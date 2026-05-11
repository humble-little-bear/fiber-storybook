"use client";

import Image from "next/image";
import type { ReactNode } from "react";

export type PhoneSummaryClasses = {
  phoneStoryboard: string;
  phoneStage: string;
  phoneShell: string;
  phoneTopbar: string;
  phoneDot: string;
  phoneSpeaker: string;
  phoneScreen: string;
  badge?: string;
  badgeArt?: string;
  badgeImage?: string;
  title: string;
  summaryCard: string;
  summaryLabel: string;
  summaryValue: string;
  doneButton: string;
};

export type PhoneSummaryCard = {
  label: string;
  value: ReactNode;
  className: string;
};

export function PhoneSummaryPanel({
  classes,
  ariaLabel,
  badge,
  title,
  cards,
  children,
  buttonLabel = "Done",
}: {
  classes: PhoneSummaryClasses;
  ariaLabel: string;
  badge?: {
    src: string;
    alt: string;
  };
  title: ReactNode;
  cards: PhoneSummaryCard[];
  children?: ReactNode;
  buttonLabel?: ReactNode;
}) {
  return (
    <div className={classes.phoneStoryboard} aria-label={ariaLabel}>
      <div className={classes.phoneStage} aria-hidden="true" />

      <div className={classes.phoneShell}>
        <div className={classes.phoneTopbar} aria-hidden="true">
          <span className={classes.phoneDot} />
          <span className={classes.phoneSpeaker} />
        </div>

        <div className={classes.phoneScreen}>
          {badge ? (
            <div className={classes.badge} aria-hidden={badge.alt ? undefined : true}>
              <div className={classes.badgeArt}>
                <Image src={badge.src} alt={badge.alt} fill className={classes.badgeImage} />
              </div>
            </div>
          ) : null}

          <h3 className={classes.title}>{title}</h3>

          {cards.map((card) => (
            <div key={card.label} className={`${classes.summaryCard} ${card.className}`}>
              <span className={classes.summaryLabel}>{card.label}</span>
              <strong className={classes.summaryValue}>{card.value}</strong>
            </div>
          ))}

          {children}

          <div className={classes.doneButton}>{buttonLabel}</div>
        </div>
      </div>
    </div>
  );
}
