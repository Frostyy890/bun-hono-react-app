import { createMiddleware } from "hono/factory";
import type { UserRole } from "../../../db/schema";
import type { TAuthTokenPayload } from "../types/TAuth";
import UserService from "../services/UserService";
import { HTTPException } from "hono/http-exception";
import HTTPStatusCode from "../constants/HTTPStatusCode";

function authorizeRole(roles: UserRole[]) {
  return createMiddleware(async (c, next) => {
    const { role, sub } = c.get("jwtPayload") as TAuthTokenPayload;
    const user = await UserService.getUserByAttribute("id", sub.userId);
    if (!user || !(user.role === role && roles.includes(role)))
      throw new HTTPException(HTTPStatusCode.FORBIDDEN, { message: "Forbidden" });
    await next();
  });
}

export default { authorizeRole };
