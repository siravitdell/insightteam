import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { formatWinRate, winRateColorClass } from "@/lib/format";
import type { TeamSynergy } from "@/lib/team-synergy";

const MAX_COMBOS_SHOWN = 5;

export function TeamSynergySummary({ synergy }: { synergy: TeamSynergy }) {
  if (synergy.players.length === 0) return null;

  const playerNames = synergy.players.map((p) => p.riotId);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team synergy (games played together)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-1.5">
          {playerNames.map((name) => (
            <Badge key={name} variant="secondary" className="font-normal">
              {name}
            </Badge>
          ))}
        </div>

        {synergy.sharedGames === 0 ? (
          <p className="text-sm text-muted-foreground">
            No recent games found where this whole group played together on the same team.
          </p>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "text-lg font-semibold tabular-nums",
                  winRateColorClass(synergy.sharedWins, synergy.sharedGames)
                )}
              >
                {formatWinRate(synergy.sharedWins, synergy.sharedGames)}
              </span>
              <span className="text-sm text-muted-foreground">
                {synergy.sharedWins}W {synergy.sharedGames - synergy.sharedWins}L across{" "}
                {synergy.sharedGames} game{synergy.sharedGames === 1 ? "" : "s"} together
              </span>
            </div>

            <Separator />

            <div>
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                Champion combos when playing together
              </h3>
              <ul className="space-y-1.5">
                {synergy.combos.slice(0, MAX_COMBOS_SHOWN).map((combo) => (
                  <li
                    key={combo.champions.join("|")}
                    className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 rounded-md bg-muted/40 px-3 py-1.5 text-sm"
                  >
                    <span className="flex flex-wrap gap-x-1 gap-y-0.5">
                      {combo.champions.map((champ, i) => (
                        <span key={`${champ}-${i}`}>
                          {champ}
                          {i < combo.champions.length - 1 && <span className="text-muted-foreground"> +</span>}
                        </span>
                      ))}
                    </span>
                    <span
                      className={cn(
                        "shrink-0 font-medium tabular-nums",
                        winRateColorClass(combo.wins, combo.games)
                      )}
                    >
                      {formatWinRate(combo.wins, combo.games)} ({combo.games} game
                      {combo.games === 1 ? "" : "s"})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
