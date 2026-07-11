import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { SummonerHeader } from "@/components/features/summoner-header";
import { MatchHistoryList } from "@/components/features/match-history-list";
import type { TeamRosterEntry } from "@/hooks/useTeamRoster";
import { cn } from "@/lib/utils";
import { formatWinRate, winRateColorClass } from "@/lib/format";

export function TeamRosterCard({ entry }: { entry: TeamRosterEntry }) {
  if (entry.isLoading) {
    return (
      <Card>
        <CardContent className="space-y-3 p-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (entry.isError || !entry.summoner) {
    return (
      <Card className="border-destructive/30">
        <CardContent className="p-4">
          <p className="text-sm font-medium">{entry.riotId}</p>
          <p className="mt-1 text-sm text-destructive">{entry.error ?? "Summoner not found"}</p>
        </CardContent>
      </Card>
    );
  }

  const matches = entry.matches ?? [];
  const wins = matches.filter((m) => m.win).length;

  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <div className="flex items-start justify-between gap-3">
          <SummonerHeader summoner={entry.summoner} />
          {matches.length > 0 && (
            <div className="shrink-0 text-right">
              <p className={cn("text-lg font-semibold", winRateColorClass(wins, matches.length))}>
                {formatWinRate(wins, matches.length)}
              </p>
              <p className="text-xs text-muted-foreground">
                {wins}W {matches.length - wins}L · last {matches.length}
              </p>
            </div>
          )}
        </div>

        <Separator />

        {matches.length === 0 ? (
          <p className="text-sm text-muted-foreground">No recent matches found.</p>
        ) : (
          <MatchHistoryList matches={matches} />
        )}
      </CardContent>
    </Card>
  );
}
