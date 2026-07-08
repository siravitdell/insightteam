import { useQueries } from "@tanstack/react-query";
import type { ApiResponse } from "@/lib/api-response";
import type { Summoner } from "@/validation/summoner";
import type { MatchSummary } from "@/validation/match-summary";
import type { RiotRegion } from "@/lib/constants";
import { MATCH_HISTORY_PAGE_SIZE } from "@/lib/constants";

export interface TeamRosterEntry {
  riotId: string;
  gameName: string;
  tagLine: string;
  summoner: Summoner | undefined;
  matches: MatchSummary[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: string | null;
}

async function fetchSummoner(region: RiotRegion, gameName: string, tagLine: string): Promise<Summoner> {
  const params = new URLSearchParams({ region, gameName, tagLine });
  const res = await fetch(`/api/riot/summoner?${params.toString()}`);
  const json = (await res.json()) as ApiResponse<Summoner>;
  if ("error" in json) throw new Error(json.error.message);
  return json.data;
}

async function fetchMatches(region: RiotRegion, puuid: string, count: number): Promise<MatchSummary[]> {
  const params = new URLSearchParams({ region, puuid, start: "0", count: String(count) });
  const res = await fetch(`/api/riot/matches?${params.toString()}`);
  const json = (await res.json()) as ApiResponse<MatchSummary[]>;
  if ("error" in json) throw new Error(json.error.message);
  return json.data;
}

/**
 * Parses "gameName#tagLine" pairs and fetches each summoner + their recent
 * matches in parallel, without going through the AI team-analysis endpoint.
 */
export function useTeamRoster(
  region: RiotRegion,
  riotIds: string[],
  matchCount: number = MATCH_HISTORY_PAGE_SIZE
): TeamRosterEntry[] {
  const parsed = riotIds.map((riotId) => {
    const [gameName, tagLine] = riotId.split("#").map((part) => part?.trim() ?? "");
    return { riotId, gameName, tagLine };
  });

  const summonerQueries = useQueries({
    queries: parsed.map(({ gameName, tagLine }) => ({
      queryKey: ["summoner", region, gameName, tagLine],
      queryFn: () => fetchSummoner(region, gameName, tagLine),
      enabled: Boolean(gameName && tagLine),
      staleTime: 1000 * 60 * 5,
    })),
  });

  const matchQueries = useQueries({
    queries: summonerQueries.map((summonerQuery) => ({
      queryKey: ["match-history", region, summonerQuery.data?.puuid, matchCount],
      queryFn: () => fetchMatches(region, summonerQuery.data!.puuid, matchCount),
      enabled: Boolean(summonerQuery.data?.puuid),
      staleTime: 1000 * 60,
    })),
  });

  return parsed.map((entry, index) => {
    const summonerQuery = summonerQueries[index];
    const matchQuery = matchQueries[index];

    return {
      ...entry,
      summoner: summonerQuery.data,
      matches: matchQuery.data,
      isLoading: summonerQuery.isLoading || (Boolean(summonerQuery.data) && matchQuery.isLoading),
      isError: summonerQuery.isError || matchQuery.isError,
      error:
        (summonerQuery.error instanceof Error && summonerQuery.error.message) ||
        (matchQuery.error instanceof Error && matchQuery.error.message) ||
        null,
    };
  });
}
