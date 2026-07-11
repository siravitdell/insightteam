import { Ratelimit } from "@upstash/ratelimit";
import { redis } from "@/lib/redis";
import { RiotRateLimitError } from "@/lib/errors";

const appRateLimiter = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(20, "1 s"), prefix: "riot:app" })
  : null;

const methodRateLimiter = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(100, "2 m"), prefix: "riot:method" })
  : null;

/**
 * In-process fallback used when Redis isn't configured, so bursts of parallel
 * requests (e.g. analyzing a 5-player team) queue instead of all firing at
 * once and tripping Riot's real rate limit. Stays comfortably under a dev
 * key's 20 req/1s cap.
 */
const IN_MEMORY_MAX_REQUESTS = 15;
const IN_MEMORY_WINDOW_MS = 1000;
let queueTail: Promise<void> = Promise.resolve();
const requestTimestamps: number[] = [];

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function acquireInMemorySlot(): Promise<void> {
  const release = queueTail;
  let resolveNext!: () => void;
  queueTail = new Promise((resolve) => {
    resolveNext = resolve;
  });
  await release;

  while (true) {
    const now = Date.now();
    while (requestTimestamps.length > 0 && now - requestTimestamps[0] > IN_MEMORY_WINDOW_MS) {
      requestTimestamps.shift();
    }
    if (requestTimestamps.length < IN_MEMORY_MAX_REQUESTS) {
      requestTimestamps.push(now);
      break;
    }
    await sleep(IN_MEMORY_WINDOW_MS - (now - requestTimestamps[0]));
  }

  resolveNext();
}

export async function withRiotRateLimit<T>(methodKey: string, fn: () => Promise<T>): Promise<T> {
  if (!appRateLimiter || !methodRateLimiter) {
    await acquireInMemorySlot();
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
