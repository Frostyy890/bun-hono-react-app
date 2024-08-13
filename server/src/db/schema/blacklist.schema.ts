import { pgTable, pgEnum, serial, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { usersTable } from "./user.schema";

export enum BlacklistReason {
  SPAM = "spam",
  ABUSE = "abuse",
  FRAUD = "fraud",
  VIOLATION_OF_TERMS = "violation_of_terms",
  HARASSMENT = "harassment",
  INAPPROPRIATE_CONTENT = "inappropriate_content",
  CHARGEBACK = "chargeback",
  OTHER = "other",
  NOT_SPECIFIED = "not_specified",
}

export const blacklistReasons = pgEnum("reason", [
  BlacklistReason.SPAM,
  BlacklistReason.ABUSE,
  BlacklistReason.FRAUD,
  BlacklistReason.VIOLATION_OF_TERMS,
  BlacklistReason.HARASSMENT,
  BlacklistReason.INAPPROPRIATE_CONTENT,
  BlacklistReason.CHARGEBACK,
  BlacklistReason.OTHER,
  BlacklistReason.NOT_SPECIFIED,
]);

const one_day = 24 * 60 * 60 * 1000;

export enum BlacklistExpiryPeriod {
  ONE_DAY = one_day, // 1 day
  ONE_WEEK = 7 * one_day, // 1 week
  ONE_MONTH = 30 * one_day, // 30 days
  THREE_MONTHS = 90 * one_day, // 90 days
  SIX_MONTHS = 180 * one_day, // 180 days
  ONE_YEAR = 365 * one_day, // 365 days
  PERMANENT = 8640000000000000, // Permanently
}

export const blacklistTable = pgTable("Blacklist", {
  id: serial("id").primaryKey(),
  userId: integer("userId")
    .notNull()
    .references(() => usersTable.id),
  reason: blacklistReasons("reason").default(BlacklistReason.NOT_SPECIFIED).notNull(),
  notes: varchar("notes", { length: 255 }).default("Not specified").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  deletedAt: timestamp("deletedAt"),
});
