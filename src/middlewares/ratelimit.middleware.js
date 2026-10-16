import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { ApiError } from "../utils/ApiError.js";
import asynchandler from "../utils/asynchandler.js";

const upstashRedis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const createLimiter = (requests, windowDuration, prefix = "default") => {
  const limiter = new Ratelimit({
    redis: upstashRedis,
    limiter: Ratelimit.slidingWindow(requests, windowDuration),
    analytics: true,
    prefix: `@upstash/ratelimit:${prefix}`, 
  });

  return asynchandler(async (req, res, next) => {
    const identifier = 
        req.user?._id?.toString() || 
        req.headers['x-forwarded-for'] || 
        req.ip || 
        'anonymous';

    const { success, limit, remaining, reset } = await limiter.limit(identifier);

    res.setHeader("X-RateLimit-Limit", limit);
    res.setHeader("X-RateLimit-Remaining", remaining);
    res.setHeader("X-RateLimit-Reset", reset);

    if (!success) {
      throw new ApiError(429, `Too many requests for ${prefix}. Please try again later.`);
    }

    next();
  });
};

export const authRateLimiter = createLimiter(5, "1 m", "auth");


export const uploadRateLimiter = createLimiter(10, "1 h", "upload");


export const apiRateLimiter = createLimiter(100, "1 m", "api");