import { z } from "zod";

export const matchSummarySchema = z.object({
  matchId: z.string(),
  gameCreation: z.number(),
  gameDuration: z.number(),
  gameVersion: z.string(),
  championName: z.string(),
  win: z.boolean(),
  kills: z.number(),
  deaths: z.number(),
  assists: z.number(),
  cs: z.number(),
  visionScore: z.number(),
  role: z.string(),
});

export type MatchSummary = z.infer<typeof matchSummarySchema>;
