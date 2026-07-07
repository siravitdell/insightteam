import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export const matchRepository = {
  findByMatchId(matchId: string) {
    return prisma.match.findUnique({
      where: { matchId },
      include: { participants: true },
    });
  },

  findRecentByPuuid(puuid: string, take: number) {
    return prisma.match.findMany({
      where: { participants: { some: { puuid } } },
      include: { participants: true },
      orderBy: { gameCreation: "desc" },
      take,
    });
  },

  create(input: Prisma.MatchCreateInput) {
    return prisma.match.create({ data: input });
  },
};
