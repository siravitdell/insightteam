import { prisma } from "@/lib/prisma";

export const championStatRepository = {
  findAllByPuuid(puuid: string) {
    return prisma.championStat.findMany({
      where: { puuid },
      orderBy: { games: "desc" },
    });
  },

  upsertAggregate(input: {
    puuid: string;
    championId: number;
    championName: string;
    games: number;
    wins: number;
    losses: number;
    avgKda: number;
    avgCs: number;
    avgVision: number;
  }) {
    return prisma.championStat.upsert({
      where: { puuid_championId: { puuid: input.puuid, championId: input.championId } },
      create: input,
      update: input,
    });
  },
};
