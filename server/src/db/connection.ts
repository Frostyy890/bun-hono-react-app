import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import settings from "../config/settings";

export const migrationClient = drizzle(postgres(settings.db.url, { max: 1 }));
export const db = drizzle(postgres(settings.db.url));
export type TDbClient = typeof db;
