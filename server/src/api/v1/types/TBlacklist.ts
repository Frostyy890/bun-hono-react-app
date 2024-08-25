import type { z } from "zod";
import {
  createBlacklistRecordSchema,
  addToBlacklistSchema,
  selectFromBlacklistSchema,
  updateBlacklistSchema,
} from "../validations/BlacklistValidations";

export type TCreateBlacklistRecordInput = z.infer<typeof createBlacklistRecordSchema>;
export type TBlacklistRecord = z.infer<typeof selectFromBlacklistSchema>;
export type TAddToBlacklistInput = z.infer<typeof addToBlacklistSchema>;
export type TUpdateBlacklistInput = z.infer<typeof updateBlacklistSchema>;
