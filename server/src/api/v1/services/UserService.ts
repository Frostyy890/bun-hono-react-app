import type { TUser, TCreateUserInput, TUpdateUserInput } from "../types/TUser";
import type { TDbClient } from "../../../db/connection";
import { usersTable } from "../../../db/schema";
import BaseRepository from "../repositories/BaseRepository";
import RedisService from "./RedisService";
import { HTTPException } from "hono/http-exception";
import HTTPStatusCode from "../constants/HTTPStatusCode";
import bcrypt from "bcrypt";
import settings from "../../../config/settings";

const userRepo = new BaseRepository(usersTable);

async function getAllUsers(): Promise<TUser[]> {
  const cachedUsers = await RedisService.get<TUser[]>("users");
  if (cachedUsers) return cachedUsers;
  const users = await userRepo.findMany({});
  await RedisService.set("users", users);
  return users;
}

async function getOneUser<K extends keyof TUser>(
  where: {
    [key in K]: TUser[K];
  },
  tx?: TDbClient
): Promise<TUser | undefined> {
  const storageKey = `user:${Object.keys(where)
    .map((key) => `${key}:${where[key as K]}`)
    .join(":")}`;
  const cachedUser = await RedisService.get<TUser>(storageKey);
  if (cachedUser) return cachedUser;
  const user = await userRepo.findOne({ where }, tx);
  if (user) await RedisService.set(storageKey, user);
  return user;
}

async function createUser(data: TCreateUserInput, tx?: TDbClient): Promise<TUser> {
  data.password = await bcrypt.hash(data.password, settings.hash.saltRounds);
  const newUser = await userRepo.create({ data }, tx);
  if (newUser) await RedisService.remove("users");
  return newUser;
}

async function updateUser(
  userId: TUser["id"],
  data: TUpdateUserInput,
  tx?: TDbClient
): Promise<TUser | undefined> {
  if (data.password) data.password = await bcrypt.hash(data.password, settings.hash.saltRounds);
  const updatedUser = await userRepo.update({ where: { id: userId }, data }, tx);
  if (updatedUser) await RedisService.remove("users");
  return updatedUser;
}

async function deleteUser(userId: TUser["id"]): Promise<TUser | undefined> {
  const deletedUser = await userRepo.delete({ where: { id: userId } });
  if (deletedUser) await RedisService.remove("users");
  return deletedUser;
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
