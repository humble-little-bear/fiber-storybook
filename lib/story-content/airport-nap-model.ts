import type { PaymentState } from "./types";

export const paymentExample: PaymentState = {
  deposit: 500,
  ratePerSecond: 0.1,
  elapsedSeconds: 2712,
  paid: 271.2,
  returned: 228.8,
  remaining: 228.8,
  channelStatus: "closed",
  sessionStatus: "settled",
};

export const SCENE_SIX_START_SECONDS = 40 * 60;
export const SCENE_SIX_END_SECONDS = 45 * 60 + 12;
