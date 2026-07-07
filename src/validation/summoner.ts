import { z } from "zod";
import { RIOT_REGIONS } from "@/lib/constants";

export const summonerLookupSchema = z.object({
  region: z.enum(RIOT_REGIONS),
  gameName: z.string().min(3).max(16),
  tagLine: z.string().min(3).max(5),
});

export type SummonerLookup = z.infer<typeof summonerLookupSchema>;

export const summonerSchema = z.object({
  id: z.string(),
  puuid: z.string(),
  region: z.enum(RIOT_REGIONS),
  gameName: z.string(),
  tagLine: z.string(),
  summonerLevel: z.number().int().nonnegative(),
  profileIconId: z.number().int().nonnegative(),
});

export type Summoner = z.infer<typeof summonerSchema>;
