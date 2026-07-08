import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { SummonerHeader } from "@/components/features/summoner-header";
import { MatchHistoryList } from "@/components/features/match-history-list";
import type { TeamRosterEntry } from "@/hooks/useTeamRoster";
import { formatWinRate } from "@/lib/format";

export function TeamRosterCard({ entry }: { entry: TeamRosterEntry }) {
  if (entry.isLoading) {
    return (
      <Card>
        <CardContent className="space-y-3 p-4">
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (entry.isError || !entry.summoner) {
    return (
      <Card>
        <CardContent className="p-4">
          <p className="text-sm font-medium">{entry.riotId}</p>
          <p className="text-sm text-destructive">{entry.error ?? "Summoner not found"}</p>
        </CardContent>
      </Card>
    );
  }

  const matches = entry.matches ?? [];
  const wins = matches.filter((m) => m.win).length;

  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <SummonerHeader summoner={entry.summoner} />
          {matches.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {formatWinRate(wins, matches.length)} WR ({wins}W {matches.length - wins}L, last{" "}
              {matches.length})
            </p>
          )}
        </div>

        {matches.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent matches found.</p>
        ) : (
          <MatchHistoryList matches={matches} />
        )}
      </CardContent>
    </Card>
  );
}
