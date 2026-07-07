import { z } from "zod";

export const matchIdSchema = z.string().regex(/^[A-Z0-9]+_\d+$/, "Invalid match ID format");

export const matchHistoryQuerySchema = z.object({
  puuid: z.string().min(1),
  start: z.coerce.number().int().nonnegative().default(0),
  count: z.coerce.number().int().min(1).max(50).default(20),
  queue: z.coerce.number().int().optional(),
});

export type MatchHistoryQuery = z.infer<typeof matchHistoryQuerySchema>;

export const participantSchema = z.object({
  puuid: z.string(),
  championId: z.number().int(),
  championName: z.string(),
  teamId: z.number().int(),
  win: z.boolean(),
  kills: z.number().int().nonnegative(),
  deaths: z.number().int().nonnegative(),
  assists: z.number().int().nonnegative(),
  cs: z.number().int().nonnegative(),
  goldEarned: z.number().int().nonnegative(),
  damageDealt: z.number().int().nonnegative(),
  visionScore: z.number().int().nonnegative(),
  role: z.string(),
  lane: z.string(),
});

export type Participant = z.infer<typeof participantSchema>;
