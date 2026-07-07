"use client";

import { use } from "react";
import { useSummoner } from "@/hooks/useSummoner";
import { useMatchHistory } from "@/hooks/useMatchHistory";
import { SummonerHeader } from "@/components/features/summoner-header";
import { MatchHistoryList } from "@/components/features/match-history-list";
import { Skeleton } from "@/components/ui/skeleton";
import type { RiotRegion } from "@/lib/constants";

function parseRiotId(name: string): { gameName: string; tagLine: string } {
  const [gameName, tagLine] = name.split("-");
  return { gameName: gameName ?? "", tagLine: tagLine ?? "" };
}

export default function SummonerPage({
  params,
}: {
  params: Promise<{ region: string; name: string }>;
}) {
  const { region, name } = use(params);
  const { gameName, tagLine } = parseRiotId(decodeURIComponent(name));

  const summonerQuery = useSummoner(region as RiotRegion, gameName, tagLine);
  const matchHistoryQuery = useMatchHistory(
    region as RiotRegion,
    summonerQuery.data?.puuid ?? ""
  );

  if (summonerQuery.isLoading) {
    return <Skeleton className="h-16 w-full max-w-md" />;
  }

  if (summonerQuery.isError || !summonerQuery.data) {
    return (
      <p className="text-sm text-destructive">
        {summonerQuery.error instanceof Error ? summonerQuery.error.message : "Summoner not found"}
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <SummonerHeader summoner={summonerQuery.data} />

      <section>
        <h2 className="mb-4 text-lg font-medium">Recent matches</h2>
        {matchHistoryQuery.isLoading && <Skeleton className="h-40 w-full" />}
        {matchHistoryQuery.isError && (
          <p className="text-sm text-destructive">Failed to load match history.</p>
        )}
        {matchHistoryQuery.data && matchHistoryQuery.data.length === 0 && (
          <p className="text-sm text-muted-foreground">No recent matches found.</p>
        )}
        {matchHistoryQuery.data && matchHistoryQuery.data.length > 0 && (
          <MatchHistoryList matches={matchHistoryQuery.data} />
        )}
      </section>
    </div>
  );
}
