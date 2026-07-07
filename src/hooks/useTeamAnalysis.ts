import { useMutation } from "@tanstack/react-query";
import type { ApiResponse } from "@/lib/api-response";
import type { TeamAnalysisRequest, TeamAnalysisResult } from "@/validation/team-analysis";

async function postTeamAnalysis(input: TeamAnalysisRequest): Promise<TeamAnalysisResult> {
  const res = await fetch("/api/ai/team-analysis", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const json = (await res.json()) as ApiResponse<TeamAnalysisResult>;

  if ("error" in json) {
    throw new Error(json.error.message);
  }
  return json.data;
}

export function useTeamAnalysis() {
  return useMutation({
    mutationFn: postTeamAnalysis,
  });
}
