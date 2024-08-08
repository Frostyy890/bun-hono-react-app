import { sign, verify, decode } from "hono/jwt";
import type { TAuthTokenPayload, TAuthTokens } from "../types/TAuth";
import settings from "../../../config/settings";

async function verifyToken(token: string, secret: string) {
  return (await verify(token, secret)) as TAuthTokenPayload;
}

async function generateAuthTokens(payload: TAuthTokenPayload) {
  const accessTokenPayload = { ...payload, exp: Math.floor(Date.now() / 1000) + 60 * 15 }; // 15 minutes
  const refreshTokenPayload = { ...payload, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 1 }; // 1 day
  const accessToken = await sign(accessTokenPayload, settings.jwt.accessToken.secret);
  const refreshToken = await sign(refreshTokenPayload, settings.jwt.refreshToken.secret);
  return { accessToken, refreshToken };
}

function decodeToken(token: string) {
  return decode(token).payload as TAuthTokenPayload;
}

export default { verifyToken, generateAuthTokens, decodeToken };
