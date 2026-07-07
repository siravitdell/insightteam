import { useQuery } from "@tanstack/react-query";
import type { ApiResponse } from "@/lib/api-response";
import type { RiotRegion } from "@/lib/constants";
import { MATCH_HISTORY_PAGE_SIZE } from "@/lib/constants";
import type { MatchSummary } from "@/validation/match-summary";

async function fetchMatchHistory(
  region: RiotRegion,
  puuid: string,
  start: number,
  count: number
): Promise<MatchSummary[]> {
  const params = new URLSearchParams({
    region,
    puuid,
    start: String(start),
    count: String(count),
  });
  const res = await fetch(`/api/riot/matches?${params.toString()}`);
  const json = (await res.json()) as ApiResponse<MatchSummary[]>;

  if ("error" in json) {
    throw new Error(json.error.message);
  }
  return json.data;
}

export function useMatchHistory(region: RiotRegion, puuid: string, start = 0, count = MATCH_HISTORY_PAGE_SIZE) {
  return useQuery({
    queryKey: ["match-history", region, puuid, start, count],
    queryFn: () => fetchMatchHistory(region, puuid, start, count),
    enabled: Boolean(puuid),
    staleTime: 1000 * 60,
  });
}
