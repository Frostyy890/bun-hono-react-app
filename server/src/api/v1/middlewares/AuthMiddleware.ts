import { createMiddleware } from "hono/factory";
import type { UserRole } from "../../../db/schema";
import type { TAuthTokenPayload } from "../types/TAuth";
import UserService from "../services/UserService";
import { HTTPException } from "hono/http-exception";

function authorizeRole(roles: UserRole[]) {
  return createMiddleware(async (c, next) => {
    const { role, sub } = c.get("jwtPayload") as TAuthTokenPayload;
    const user = await UserService.getUserById(sub.userId);
    const isValidRole = user.role === role && roles.includes(role);
    if (!user || !isValidRole) throw new HTTPException(403, { message: "Forbidden" });
    await next();
  });
}

export default { authorizeRole };
