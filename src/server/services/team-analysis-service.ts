import crypto from "node:crypto";
import { championStatRepository } from "@/server/repositories/champion-stat-repository";
import { teamAnalysisRepository } from "@/server/repositories/team-analysis-repository";
import { generateTeamSynergyAnalysis } from "@/server/ai/coach";
import type { TeamAnalysisRequest, TeamAnalysisResult } from "@/validation/team-analysis";

function hashRoster(puuids: string[]): string {
  const sorted = [...puuids].sort();
  return crypto.createHash("sha256").update(sorted.join(",")).digest("hex");
}

export const teamAnalysisService = {
  async analyzeTeam(request: TeamAnalysisRequest): Promise<TeamAnalysisResult> {
    const rosterHash = hashRoster(request.puuids);

    const cached = await teamAnalysisRepository.findByRosterHash(rosterHash);
    if (cached) {
      return {
        summary: cached.summary,
        synergyScore: cached.synergyScore,
        strengths: cached.strengths as string[],
        weaknesses: cached.weaknesses as string[],
        recommendations: cached.recommendations as string[],
      };
    }

    const players = await Promise.all(
      request.puuids.map(async (puuid) => {
        const championStats = await championStatRepository.findAllByPuuid(puuid);
        const totalGames = championStats.reduce((sum, c) => sum + c.games, 0);
        const totalWins = championStats.reduce((sum, c) => sum + c.wins, 0);

        return {
          gameName: puuid,
          championPool: championStats.map((c) => c.championName),
          winRate: totalGames === 0 ? 0 : totalWins / totalGames,
          avgKda: championStats.reduce((sum, c) => sum + c.avgKda, 0) / (championStats.length || 1),
          role: "unknown",
        };
      })
    );

    const result = await generateTeamSynergyAnalysis({ players, recentMatches: [] });

    await teamAnalysisRepository.create(rosterHash, null, result);

    return result;
  },
};
