declare module "bun" {
  interface Env {
    PORT: string;
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;
    POSTGRES_DB: string;
    POSTGRES_HOST: string;
    POSTGRES_PORT: string;
    POSTGRES_HOST_AUTH_METHOD: string;
    POSTGRES_INITDB_ARGS: string;
    DATABASE_URL: string;
    SALT_ROUNDS: string;
    ACCESS_TOKEN_SECRET: string;
    REFRESH_TOKEN_SECRET: string;
  }
}
