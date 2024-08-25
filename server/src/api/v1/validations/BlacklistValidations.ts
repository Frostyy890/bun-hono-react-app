import { z } from "zod";
import { blacklistTable } from "../../../db/schema";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { BlacklistExpiryPeriod } from "../../../db/schema";

export const createBlacklistRecordSchema = createInsertSchema(blacklistTable)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    expiresAt: z.coerce
      .date()
      .min(
        new Date(Date.now() + BlacklistExpiryPeriod.ONE_DAY),
        "expiry date must be in the future"
      )
      .optional(),
    deletedAt: z.coerce.date().nullable().optional(),
    notes: z.string().min(5, "required to be at least 5 characters long").optional(),
  });
export const addToBlacklistSchema = createBlacklistRecordSchema.omit({ userId: true });
export const updateBlacklistSchema = addToBlacklistSchema.partial();
export const selectFromBlacklistSchema = createSelectSchema(blacklistTable);
