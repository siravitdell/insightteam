export function formatKda(kills: number, deaths: number, assists: number): string {
  const ratio = deaths === 0 ? kills + assists : (kills + assists) / deaths;
  return `${ratio.toFixed(2)} KDA`;
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${minutes}:${remaining.toString().padStart(2, "0")}`;
}

export function formatWinRate(wins: number, games: number): string {
  if (games === 0) return "0%";
  return `${Math.round((wins / games) * 100)}%`;
}

export function timeAgo(date: Date): string {
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}
