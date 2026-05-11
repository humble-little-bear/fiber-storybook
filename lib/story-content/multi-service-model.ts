export const MULTI_SERVICE_TOTAL_CKB = 1000;
export const MULTI_SERVICE_START_REMAINING_CKB = 113;
export const MULTI_SERVICE_END_REMAINING_CKB = 104;
export const MULTI_SERVICE_ACTIVE_WINDOW_SECONDS = 30;
export const MULTI_SERVICE_CKB_RATE_PER_SECOND = 0.3;

export const multiServiceDefaultSettlement = {
  remaining: 104,
  used: 896,
  total: 1000,
  serviceSeconds: {
    luggage: 4800,
    power: 2400,
    massage: 86,
  },
};

export const multiServiceServices = [
  {
    key: "luggage",
    name: "Luggage storage",
    rate: "Rate: 0.1 CKB / sec",
    pill: "Paying 0.1 CKB / sec",
    ckbEquivalentPerSecond: 0.1,
    endSeconds: 4800,
    startSeconds: 4770,
    imageSrc: "/chapter2/luggage-avatar.png",
    imageAlt: "Luggage storage avatar",
  },
  {
    key: "power",
    name: "Power bank",
    rate: "Rate: 0.1 SUDT / sec",
    pill: "Paying 0.1 SUDT / sec",
    ckbEquivalentPerSecond: 0.1,
    endSeconds: 2400,
    startSeconds: 2370,
    imageSrc: "/chapter2/power-bank-avatar.png",
    imageAlt: "Power bank avatar",
  },
  {
    key: "massage",
    name: "Massage chair",
    rate: "Rate: 0.1 USD / sec",
    pill: "Paying 0.1 USD / sec",
    ckbEquivalentPerSecond: 0.1,
    endSeconds: 86,
    startSeconds: 56,
    imageSrc: "/chapter2/massage-avatar.png",
    imageAlt: "Massage chair avatar",
  },
] as const;

export type MultiServiceKey = (typeof multiServiceServices)[number]["key"];
