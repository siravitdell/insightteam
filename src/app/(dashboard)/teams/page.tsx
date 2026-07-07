"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { TeamAnalysisCard } from "@/components/features/team-analysis-card";
import { useTeamAnalysis } from "@/hooks/useTeamAnalysis";

export default function TeamsPage() {
  const [puuidsInput, setPuuidsInput] = useState("");
  const teamAnalysis = useTeamAnalysis();

  function handleAnalyze() {
    const puuids = puuidsInput
      .split(",")
      .map((p) => p.trim())
      .filter(Boolean);

    if (puuids.length === 0) return;

    teamAnalysis.mutate({ puuids, region: "na1" });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Team synergy analysis</h1>
        <p className="text-sm text-muted-foreground">
          Paste up to five summoner PUUIDs to get an AI coaching breakdown of your team.
        </p>
      </div>

      <div className="flex max-w-xl gap-2">
        <Input
          value={puuidsInput}
          onChange={(e) => setPuuidsInput(e.target.value)}
          placeholder="puuid1, puuid2, puuid3..."
        />
        <Button onClick={handleAnalyze} disabled={teamAnalysis.isPending}>
          {teamAnalysis.isPending ? "Analyzing..." : "Analyze"}
        </Button>
      </div>

      {teamAnalysis.isPending && <Skeleton className="h-64 w-full max-w-xl" />}
      {teamAnalysis.isError && (
        <p className="text-sm text-destructive">
          {teamAnalysis.error instanceof Error ? teamAnalysis.error.message : "Analysis failed"}
        </p>
      )}
      {teamAnalysis.data && (
        <div className="max-w-xl">
          <TeamAnalysisCard analysis={teamAnalysis.data} />
        </div>
      )}
    </div>
  );
}
