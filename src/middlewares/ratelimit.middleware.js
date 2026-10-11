import { Ratelimit } from "@upstash/ratelimit";
import {Redis} from "@upstash/redis"
import { ApiError } from "../utils/ApiError.js";
import asynchandler from "../utils/asynchandler.js";
const upstashRedis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const createLimiter = (requests, windowDuration) => {
  const limiter = new Ratelimit({
    redis: upstashRedis,
    limiter: Ratelimit.slidingWindow(requests, windowDuration),
    analytics: true,
  });

  return asynchandler(async (req, res, next) => {
    const identifier = req.ip || req.headers['x-forwarded-for'] || 'anonymous';
    const { success, limit, remaining, reset } = await limiter.limit(identifier);

    res.setHeader("X-RateLimit-Limit", limit);
    res.setHeader("X-RateLimit-Remaining", remaining);
    res.setHeader("X-RateLimit-Reset", reset);

    if (!success) {
      throw new ApiError(429, "Too many requests. Please try again later.");
    }

    next();
  });
};


export const globalRateLimiter = createLimiter(100, "15 m");


export const authRateLimiter = createLimiter(20, "15 m");