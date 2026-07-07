import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api-response";
import { matchHistoryQuerySchema } from "@/validation/match";
import { matchService } from "@/server/services/match-service";
import { RIOT_REGIONS } from "@/lib/constants";
import { ValidationFailedError } from "@/lib/errors";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = matchHistoryQuerySchema.parse({
      puuid: searchParams.get("puuid"),
      start: searchParams.get("start") ?? undefined,
      count: searchParams.get("count") ?? undefined,
      queue: searchParams.get("queue") ?? undefined,
    });

    const region = searchParams.get("region");
    if (!region || !RIOT_REGIONS.includes(region as (typeof RIOT_REGIONS)[number])) {
      throw new ValidationFailedError("A valid region query parameter is required");
    }

    const matches = await matchService.getMatchHistory(
      region as (typeof RIOT_REGIONS)[number],
      query.puuid,
      query.start,
      query.count
    );
    return apiSuccess(matches);
  } catch (error) {
    return apiError(error);
  }
}
