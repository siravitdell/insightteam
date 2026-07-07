import { notFound } from "next/navigation";
import { matchService } from "@/server/services/match-service";
import { matchIdSchema } from "@/validation/match";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDuration, formatKda } from "@/lib/format";

export default async function MatchDetailPage({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const { matchId } = await params;

  const parsed = matchIdSchema.safeParse(matchId);
  if (!parsed.success) {
    notFound();
  }

  const match = await matchService.getMatchById(matchId);
  if (!match) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Match {match.matchId}</h1>
        <p className="text-sm text-muted-foreground">
          Duration: {formatDuration(match.gameDuration)} · Patch {match.gameVersion}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Participants</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="divide-y">
            {match.participants.map((participant) => (
              <li key={participant.id} className="flex items-center justify-between py-2 text-sm">
                <span>{participant.championName}</span>
                <span className="text-muted-foreground">
                  {formatKda(participant.kills, participant.deaths, participant.assists)}
                </span>
                <span className={participant.win ? "text-emerald-500" : "text-destructive"}>
                  {participant.win ? "Win" : "Loss"}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
