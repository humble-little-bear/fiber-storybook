export type ChapterStatus = "available" | "comingSoon";
export type ChannelStatus = "opening" | "active" | "closing" | "closed";
export type SessionStatus = "browsing" | "starting" | "sleeping" | "ended" | "settled";

export type SceneCopy = {
  eyebrow: string;
  headline: string;
  body: string;
  caption?: string;
};

export type StoryStageId = "opening-world" | "transition-world" | "technical-world" | "settlement-world";
export type StoryBackgroundMode = "airport" | "white" | "warm" | "sleep" | "reveal" | "settlement";

export type SceneConfig = {
  id: string;
  name: string;
  goal: string;
  stageId: StoryStageId;
  backgroundMode: StoryBackgroundMode;
  scrollLength: number;
  sticky: boolean;
  asset: string;
  assetAlt: string;
  copy: SceneCopy;
};

export type ChapterConfig = {
  slug: string;
  title: string;
  summary: string;
  estimatedDuration: string;
  status: ChapterStatus;
  coverAsset: string;
  coverAlt: string;
  scenes: SceneConfig[];
};

export type PaymentState = {
  deposit: number;
  ratePerSecond: number;
  elapsedSeconds: number;
  paid: number;
  returned: number;
  remaining: number;
  channelStatus: ChannelStatus;
  sessionStatus: SessionStatus;
};
