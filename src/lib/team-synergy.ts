import type { TeamRosterEntry } from "@/hooks/useTeamRoster";

export interface PlayerStat {
  riotId: string;
  games: number;
  wins: number;
}

export interface ChampionComboStat {
  championA: string;
  championB: string;
  games: number;
  wins: number;
}

export interface DuoStat {
  playerA: string;
  playerB: string;
  gamesTogether: number;
  winsTogether: number;
  combos: ChampionComboStat[];
}

export interface TeamSynergy {
  players: PlayerStat[];
  duos: DuoStat[];
}

function loadedEntries(roster: TeamRosterEntry[]) {
  return roster.filter((entry) => entry.summoner && entry.matches);
}

export function computeTeamSynergy(roster: TeamRosterEntry[]): TeamSynergy {
  const entries = loadedEntries(roster);

  const players: PlayerStat[] = entries.map((entry) => ({
    riotId: entry.riotId,
    games: entry.matches!.length,
    wins: entry.matches!.filter((m) => m.win).length,
  }));

  const duos: DuoStat[] = [];

  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const a = entries[i];
      const b = entries[j];
      const bMatchesById = new Map(b.matches!.map((m) => [m.matchId, m]));

      let gamesTogether = 0;
      let winsTogether = 0;
      const comboMap = new Map<string, ChampionComboStat>();

      for (const matchA of a.matches!) {
        const matchB = bMatchesById.get(matchA.matchId);
        if (!matchB) continue;
        // Same win outcome means they were on the same team; opposite means they faced each other.
        if (matchA.win !== matchB.win) continue;

        gamesTogether += 1;
        if (matchA.win) winsTogether += 1;

        const comboKey = `${matchA.championName}|${matchB.championName}`;
        const existing = comboMap.get(comboKey);
        if (existing) {
          existing.games += 1;
          if (matchA.win) existing.wins += 1;
        } else {
          comboMap.set(comboKey, {
            championA: matchA.championName,
            championB: matchB.championName,
            games: 1,
            wins: matchA.win ? 1 : 0,
          });
        }
      }

      if (gamesTogether > 0) {
        const combos = Array.from(comboMap.values()).sort((x, y) => {
          const winRateDiff = y.wins / y.games - x.wins / x.games;
          if (winRateDiff !== 0) return winRateDiff;
          return y.games - x.games;
        });

        duos.push({ playerA: a.riotId, playerB: b.riotId, gamesTogether, winsTogether, combos });
      }
    }
  }

  duos.sort((x, y) => y.gamesTogether - x.gamesTogether);

  return { players, duos };
}
