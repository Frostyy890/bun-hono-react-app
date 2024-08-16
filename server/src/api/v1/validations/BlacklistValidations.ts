import { z } from "zod";
import { blacklistTable } from "../../../db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { BlacklistExpiryPeriod } from "../../../db/schema";

export const addToBlacklistSchema = createInsertSchema(blacklistTable)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    expiresAt: z.string().date().optional(),
  });
export const updateBlacklistSchema = addToBlacklistSchema.partial();
export const selectFromBlacklistSchema = createSelectSchema(blacklistTable);
