export interface ISettings {
  port: number;
  db: {
    url: string;
  };
  hash: {
    saltRounds: number;
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
  port: parseInt(getEnvVariable("PORT", "3000")),
  db: {
    url: getEnvVariable("DATABASE_URL"),
  },
  hash: {
    saltRounds: parseInt(getEnvVariable("SALT_ROUNDS", "10")),
  },
} satisfies ISettings;
