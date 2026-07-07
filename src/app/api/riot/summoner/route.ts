import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api-response";
import { summonerLookupSchema } from "@/validation/summoner";
import { summonerService } from "@/server/services/summoner-service";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const input = summonerLookupSchema.parse({
      region: searchParams.get("region"),
      gameName: searchParams.get("gameName"),
      tagLine: searchParams.get("tagLine"),
    });

    const summoner = await summonerService.lookupByRiotId(input.region, input.gameName, input.tagLine);
    return apiSuccess(summoner);
  } catch (error) {
    return apiError(error);
  }
}
