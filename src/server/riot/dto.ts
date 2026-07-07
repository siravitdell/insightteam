export interface RiotMatchParticipantDto {
  puuid: string;
  championId: number;
  championName: string;
  teamId: number;
  win: boolean;
  kills: number;
  deaths: number;
  assists: number;
  totalMinionsKilled: number;
  neutralMinionsKilled: number;
  goldEarned: number;
  totalDamageDealtToChampions: number;
  visionScore: number;
  individualPosition: string;
  teamPosition: string;
}

export interface RiotMatchDto {
  metadata: { matchId: string };
  info: {
    gameCreation: number;
    gameDuration: number;
    gameVersion: string;
    queueId: number;
    participants: RiotMatchParticipantDto[];
  };
}

export function isRiotMatchDto(value: unknown): value is RiotMatchDto {
  return Boolean(
    value &&
      typeof value === "object" &&
      "info" in value &&
      "metadata" in value &&
      Array.isArray((value as RiotMatchDto).info?.participants)
  );
}
