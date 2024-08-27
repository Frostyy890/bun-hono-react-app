import { db, type TDbClient } from "../../../db/connection";
import BaseRepository from "../repositories/BaseRepository";
import { blacklistTable, BlacklistReason, BlacklistExpiryPeriod } from "../../../db/schema";
import type {
  TBlacklistRecord,
  TAddToBlacklistInput,
  TUpdateBlacklistInput,
} from "../types/TBlacklist";
import type { TUser } from "../types/TUser";
import { HTTPException } from "hono/http-exception";
import HTTPStatusCode from "../constants/HTTPStatusCode";
import UserService from "./UserService";

const blacklistRepo = new BaseRepository(blacklistTable);

async function getAllBlacklistRecords(): Promise<TBlacklistRecord[]> {
  return await blacklistRepo.findMany({});
}

async function getOneBlacklistRecord<K extends keyof TBlacklistRecord>(
  where: {
    [key in K]: TBlacklistRecord[K];
  },
  tx?: TDbClient
): Promise<TBlacklistRecord | undefined> {
  return await blacklistRepo.findOne({ where }, tx);
}

async function addToBlacklist(
  userId: TUser["id"],
  data: TAddToBlacklistInput
): Promise<TBlacklistRecord> {
  return await db.transaction(async (tx) => {
    if (data.notes && !data.reason) {
      throw new HTTPException(HTTPStatusCode.BAD_REQUEST, {
        message: "Reason is required when notes are provided",
      });
    }
    const user = await UserService.updateUser(userId, { isBlacklisted: true }, tx);
    if (!user) throw UserService.throwUserNotFound();
    const expiresAt = data.expiresAt || handleBlacklistingPeriod(data.reason);
    return await blacklistRepo.create({ data: { ...data, userId, expiresAt } }, tx);
  });
}

async function updateBlacklistRecord(
  blRecordId: TBlacklistRecord["id"],
  data: TUpdateBlacklistInput
): Promise<TBlacklistRecord> {
  return await db.transaction(async (tx) => {
    const handleExpiry = () => {
      if (data.expiresAt) return data.expiresAt;
      return data.reason ? handleBlacklistingPeriod(data.reason) : undefined;
    };
    const updatedBlacklistRecord: TBlacklistRecord | undefined = await blacklistRepo.update(
      {
        where: { id: blRecordId },
        data: { ...data, expiresAt: handleExpiry() },
      },
      tx
    );
    if (!updatedBlacklistRecord) return throwBlRecordNotFound();
    if (data.deletedAt !== undefined) {
      const isBlacklisted = data.deletedAt === null;
      const updatedUser = await UserService.updateUser(
        updatedBlacklistRecord.userId,
        { isBlacklisted },
        tx
      );
      if (!updatedUser) throw UserService.throwUserNotFound();
    }
    return updatedBlacklistRecord;
  });
}

async function removeFromBlacklist(userId: TBlacklistRecord["userId"]): Promise<TBlacklistRecord> {
  return await db.transaction(async (tx) => {
    const softDeletedRecord = await blacklistRepo.update(
      {
        where: {
          userId,
        },
        data: { deletedAt: new Date() },
      },
      tx
    );
    if (!softDeletedRecord) return throwBlRecordNotFound();
    if (softDeletedRecord.deletedAt !== null) {
      throw new HTTPException(HTTPStatusCode.BAD_REQUEST, {
        message: "User is not blacklisted",
      });
    }
    const updatedUser = await UserService.updateUser(userId, { isBlacklisted: false }, tx);
    if (!updatedUser) throw UserService.throwUserNotFound();
    return softDeletedRecord;
  });
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

function throwBlRecordNotFound(): never {
  throw new HTTPException(HTTPStatusCode.NOT_FOUND, {
    message: "Blacklist record not found",
  });
}

export default {
  getAllBlacklistRecords,
  getOneBlacklistRecord,
  addToBlacklist,
  removeFromBlacklist,
  updateBlacklistRecord,
  throwBlRecordNotFound,
};
