import { prisma } from "@/lib/prisma";
import type { RiotRegion } from "@/lib/constants";

export const summonerRepository = {
  findByPuuid(puuid: string) {
    return prisma.summoner.findUnique({ where: { puuid } });
  },

  findByRiotId(region: RiotRegion, gameName: string, tagLine: string) {
    return prisma.summoner.findFirst({
      where: { region, gameName, tagLine },
    });
  },

  upsert(input: {
    puuid: string;
    region: RiotRegion;
    gameName: string;
    tagLine: string;
    summonerLevel: number;
    profileIconId: number;
  }) {
    return prisma.summoner.upsert({
      where: { puuid: input.puuid },
      create: input,
      update: {
        gameName: input.gameName,
        tagLine: input.tagLine,
        summonerLevel: input.summonerLevel,
        profileIconId: input.profileIconId,
      },
    });
  },
};
