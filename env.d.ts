import { z } from "zod";

const envSchema = z.object({
  PORT: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DB: z.string(),
  POSTGRES_HOST: z.string(),
  POSTGRES_PORT: z.string(),
  POSTGRES_HOST_AUTH_METHOD: z.string(),
  POSTGRES_INITDB_ARGS: z.string(),
  DATABASE_URL: z.string(),
  REDIS_HOST: z.string(),
  REDIS_PORT: z.string(),
  REDIS_PASSWORD: z.string(),
  SALT_ROUNDS: z.string(),
  ACCESS_TOKEN_SECRET: z.string(),
  REFRESH_TOKEN_SECRET: z.string(),
});

declare module "bun" {
  interface Env extends z.infer<typeof envSchema> {}
}
