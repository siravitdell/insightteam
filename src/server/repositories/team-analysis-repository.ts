import { prisma } from "@/lib/prisma";
import type { TeamAnalysisResult } from "@/validation/team-analysis";

export const teamAnalysisRepository = {
  findByRosterHash(rosterHash: string) {
    return prisma.teamAnalysis.findUnique({ where: { rosterHash } });
  },

  create(rosterHash: string, summonerId: string | null, result: TeamAnalysisResult) {
    return prisma.teamAnalysis.create({
      data: {
        rosterHash,
        summonerId,
        summary: result.summary,
        synergyScore: result.synergyScore,
        strengths: result.strengths,
        weaknesses: result.weaknesses,
        recommendations: result.recommendations,
      },
    });
  },
};
