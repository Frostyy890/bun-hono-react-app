import type { TUser, TCreateUserInput, TUpdateUserInput } from "../types/TUser";
import { db } from "../../../db/connection";
import { usersTable } from "../../../db/schema";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import HTTPStatusCode from "../constants/HTTPStatusCode";
import bcrypt from "bcrypt";
import settings from "../../../config/settings";

async function getAllUsers(): Promise<TUser[]> {
  return await db.select().from(usersTable);
}
async function getUserByAttribute<K extends keyof TUser>(attribute: K, value: TUser[K]) {
  const users = await db.select().from(usersTable).where(eq(usersTable[attribute], value));
  const user = users[0];
  if (user && Object.keys(user).length === 0) return null;
  return user;
}
async function getUserById(userId: TUser["id"]): Promise<TUser> {
  const usersById = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  if (usersById.length < 1) {
    throw new HTTPException(HTTPStatusCode.NOT_FOUND, { message: "User not found" });
  }
  return usersById[0];
}
async function createUser(data: TCreateUserInput): Promise<TUser> {
  data.password = await bcrypt.hash(data.password, settings.hash.saltRounds);
  const users = await db.insert(usersTable).values(data).returning();
  return users[0];
}
async function updateUser(userId: TUser["id"], data: TUpdateUserInput): Promise<TUser> {
  if (data.password) data.password = await bcrypt.hash(data.password, settings.hash.saltRounds);
  const users = await db.update(usersTable).set(data).where(eq(usersTable.id, userId)).returning();
  return users[0];
}
async function deleteUser(userId: TUser["id"]) {
  await db.delete(usersTable).where(eq(usersTable.id, userId)).returning();
}

export default {
  getAllUsers,
  getUserById,
  getUserByAttribute,
  createUser,
  updateUser,
  deleteUser,
};
