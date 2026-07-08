import type { RiotRegion } from "@/lib/constants";
import { RiotApiError } from "@/lib/errors";
import { platformHost, routingHost, matchRoutingHost } from "./region";
import { withRiotRateLimit } from "./rate-limiter";

const RIOT_API_KEY = process.env.RIOT_API_KEY ?? "";

async function riotFetch<T>(url: string, methodKey: string): Promise<T> {
  return withRiotRateLimit(methodKey, async () => {
    const res = await fetch(url, {
      headers: { "X-Riot-Token": RIOT_API_KEY },
    });

    if (!res.ok) {
      throw new RiotApiError(`Riot API request failed: ${res.statusText}`, res.status);
    }

    return (await res.json()) as T;
  });
}

export interface RiotAccountDto {
  puuid: string;
  gameName: string;
  tagLine: string;
}

export interface RiotSummonerDto {
  id: string;
  puuid: string;
  summonerLevel: number;
  profileIconId: number;
}

export const riotClient = {
  async getAccountByRiotId(region: RiotRegion, gameName: string, tagLine: string) {
    const url = `${routingHost(region)}/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(
      gameName
    )}/${encodeURIComponent(tagLine)}`;
    return riotFetch<RiotAccountDto>(url, "account-by-riot-id");
  },

  async getSummonerByPuuid(region: RiotRegion, puuid: string) {
    const url = `${platformHost(region)}/lol/summoner/v4/summoners/by-puuid/${puuid}`;
    return riotFetch<RiotSummonerDto>(url, "summoner-by-puuid");
  },

  async getMatchIdsByPuuid(region: RiotRegion, puuid: string, start: number, count: number) {
    const url = `${matchRoutingHost(region)}/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${start}&count=${count}`;
    return riotFetch<string[]>(url, "match-ids-by-puuid");
  },

  async getMatchById(region: RiotRegion, matchId: string) {
    const url = `${matchRoutingHost(region)}/lol/match/v5/matches/${matchId}`;
    return riotFetch<unknown>(url, "match-by-id");
  },
};
