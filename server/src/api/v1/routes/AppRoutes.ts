import { Hono } from "hono";
import userRoutes from "./UserRoutes";
import authRoutes from "./AuthRoutes";
import { type JwtVariables, jwt } from "hono/jwt";
import settings from "../../../config/settings";

const appRoutes = new Hono<{ Variables: JwtVariables }>();
// Protected routes
appRoutes.use("/users/*", jwt({ secret: settings.jwt.accessToken.secret }));

appRoutes.route("/users", userRoutes);
appRoutes.route("/auth", authRoutes);

export default appRoutes;
