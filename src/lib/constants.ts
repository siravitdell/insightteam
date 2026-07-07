export const RIOT_REGIONS = ["na1", "euw1", "eun1", "kr", "jp1", "br1", "la1", "la2", "sg2", "tr1", "ru"] as const;
export type RiotRegion = (typeof RIOT_REGIONS)[number];

export const RIOT_REGION_ROUTING: Record<RiotRegion, "americas" | "europe" | "asia"> = {
  na1: "americas",
  br1: "americas",
  la1: "americas",
  la2: "americas",
  euw1: "europe",
  eun1: "europe",
  tr1: "europe",
  ru: "europe",
  kr: "asia",
  jp1: "asia",
  sg2: "asia",
};

export const MATCH_HISTORY_PAGE_SIZE = 20;

export const QUEUE_IDS = {
  RANKED_SOLO: 420,
  RANKED_FLEX: 440,
  NORMAL_DRAFT: 400,
  ARAM: 450,
} as const;
