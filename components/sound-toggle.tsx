"use client";

import Image from "next/image";
import { useSound } from "@/components/providers/sound-provider";

export function SoundToggle() {
  const { enabled, playCue, toggle } = useSound();
  const label = enabled ? "Sound on" : "Sound off";
  const iconSrc = enabled ? "/icon/icon-music-on.svg" : "/icon/icon-music-off.svg";

  return (
    <button
      type="button"
      data-sound-toggle="true"
      className="inline-flex h-11 w-[52px] items-center justify-center rounded-[8px] border-2 border-[var(--color-text-primary)] bg-[var(--color-yellow)] p-[8px_12px] shadow-[var(--shadow-toggle)] transition-[transform,box-shadow,background-color] duration-[180ms] hover:-translate-y-px hover:scale-[1.02] hover:shadow-[var(--shadow-toggle-hover)] active:translate-y-px active:scale-[0.98] active:shadow-[var(--shadow-toggle-active)] focus-visible:outline-[3px] focus-visible:outline-offset-3 focus-visible:outline-[var(--overlay-black-18)] aria-[pressed=false]:bg-[var(--color-bg-white)] max-[720px]:h-10 max-[720px]:w-12 max-[720px]:p-2"
      onMouseEnter={() => playCue("ui.pop")}
      onClick={toggle}
      aria-pressed={enabled}
      aria-label={label}
      title={label}
    >
      <Image
        src={iconSrc}
        alt=""
        aria-hidden="true"
        width={24}
        height={24}
        className="h-6 w-6 max-[720px]:h-[22px] max-[720px]:w-[22px]"
      />
    </button>
  );
}
