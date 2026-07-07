import type { RiotRegion } from "@/lib/constants";
import { getOrSetCache, CacheTTL } from "@/lib/redis";
import { riotClient } from "@/server/riot/client";
import { matchRepository } from "@/server/repositories/match-repository";
import { isRiotMatchDto } from "@/server/riot/dto";
import type { MatchSummary } from "@/validation/match-summary";
import type { Match, Participant } from "@prisma/client";

function summarizeFromDb(match: Match & { participants: Participant[] }, puuid: string): MatchSummary | null {
  const participant = match.participants.find((p) => p.puuid === puuid);
  if (!participant) return null;

  return {
    matchId: match.matchId,
    gameCreation: match.gameCreation.getTime(),
    gameDuration: match.gameDuration,
    championName: participant.championName,
    win: participant.win,
    kills: participant.kills,
    deaths: participant.deaths,
    assists: participant.assists,
    cs: participant.cs,
    visionScore: participant.visionScore,
    role: participant.role,
  };
}

function summarizeFromRiot(payload: unknown, puuid: string): MatchSummary | null {
  if (!isRiotMatchDto(payload)) return null;

  const participant = payload.info.participants.find((p) => p.puuid === puuid);
  if (!participant) return null;

  return {
    matchId: payload.metadata.matchId,
    gameCreation: payload.info.gameCreation,
    gameDuration: payload.info.gameDuration,
    championName: participant.championName,
    win: participant.win,
    kills: participant.kills,
    deaths: participant.deaths,
    assists: participant.assists,
    cs: participant.totalMinionsKilled + participant.neutralMinionsKilled,
    visionScore: participant.visionScore,
    role: participant.teamPosition || participant.individualPosition,
  };
}

export const matchService = {
  async getMatchHistory(
    region: RiotRegion,
    puuid: string,
    start: number,
    count: number
  ): Promise<MatchSummary[]> {
    const cacheKey = `match-ids:${region}:${puuid}:${start}:${count}`;

    const matchIds = await getOrSetCache(cacheKey, CacheTTL.liveMatch, () =>
      riotClient.getMatchIdsByPuuid(region, puuid, start, count)
    );

    const summaries = await Promise.all(
      matchIds.map(async (matchId) => {
        const payload = await getOrSetCache(`match:${matchId}`, CacheTTL.matchHistory, async () => {
          const existing = await matchRepository.findByMatchId(matchId);
          if (existing) return existing;
          return riotClient.getMatchById(region, matchId);
        });

        if (payload && typeof payload === "object" && "participants" in payload) {
          return summarizeFromDb(payload as Match & { participants: Participant[] }, puuid);
        }
        return summarizeFromRiot(payload, puuid);
      })
    );

    return summaries.filter((s): s is MatchSummary => s !== null);
  },

  getMatchById(matchId: string) {
    return matchRepository.findByMatchId(matchId);
  },
};
