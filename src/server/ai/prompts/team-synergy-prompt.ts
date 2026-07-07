export interface TeamSynergyPromptContext {
  players: Array<{
    gameName: string;
    championPool: string[];
    winRate: number;
    avgKda: number;
    role: string;
  }>;
  recentMatches: Array<{
    win: boolean;
    duration: number;
  }>;
}

export const teamSynergyPromptV1 = {
  name: "team-synergy-v1",
  system: `You are an expert League of Legends coach analyzing a team's synergy and performance.
Base every claim strictly on the statistics provided in the context below.
Never invent champion names, numbers, or outcomes that are not present in the data.
Be direct and actionable, like a coach reviewing VOD with a team.`,

  buildUserPrompt(context: TeamSynergyPromptContext): string {
    return `Team roster and stats:\n${JSON.stringify(context, null, 2)}\n\nAnalyze this team's synergy, strengths, weaknesses, and give concrete recommendations.`;
  },
};
