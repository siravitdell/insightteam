import { RIOT_REGION_ROUTING, type RiotRegion } from "@/lib/constants";

export function toRoutingRegion(region: RiotRegion): string {
  return RIOT_REGION_ROUTING[region];
}

export function platformHost(region: RiotRegion): string {
  return `https://${region}.api.riotgames.com`;
}

export function routingHost(region: RiotRegion): string {
  return `https://${toRoutingRegion(region)}.api.riotgames.com`;
}

/**
 * match-v5 for the merged SEA platform (sg2) routes through the "sea" continent
 * cluster, while account-v1/summoner-v4 for sg2 still route through "asia".
 */
export function matchRoutingHost(region: RiotRegion): string {
  const continent = region === "sg2" ? "sea" : toRoutingRegion(region);
  return `https://${continent}.api.riotgames.com`;
}
