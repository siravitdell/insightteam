export class DomainError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly status: number
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class SummonerNotFoundError extends DomainError {
  constructor(gameName: string, tagLine: string) {
    super(`Summoner ${gameName}#${tagLine} not found`, "SUMMONER_NOT_FOUND", 404);
  }
}

export class MatchNotFoundError extends DomainError {
  constructor(matchId: string) {
    super(`Match ${matchId} not found`, "MATCH_NOT_FOUND", 404);
  }
}

export class RiotRateLimitError extends DomainError {
  constructor(retryAfterSeconds: number) {
    super(`Riot API rate limit exceeded, retry after ${retryAfterSeconds}s`, "RIOT_RATE_LIMIT", 429);
  }
}

export class RiotApiError extends DomainError {
  constructor(message: string, status: number) {
    super(message, "RIOT_API_ERROR", status);
  }
}

export class ValidationFailedError extends DomainError {
  constructor(message: string) {
    super(message, "VALIDATION_FAILED", 400);
  }
}

export class AiGenerationError extends DomainError {
  constructor(message: string) {
    super(message, "AI_GENERATION_ERROR", 502);
  }
}

export function toErrorResponse(error: unknown): { message: string; code: string; status: number } {
  if (error instanceof DomainError) {
    return { message: error.message, code: error.code, status: error.status };
  }
  console.error("Unhandled error:", error);
  return { message: "Internal server error", code: "INTERNAL_ERROR", status: 500 };
}
