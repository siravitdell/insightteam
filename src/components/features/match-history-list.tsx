import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { championIconUrl } from "@/lib/ddragon";
import { formatDuration, formatKda, timeAgo } from "@/lib/format";
import type { MatchSummary } from "@/validation/match-summary";

export function MatchHistoryList({ matches }: { matches: MatchSummary[] }) {
  return (
    <div className="space-y-2">
      {matches.map((match) => (
        <Card key={match.matchId} className="py-3">
          <CardContent className="flex items-center justify-between gap-4 px-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 rounded-md">
                <AvatarImage
                  src={championIconUrl(match.championName, match.gameVersion)}
                  alt={match.championName}
                />
                <AvatarFallback className="rounded-md">
                  {match.championName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Badge variant={match.win ? "default" : "destructive"}>
                {match.win ? "Win" : "Loss"}
              </Badge>
              <div>
                <p className="text-sm font-medium">{match.championName}</p>
                <p className="text-xs text-muted-foreground">{match.role || "Unknown role"}</p>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm font-medium">
                {formatKda(match.kills, match.deaths, match.assists)}
              </p>
              <p className="text-xs text-muted-foreground">
                {match.kills}/{match.deaths}/{match.assists} · {match.cs} CS
              </p>
            </div>

            <div className="text-right text-xs text-muted-foreground">
              <p>{formatDuration(match.gameDuration)}</p>
              <p>{timeAgo(new Date(match.gameCreation))}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
