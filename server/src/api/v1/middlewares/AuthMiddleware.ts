import { createMiddleware } from "hono/factory";
import type { TAuthEnv } from "../types/TAuth";
import UserService from "../services/UserService";
import { HTTPException } from "hono/http-exception";
import HTTPStatusCode from "../constants/HTTPStatusCode";
import TokenService from "../services/TokenService";
import settings from "../../../config/settings";
import { UserRole } from "../../../db/schema";

const authenticateToken = createMiddleware<TAuthEnv>(async (c, next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader)
    throw new HTTPException(HTTPStatusCode.BAD_REQUEST, {
      message: "Authorization header was not provided",
    });
  const [type, token] = authHeader.split(" ");
  if (type !== "Bearer")
    throw new HTTPException(HTTPStatusCode.UNAUTHORIZED, { message: "Unauthorized" });
  const decoded = await TokenService.verifyToken(token, settings.jwt.accessToken.secret).catch(
    (err) => {
      throw new HTTPException(HTTPStatusCode.UNAUTHORIZED, { message: "Unauthorized" });
    }
  );
  const user = await UserService.getUserByAttribute("id", decoded.sub.userId);
  if (!user || user.refreshTokenVersion !== decoded.sub.refreshTokenVersion)
    throw new HTTPException(HTTPStatusCode.UNAUTHORIZED, { message: "Unauthorized" });
  c.set("user", user);
  await next();
});

function authorizeRole(roles: UserRole[]) {
  return createMiddleware<TAuthEnv>(async (c, next) => {
    const user = c.get("user");
    if (!user || !roles.includes(user.role))
      throw new HTTPException(HTTPStatusCode.FORBIDDEN, { message: "Forbidden" });
    await next();
  });
}

export default { authenticateToken, authorizeRole };
