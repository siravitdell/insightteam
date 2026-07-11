"use client";

import { useMemo, useState } from "react";
import { TeamRosterForm } from "@/components/features/team-roster-form";
import { TeamRosterCard } from "@/components/features/team-roster-card";
import { TeamSynergySummary } from "@/components/features/team-synergy-summary";
import { useTeamRoster } from "@/hooks/useTeamRoster";
import { computeTeamSynergy } from "@/lib/team-synergy";
import type { RiotRegion } from "@/lib/constants";

const MATCH_COUNT = 10;

export default function TeamsPage() {
  const [query, setQuery] = useState<{ region: RiotRegion; riotIds: string[] } | null>(null);
  const roster = useTeamRoster(query?.region ?? "sg2", query?.riotIds ?? [], MATCH_COUNT);
  const synergy = useMemo(() => computeTeamSynergy(roster), [roster]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Analyze team</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add 2 to 5 Riot IDs to see each player&apos;s profile, recent match history, and how
          often they win when playing together.
        </p>
      </div>

      <TeamRosterForm onSubmit={(region, riotIds) => setQuery({ region, riotIds })} />

      {query && (
        <div className="space-y-6">
          <TeamSynergySummary synergy={synergy} />
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}
          >
            {roster.map((entry) => (
              <TeamRosterCard key={entry.riotId} entry={entry} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
