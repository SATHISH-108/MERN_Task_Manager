import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

const url = process.env.REDIS_URL;
const opts = url && url.startsWith("rediss://") ? { tls: {} } : {};

export const redis = new Redis(url, {
  ...opts,
  maxRetriesPerRequest: null,
});

// Dedicated subscriber — ioredis forbids commands on a subscribed connection
export const redisSub = new Redis(url, {
  ...opts,
  maxRetriesPerRequest: null,
});

redis.on("error", (e) => console.error("Redis error:", e.message));
redisSub.on("error", (e) => console.error("RedisSub error:", e.message));
