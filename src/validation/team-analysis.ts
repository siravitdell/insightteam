import { z } from "zod";

export const teamAnalysisRequestSchema = z.object({
  puuids: z.array(z.string().min(1)).min(1).max(5),
  region: z.string(),
});

export type TeamAnalysisRequest = z.infer<typeof teamAnalysisRequestSchema>;

export const teamAnalysisResultSchema = z.object({
  summary: z.string(),
  synergyScore: z.number().min(0).max(100),
  strengths: z.array(z.string()),
  weaknesses: z.array(z.string()),
  recommendations: z.array(z.string()),
});

export type TeamAnalysisResult = z.infer<typeof teamAnalysisResultSchema>;
