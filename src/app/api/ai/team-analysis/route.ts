import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api-response";
import { teamAnalysisRequestSchema } from "@/validation/team-analysis";
import { teamAnalysisService } from "@/server/services/team-analysis-service";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const input = teamAnalysisRequestSchema.parse(body);
    const result = await teamAnalysisService.analyzeTeam(input);
    return apiSuccess(result);
  } catch (error) {
    return apiError(error);
  }
}
