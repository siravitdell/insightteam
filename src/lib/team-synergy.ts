import type { TeamRosterEntry } from "@/hooks/useTeamRoster";
import type { MatchSummary } from "@/validation/match-summary";

export interface PlayerStat {
  riotId: string;
  games: number;
  wins: number;
}

export interface ChampionComboStat {
  champions: string[];
  games: number;
  wins: number;
}

export interface TeamSynergy {
  players: PlayerStat[];
  sharedGames: number;
  sharedWins: number;
  combos: ChampionComboStat[];
}

function loadedEntries(roster: TeamRosterEntry[]) {
  return roster.filter((entry) => entry.summoner && entry.matches);
}

/**
 * Finds matches where every player in the roster appears together on the
 * same team (same win outcome). Only these shared matches feed the stats
 * below, since the goal is "how does this exact group perform together",
 * not each player's unrelated solo win rate.
 */
function findSharedMatches(entries: TeamRosterEntry[]): MatchSummary[][] {
  if (entries.length < 2) return [];

  const [first, ...rest] = entries;
  const restMaps = rest.map((entry) => new Map(entry.matches!.map((m) => [m.matchId, m])));

  const shared: MatchSummary[][] = [];

  for (const matchA of first.matches!) {
    const row: MatchSummary[] = [matchA];
    let allPresent = true;

    for (const map of restMaps) {
      const match = map.get(matchA.matchId);
      if (!match || match.win !== matchA.win) {
        allPresent = false;
        break;
      }
      row.push(match);
    }

    if (allPresent) shared.push(row);
  }

  return shared;
}

export function computeTeamSynergy(roster: TeamRosterEntry[]): TeamSynergy {
  const entries = loadedEntries(roster);

  if (entries.length < 2) {
    return { players: entries.map((e) => ({ riotId: e.riotId, games: 0, wins: 0 })), sharedGames: 0, sharedWins: 0, combos: [] };
  }

  const shared = findSharedMatches(entries);
  const sharedGames = shared.length;
  const sharedWins = shared.filter((row) => row[0].win).length;

  const players: PlayerStat[] = entries.map((entry) => ({
    riotId: entry.riotId,
    games: sharedGames,
    wins: sharedWins,
  }));

  const comboMap = new Map<string, ChampionComboStat>();
  for (const row of shared) {
    const champions = row.map((m) => m.championName);
    const key = champions.join("|");
    const existing = comboMap.get(key);
    if (existing) {
      existing.games += 1;
      if (row[0].win) existing.wins += 1;
    } else {
      comboMap.set(key, { champions, games: 1, wins: row[0].win ? 1 : 0 });
    }
  }

  const combos = Array.from(comboMap.values()).sort((x, y) => {
    const winRateDiff = y.wins / y.games - x.wins / x.games;
    if (winRateDiff !== 0) return winRateDiff;
    return y.games - x.games;
  });

  return { players, sharedGames, sharedWins, combos };
}
