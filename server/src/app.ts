import { Hono } from "hono";
import { logger } from "hono/logger";
import settings from "./config/settings";
import errorHandler from "./api/v1/middlewares/ErrorHandler";

import authRoutes from "./api/v1/routes/AuthRoutes";
import userRoutes from "./api/v1/routes/UserRoutes";
import blacklistRoutes from "./api/v1/routes/BlacklistRoutes";
import healthRoutes from "./api/v1/routes/HealthRoutes";

import type { TAuthEnv } from "./api/v1/types/TAuth";
import { jwt } from "hono/jwt";
import { serveStatic } from "hono/bun";

const app = new Hono<TAuthEnv>();

app.use(logger());
app.use(
  "api/v1/users/*",
  jwt({
    secret: settings.jwt.accessToken.secret,
  })
);
app.use("api/v1/blacklist/*", jwt({ secret: settings.jwt.accessToken.secret }));

app.onError((err, c) => {
  const { message, status } = errorHandler(err);
  return c.json({ message }, status);
});
app.notFound((c) => c.json({ message: "Not Found" }, 404));

const apiRoutes_v1 = app
  .basePath("/api/v1")
  .route("/users", userRoutes)
  .route("/auth", authRoutes)
  .route("/blacklist", blacklistRoutes)
  .route("/health", healthRoutes);
// Server client code !For production
app.get("*", serveStatic({ root: "./client/dist" }));
app.get("*", serveStatic({ path: "./client/dist/index.html" }));

Bun.serve({
  port: settings.port,
  fetch: app.fetch,
});

export type ApiRoutes = typeof apiRoutes_v1;
