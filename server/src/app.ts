import { Hono } from "hono";
import { logger } from "hono/logger";
import settings from "./config/settings";
import errorHandler from "./api/v1/middlewares/ErrorHandler";
import { serveStatic } from "hono/bun";
import authRoutes from "./api/v1/routes/AuthRoutes";
import userRoutes from "./api/v1/routes/UserRoutes";
import { type JwtVariables, jwt } from "hono/jwt";
import AuthMiddleware from "./api/v1/middlewares/AuthMiddleware";
import { UserRole } from "./db/schema";

const app = new Hono<{ Variables: JwtVariables }>();

app.use(logger());
app.use(
  "api/v1/users/*",
  jwt({ secret: settings.jwt.accessToken.secret }),
  AuthMiddleware.authorizeRole([UserRole.ADMIN])
);
app.onError((err, c) => {
  const { message, status } = errorHandler(err);
  return c.json({ message }, status);
});
app.notFound((c) => c.json({ message: "Not Found" }, 404));

const apiRoutes_v1 = app.basePath("/api/v1").route("/users", userRoutes).route("/auth", authRoutes);
// Server client code !For production
app.get("*", serveStatic({ root: "./client/dist" }));
app.get("*", serveStatic({ path: "./client/dist/index.html" }));

Bun.serve({
  port: settings.port,
  fetch: app.fetch,
});

export type ApiRoutes = typeof apiRoutes_v1;
