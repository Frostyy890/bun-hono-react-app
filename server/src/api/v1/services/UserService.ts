import type { TUser, TCreateUserInput, TUpdateUserInput } from "../types/TUser";
import { db, type TDbClient } from "../../../db/connection";
import { usersTable } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import HTTPStatusCode from "../constants/HTTPStatusCode";
import bcrypt from "bcrypt";
import settings from "../../../config/settings";

async function getAllUsers(): Promise<TUser[]> {
  return await db.select().from(usersTable);
}
async function getUserByAttribute<K extends keyof TUser>(
  attribute: K,
  value: TUser[K]
): Promise<TUser | undefined> {
  const user = (await db.select().from(usersTable).where(eq(usersTable[attribute], value)))[0];
  if (!user) return undefined;
  return user;
}
async function createUser(data: TCreateUserInput): Promise<TUser> {
  data.password = await bcrypt.hash(data.password, settings.hash.saltRounds);
  const user = (await db.insert(usersTable).values(data).returning())[0];
  return user;
}
async function updateUser(
  userId: TUser["id"],
  data: TUpdateUserInput,
  tx?: TDbClient
): Promise<TUser | undefined> {
  const queryBuilder = tx ?? db;
  if (data.password) data.password = await bcrypt.hash(data.password, settings.hash.saltRounds);
  const user = (
    await queryBuilder.update(usersTable).set(data).where(eq(usersTable.id, userId)).returning()
  )[0];
  return user;
}
async function deleteUser(userId: TUser["id"]): Promise<TUser | undefined> {
  return (await db.delete(usersTable).where(eq(usersTable.id, userId)).returning())[0];
}
function checkUserOutput(user: TUser | undefined) {
  if (!user) throw new HTTPException(HTTPStatusCode.NOT_FOUND, { message: "User not found" });
  return user;
}

export default {
  getAllUsers,
  getUserByAttribute,
  createUser,
  updateUser,
  deleteUser,
  checkUserOutput,
};
