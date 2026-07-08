import type { RiotRegion } from "@/lib/constants";
import { getOrSetCache, CacheTTL } from "@/lib/redis";
import { riotClient } from "@/server/riot/client";
import { summonerRepository } from "@/server/repositories/summoner-repository";
import { RiotApiError, SummonerNotFoundError } from "@/lib/errors";
import type { Summoner } from "@/validation/summoner";

export const summonerService = {
  async lookupByRiotId(region: RiotRegion, gameName: string, tagLine: string): Promise<Summoner> {
    const cacheKey = `summoner:${region}:${gameName}:${tagLine}`.toLowerCase();

    return getOrSetCache(cacheKey, CacheTTL.summonerProfile, async () => {
      let account;
      try {
        account = await riotClient.getAccountByRiotId(region, gameName, tagLine);
      } catch (error) {
        if (error instanceof RiotApiError && error.status === 404) {
          throw new SummonerNotFoundError(gameName, tagLine);
        }
        throw error;
      }

      // Riot sometimes privacy-filters summoner-v4/by-puuid ("implementationDetails":"filtered")
      // even for real, existing accounts. Fall back to placeholder cosmetic data rather than
      // failing the whole lookup, since the account/match data is still valid.
      let summonerLevel = 0;
      let profileIconId = 0;
      try {
        const summonerDto = await riotClient.getSummonerByPuuid(region, account.puuid);
        summonerLevel = summonerDto.summonerLevel;
        profileIconId = summonerDto.profileIconId;
      } catch (error) {
        if (!(error instanceof RiotApiError && error.status === 404)) {
          throw error;
        }
      }

      const summoner = await summonerRepository.upsert({
        puuid: account.puuid,
        region,
        gameName: account.gameName,
        tagLine: account.tagLine,
        summonerLevel,
        profileIconId,
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
