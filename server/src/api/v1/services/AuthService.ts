import type { TRegisterInput, TLoginInput } from "../types/TAuth";
import UserService from "./UserService";
import TokenService from "./TokenService";
import bcrypt from "bcrypt";
import { HTTPException } from "hono/http-exception";
import HTTPStatusCode from "../constants/HTTPStatusCode";
import settings from "../../../config/settings";

async function register(data: TRegisterInput) {
  const user = await UserService.createUser(data);
  const tokens = await TokenService.generateAuthTokens({
    sub: { userId: user.id, refreshTokenVersion: user.refreshTokenVersion },
    role: user.role,
  });
  return { user, tokens };
}

async function login(data: TLoginInput) {
  const user = await UserService.getOneUser({ username: data.username, isBlacklisted: false });
  if (!user || !(await bcrypt.compare(data.password, user.password))) {
    throw new HTTPException(HTTPStatusCode.UNAUTHORIZED, { message: "Invalid credentials" });
  }
  const tokens = await TokenService.generateAuthTokens({
    sub: { userId: user.id, refreshTokenVersion: user.refreshTokenVersion },
    role: user.role,
  });
  return { user, tokens };
}

async function refresh(refreshToken: string | undefined) {
  if (!refreshToken)
    throw new HTTPException(HTTPStatusCode.UNAUTHORIZED, { message: "Unauthorized" });
  const sub = (await TokenService.verifyToken(refreshToken, settings.jwt.refreshToken.secret)).sub;
  const user = await UserService.getOneUser({ id: sub.userId, isBlacklisted: false });
  if (!user || user.refreshTokenVersion !== sub.refreshTokenVersion) {
    throw new HTTPException(HTTPStatusCode.UNAUTHORIZED, { message: "Unauthorized" });
  }
  const tokens = await TokenService.generateAuthTokens({
    sub: { userId: user.id, refreshTokenVersion: user.refreshTokenVersion },
    role: user.role,
  });
  return tokens;
}

async function logout(refreshToken: string, isLogoutFromAll: boolean = false) {
  if (isLogoutFromAll) {
    const sub = TokenService.decodeToken(refreshToken).sub;
    const user = await UserService.getOneUser({ id: sub.userId, isBlacklisted: false });
    if (user) {
      await UserService.updateUser(user.id, { refreshTokenVersion: user.refreshTokenVersion + 1 });
    }
    return;
  }
  return;
}

export default { register, login, refresh, logout };
