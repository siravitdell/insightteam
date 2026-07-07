import { Redis } from "@upstash/redis";

const isRedisConfigured = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
);

export const redis = isRedisConfigured
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

export const CacheTTL = {
  liveMatch: 60,
  matchHistory: 60 * 60 * 24 * 30,
  summonerProfile: 60 * 15,
  teamAnalysis: 60 * 60 * 24 * 7,
} as const;

export async function getOrSetCache<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>
): Promise<T> {
  if (!redis) {
    return fetcher();
  }

  const cached = await redis.get<T>(key);
  if (cached !== null && cached !== undefined) {
    return cached;
  }
  const value = await fetcher();
  await redis.set(key, value, { ex: ttlSeconds });
  return value;
}
