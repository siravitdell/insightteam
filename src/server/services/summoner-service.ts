import type { RiotRegion } from "@/lib/constants";
import { getOrSetCache, CacheTTL } from "@/lib/redis";
import { riotClient } from "@/server/riot/client";
import { summonerRepository } from "@/server/repositories/summoner-repository";
import type { Summoner } from "@/validation/summoner";

export const summonerService = {
  async lookupByRiotId(region: RiotRegion, gameName: string, tagLine: string): Promise<Summoner> {
    const cacheKey = `summoner:${region}:${gameName}:${tagLine}`.toLowerCase();

    return getOrSetCache(cacheKey, CacheTTL.summonerProfile, async () => {
      const account = await riotClient.getAccountByRiotId(region, gameName, tagLine);
      const summonerDto = await riotClient.getSummonerByPuuid(region, account.puuid);

      const summoner = await summonerRepository.upsert({
        puuid: account.puuid,
        region,
        gameName: account.gameName,
        tagLine: account.tagLine,
        summonerLevel: summonerDto.summonerLevel,
        profileIconId: summonerDto.profileIconId,
      });

      return {
        id: summoner.id,
        puuid: summoner.puuid,
        region: summoner.region as RiotRegion,
        gameName: summoner.gameName,
        tagLine: summoner.tagLine,
        summonerLevel: summoner.summonerLevel,
        profileIconId: summoner.profileIconId,
      };
    });
  },
};
