import { redisClient } from "../../../redis/connection";

async function set<T>(key: string, value: T) {
  try {
    return await redisClient.set(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error Caching Data:", error);
  }
}

async function get<T>(key: string): Promise<T | undefined> {
  try {
    const cachedData = await redisClient.get(key);
    if (!cachedData) return undefined;
    return JSON.parse(cachedData) as T;
  } catch (error) {
    console.error("Error Getting Cached Data:", error);
  }
}

async function remove(key: string) {
  try {
    return await redisClient.del(key);
  } catch (error) {
    console.error("Error Deleting Cached Data:", error);
  }
}

export default {
  set,
  get,
  remove,
};
