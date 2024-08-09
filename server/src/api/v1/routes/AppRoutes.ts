import { Hono } from "hono";
import userRoutes from "./UserRoutes";
import authRoutes from "./AuthRoutes";
import { type JwtVariables, jwt } from "hono/jwt";
import settings from "../../../config/settings";
import AuthMiddleware from "../middlewares/AuthMiddleware";
import { UserRole } from "../../../db/schema";

const appRoutes = new Hono<{ Variables: JwtVariables }>();
// Protected routes
appRoutes.use(
  "/users/*",
  jwt({ secret: settings.jwt.accessToken.secret }),
  AuthMiddleware.authorizeRole([UserRole.ADMIN])
);

appRoutes.route("/users", userRoutes);
appRoutes.route("/auth", authRoutes);

export default appRoutes;
