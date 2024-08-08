import { defineConfig } from "drizzle-kit";
import settings from "./server/src/config/settings";

export default defineConfig({
  dialect: "postgresql",
  out: "./server/src/db/migrations",
  schema: "./server/src/db/schema/index.ts",
  dbCredentials: {
    url: settings.db.url,
  },
  verbose: true,
});
