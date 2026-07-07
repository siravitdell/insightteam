import { useQuery } from "@tanstack/react-query";
import type { ApiResponse } from "@/lib/api-response";
import type { Summoner } from "@/validation/summoner";
import type { RiotRegion } from "@/lib/constants";

async function fetchSummoner(region: RiotRegion, gameName: string, tagLine: string): Promise<Summoner> {
  const params = new URLSearchParams({ region, gameName, tagLine });
  const res = await fetch(`/api/riot/summoner?${params.toString()}`);
  const json = (await res.json()) as ApiResponse<Summoner>;

  if ("error" in json) {
    throw new Error(json.error.message);
  }
  return json.data;
}

export function useSummoner(region: RiotRegion, gameName: string, tagLine: string) {
  return useQuery({
    queryKey: ["summoner", region, gameName, tagLine],
    queryFn: () => fetchSummoner(region, gameName, tagLine),
    enabled: Boolean(region && gameName && tagLine),
    staleTime: 1000 * 60 * 5,
  });
}
