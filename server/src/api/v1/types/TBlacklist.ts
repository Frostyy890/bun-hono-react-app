import type { z } from "zod";
import {
  addToBlacklistSchema,
  selectFromBlacklistSchema,
  updateBlacklistSchema,
} from "../validations/BlacklistValidations";

export type TBlacklistRecord = z.infer<typeof selectFromBlacklistSchema>;
export type TAddToBlacklistInput = z.infer<typeof addToBlacklistSchema>;
export type TUpdateBlacklistInput = z.infer<typeof updateBlacklistSchema>;
