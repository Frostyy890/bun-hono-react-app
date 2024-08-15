import { db } from "../../../db/connection";
import { blacklistTable, BlacklistReason, BlacklistExpiryPeriod } from "../../../db/schema";
import { eq } from "drizzle-orm";
import type {
  TBlacklistRecord,
  TAddToBlacklistInput,
  TUpdateBlacklistInput,
} from "../types/TBlacklist";
import { HTTPException } from "hono/http-exception";
import HTTPStatusCode from "../constants/HTTPStatusCode";
import UserService from "./UserService";

async function addToBlacklist(data: TAddToBlacklistInput): Promise<TBlacklistRecord> {
  return await db.transaction(async (tx) => {
    if (data.notes && !data.reason) {
      throw new HTTPException(HTTPStatusCode.BAD_REQUEST, {
        message: "Reason is required when notes are provided",
      });
    }
    const maybeUser = await UserService.updateUser(data.userId, { isBlacklisted: true }, tx);
    UserService.checkUserOutput(maybeUser);
    const blacklistRecord = (
      await tx
        .insert(blacklistTable)
        .values({
          ...data,
          expiresAt: data.expiresAt || handleBlacklistingPeriod(data.reason),
        })
        .returning()
    )[0];
    return blacklistRecord;
  });
}
async function updateBlacklistRecord(
  blRecordId: TBlacklistRecord["id"],
  data: TUpdateBlacklistInput
): Promise<TBlacklistRecord> {
  if (data.userId) {
    const maybeUser = await UserService.getUserByAttribute("id", data.userId);
    UserService.checkUserOutput(maybeUser);
  }
  const blacklistRecord = (
    await db.update(blacklistTable).set(data).where(eq(blacklistTable.id, blRecordId)).returning()
  )[0];
  return checkBlacklistRecordOutput(blacklistRecord);
}

async function removeFromBlacklist(
  userId: TAddToBlacklistInput["userId"]
): Promise<TBlacklistRecord> {
  return await db.transaction(async (tx) => {
    const maybeUser = await UserService.updateUser(userId, { isBlacklisted: false }, tx);
    UserService.checkUserOutput(maybeUser);
    const deletedRecord = (
      await tx
        .update(blacklistTable)
        .set({ deletedAt: new Date() })
        .where(eq(blacklistTable.userId, userId))
        .returning()
    )[0];
    if (!deletedRecord) {
      throw new HTTPException(HTTPStatusCode.NOT_FOUND, {
        message: "User not found in blacklist",
      });
    }
    return deletedRecord;
  });
}

async function getBlacklistRecordById(
  blRecordId: TBlacklistRecord["id"]
): Promise<TBlacklistRecord> {
  const blacklistRecord = (
    await db.select().from(blacklistTable).where(eq(blacklistTable.id, blRecordId))
  )[0];
  return checkBlacklistRecordOutput(blacklistRecord);
}
async function getAllBlacklistRecords(): Promise<TBlacklistRecord[]> {
  return await db.select().from(blacklistTable);
}
function isBlacklistRecordExpired(blacklistRecord: TBlacklistRecord): boolean {
  return blacklistRecord.expiresAt < new Date();
}

function handleBlacklistingPeriod(reason: TAddToBlacklistInput["reason"]): Date {
  switch (reason) {
    case BlacklistReason.ABUSE:
    case BlacklistReason.HARASSMENT:
    case BlacklistReason.INAPPROPRIATE_CONTENT:
      return new Date(Date.now() + BlacklistExpiryPeriod.THREE_MONTHS);
    case BlacklistReason.CHARGEBACK:
    case BlacklistReason.SPAM:
      return new Date(Date.now() + BlacklistExpiryPeriod.ONE_MONTH);
    case BlacklistReason.FRAUD:
      return new Date(Date.now() + BlacklistExpiryPeriod.ONE_YEAR);
    case BlacklistReason.VIOLATION_OF_TERMS:
      return new Date(Date.now() + BlacklistExpiryPeriod.SIX_MONTHS);
    case BlacklistReason.NOT_SPECIFIED:
    case BlacklistReason.OTHER:
      return new Date(Date.now() + BlacklistExpiryPeriod.ONE_WEEK);
    default:
      return new Date(Date.now() + BlacklistExpiryPeriod.ONE_WEEK);
  }
}

function checkBlacklistRecordOutput(
  blacklistRecord: TBlacklistRecord | undefined
): TBlacklistRecord {
  if (!blacklistRecord)
    throw new HTTPException(HTTPStatusCode.NOT_FOUND, {
      message: "Blacklist record not found",
    });
  return blacklistRecord;
}

export default {
  addToBlacklist,
  removeFromBlacklist,
  getBlacklistRecordById,
  getAllBlacklistRecords,
  updateBlacklistRecord,
  isBlacklistRecordExpired,
};
