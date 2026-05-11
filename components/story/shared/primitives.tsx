"use client";

import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";

export function cx(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

type AvatarNodeProps = {
  className: string;
  statusClassName: string;
  dotClassName: string;
  avatarClassName: string;
  imageClassName: string;
  nameClassName: string;
  imageSrc: string;
  imageAlt: string;
  name: string;
  statusLabel?: string;
  style?: CSSProperties;
};

type StoryAvatarNodeProps = Omit<AvatarNodeProps, "imageSrc" | "imageAlt" | "name">;

export function AvatarNode({
  className,
  statusClassName,
  dotClassName,
  avatarClassName,
  imageClassName,
  nameClassName,
  imageSrc,
  imageAlt,
  name,
  statusLabel = "Online",
  style,
}: AvatarNodeProps) {
  return (
    <div className={className} style={style}>
      <div className={statusClassName}>
        <span className={dotClassName} />
        <span>{statusLabel}</span>
      </div>
      <div className={avatarClassName}>
        <Image src={imageSrc} alt={imageAlt} fill className={imageClassName} />
      </div>
      <p className={nameClassName}>{name}</p>
    </div>
  );
}

export function PicoAvatarNode(props: StoryAvatarNodeProps) {
  return (
    <AvatarNode
      {...props}
      imageSrc="/shared/pico-avatar.png"
      imageAlt="Pico avatar"
      name="Pico"
    />
  );
}

export function FiberNapAvatarNode(props: StoryAvatarNodeProps) {
  return (
    <AvatarNode
      {...props}
      imageSrc="/chapter1/fiber-nap-avatar.png"
      imageAlt="Fiber Nap avatar"
      name="Fiber Nap"
    />
  );
}

export function LayerCardHeader({
  className,
  iconClassName,
  label,
}: {
  className: string;
  iconClassName: string;
  label: ReactNode;
}) {
  return (
    <div className={className}>
      <Image
        src="/chapter1/icon-block.svg"
        alt=""
        aria-hidden="true"
        width={24}
        height={24}
        className={iconClassName}
      />
      <span>{label}</span>
    </div>
  );
}
