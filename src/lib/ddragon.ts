const FALLBACK_DDRAGON_VERSION = "14.23.1";

export function toDDragonVersion(gameVersion: string): string {
  const [major, minor] = gameVersion.split(".");
  if (!major || !minor) return FALLBACK_DDRAGON_VERSION;
  return `${major}.${minor}.1`;
}

export function championIconUrl(championName: string, gameVersion: string): string {
  const version = toDDragonVersion(gameVersion);
  return `https://ddragon.leagueoflegends.com/cdn/${version}/img/champion/${championName}.png`;
}
