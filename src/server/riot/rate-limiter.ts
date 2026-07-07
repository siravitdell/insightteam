import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "@/lib/redis";
import { RiotRateLimitError } from "@/lib/errors";

const appRateLimiter = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(20, "1 s"), prefix: "riot:app" })
  : null;

const methodRateLimiter = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(100, "2 m"), prefix: "riot:method" })
  : null;

export async function withRiotRateLimit<T>(methodKey: string, fn: () => Promise<T>): Promise<T> {
  if (!appRateLimiter || !methodRateLimiter) {
    return fn();
  }

  const [appResult, methodResult] = await Promise.all([
    appRateLimiter.limit("global"),
    methodRateLimiter.limit(methodKey),
  ]);

  if (!appResult.success || !methodResult.success) {
    const reset = Math.max(appResult.reset, methodResult.reset);
    const retryAfterSeconds = Math.max(1, Math.ceil((reset - Date.now()) / 1000));
    throw new RiotRateLimitError(retryAfterSeconds);
  }

  return fn();
}
