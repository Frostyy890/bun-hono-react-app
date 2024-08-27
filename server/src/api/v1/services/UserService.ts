import type { TUser, TCreateUserInput, TUpdateUserInput } from "../types/TUser";
import type { TDbClient } from "../../../db/connection";
import { usersTable } from "../../../db/schema";
import BaseRepository from "../repositories/BaseRepository";
import { HTTPException } from "hono/http-exception";
import HTTPStatusCode from "../constants/HTTPStatusCode";
import bcrypt from "bcrypt";
import settings from "../../../config/settings";

const userRepo = new BaseRepository(usersTable);

async function getAllUsers(): Promise<TUser[]> {
  return await userRepo.findMany({});
}

async function getOneUser<K extends keyof TUser>(
  where: {
    [key in K]: TUser[K];
  },
  tx?: TDbClient
): Promise<TUser | undefined> {
  return await userRepo.findOne({ where }, tx);
}

async function createUser(data: TCreateUserInput, tx?: TDbClient): Promise<TUser> {
  data.password = await bcrypt.hash(data.password, settings.hash.saltRounds);
  return await userRepo.create({ data }, tx);
}

async function updateUser(
  userId: TUser["id"],
  data: TUpdateUserInput,
  tx?: TDbClient
): Promise<TUser | undefined> {
  if (data.password) data.password = await bcrypt.hash(data.password, settings.hash.saltRounds);
  return await userRepo.update({ where: { id: userId }, data }, tx);
}

async function deleteUser(userId: TUser["id"]): Promise<TUser | undefined> {
  return await userRepo.delete({ where: { id: userId } });
}

function throwUserNotFound(): never {
  throw new HTTPException(HTTPStatusCode.NOT_FOUND, { message: "User not found" });
}

export default {
  getAllUsers,
  getOneUser,
  createUser,
  updateUser,
  deleteUser,
  throwUserNotFound,
};
