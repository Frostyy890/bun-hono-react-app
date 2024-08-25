import { createMiddleware } from "hono/factory";
import type { TAuthEnv } from "../types/TAuth";
import { HTTPException } from "hono/http-exception";
import HTTPStatusCode from "../constants/HTTPStatusCode";
import { UserRole } from "../../../db/schema";

function authorizeRole(allowedRoles: UserRole[]) {
  return createMiddleware<TAuthEnv>(async (c, next) => {
    const user = c.get("jwtPayload");
    if (!user || !allowedRoles.includes(user.role))
      throw new HTTPException(HTTPStatusCode.FORBIDDEN, { message: "Forbidden" });
    await next();
  });
}

export default { authorizeRole };
