import redis from "redis";
import settings from "../config/settings";

export const redisClient = redis.createClient({
  url: settings.redis.url,
});

export function connectToRedis() {
  redisClient
    .connect()
    .then(() => {
      console.log("[redis] Successfully connected!");
    })
    .catch((err) => {
      console.error("[redis] Error connecting to Redis:", err);
      process.exit(1);
    });
}
