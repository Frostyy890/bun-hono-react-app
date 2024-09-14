import type { Env } from "bun";

function getEnv(key: keyof Env, fallback?: string): string {
  const value = process.env[key];
  if (!value) {
    if (fallback) return fallback;
    throw new Error("Missing environment variable: " + key);
  }
  return value;
}

const settings = {
  port: Number.parseInt(getEnv("PORT", "3000")),
  db: {
    url: getEnv("DATABASE_URL"),
  },
  hash: {
    saltRounds: Number.parseInt(getEnv("SALT_ROUNDS", "10")),
  },
  jwt: {
    accessToken: {
      secret: getEnv("ACCESS_TOKEN_SECRET", "access-token-secret"),
    },
    refreshToken: {
      secret: getEnv("REFRESH_TOKEN_SECRET", "refresh-token-secret"),
    },
  },
  redis: {
    host: getEnv("REDIS_HOST", "localhost"),
    port: Number.parseInt(getEnv("REDIS_PORT", "6380")),
    password: getEnv("REDIS_PASSWORD", "password123"),
  },
};

export default settings;
