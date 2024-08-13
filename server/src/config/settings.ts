export interface ISettings {
  port: number;
  db: {
    url: string;
  };
  hash: {
    saltRounds: number;
  };
  jwt: {
    accessToken: {
      secret: string;
    };
    refreshToken: {
      secret: string;
    };
  };
}

export function getEnvVariable(name: string, defaultValue?: string) {
  const value = process.env[name];
  if (!value) {
    if (defaultValue) return defaultValue;
    throw new Error(`Missing environment variable: ${name}`);
  }
  return value;
}

export default {
  port: Number.parseInt(getEnvVariable("PORT", "3000")),
  db: {
    url: getEnvVariable("DATABASE_URL"),
  },
  hash: {
    saltRounds: Number.parseInt(getEnvVariable("SALT_ROUNDS", "10")),
  },
  jwt: {
    accessToken: {
      secret: getEnvVariable("ACCESS_TOKEN_SECRET", "access-token-secret"),
    },
    refreshToken: {
      secret: getEnvVariable("REFRESH_TOKEN_SECRET", "refresh-token-secret"),
    },
  },
} satisfies ISettings;
