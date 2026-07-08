import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatWinRate } from "@/lib/format";
import type { TeamSynergy } from "@/lib/team-synergy";

const MAX_COMBOS_SHOWN = 3;

export function TeamSynergySummary({ synergy }: { synergy: TeamSynergy }) {
  if (synergy.players.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Team synergy (from recent matches)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="mb-2 text-sm font-medium">Individual win rate</h3>
          <ul className="space-y-1 text-sm">
            {synergy.players.map((player) => (
              <li key={player.riotId} className="flex items-center justify-between">
                <span>{player.riotId}</span>
                <span className="text-muted-foreground">
                  {formatWinRate(player.wins, player.games)} ({player.wins}W {player.games - player.wins}L)
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-medium">Played together</h3>
          {synergy.duos.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No shared recent games found between these players.
            </p>
          ) : (
            <ul className="space-y-3">
              {synergy.duos.map((duo) => (
                <li key={`${duo.playerA}-${duo.playerB}`} className="text-sm">
                  <div className="flex items-center justify-between">
                    <span>
                      {duo.playerA} + {duo.playerB}
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{duo.gamesTogether} games</Badge>
                      <span className="text-muted-foreground">
                        {formatWinRate(duo.winsTogether, duo.gamesTogether)} WR together
                      </span>
                    </div>
                  </div>

                  {duo.combos.length > 0 && (
                    <ul className="mt-1.5 space-y-1 border-l pl-3">
                      {duo.combos.slice(0, MAX_COMBOS_SHOWN).map((combo) => (
                        <li
                          key={`${combo.championA}-${combo.championB}`}
                          className="flex items-center justify-between text-xs text-muted-foreground"
                        >
                          <span>
                            {combo.championA} + {combo.championB}
                          </span>
                          <span>
                            {formatWinRate(combo.wins, combo.games)} WR ({combo.games} game
                            {combo.games === 1 ? "" : "s"})
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
