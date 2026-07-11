import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { championIconUrl } from "@/lib/ddragon";
import { cn } from "@/lib/utils";
import { formatDuration, formatKda, timeAgo } from "@/lib/format";
import type { MatchSummary } from "@/validation/match-summary";

export function MatchHistoryList({ matches }: { matches: MatchSummary[] }) {
  return (
    <div className="space-y-1.5">
      {matches.map((match) => (
        <div
          key={match.matchId}
          className={cn(
            "grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 rounded-lg border-l-4 bg-muted/40 px-3 py-2",
            match.win ? "border-l-emerald-500" : "border-l-destructive"
          )}
        >
          <Avatar className="h-9 w-9 rounded-md">
            <AvatarImage
              src={championIconUrl(match.championName, match.gameVersion)}
              alt={match.championName}
            />
            <AvatarFallback className="rounded-md text-xs">
              {match.championName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{match.championName}</p>
            <p className="truncate text-xs text-muted-foreground">{match.role || "Unknown role"}</p>
          </div>

          <div className="text-right">
            <p className="text-sm font-medium tabular-nums">
              {match.kills}/{match.deaths}/{match.assists}
            </p>
            <p className="text-xs text-muted-foreground tabular-nums">
              {formatKda(match.kills, match.deaths, match.assists)} · {match.cs} CS
            </p>
          </div>

          <div className="flex flex-col items-end gap-1">
            <Badge variant={match.win ? "default" : "destructive"} className="px-1.5 py-0 text-[0.65rem]">
              {match.win ? "Win" : "Loss"}
            </Badge>
            <p className="text-xs text-muted-foreground tabular-nums">
              {formatDuration(match.gameDuration)} · {timeAgo(new Date(match.gameCreation))}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
