import { Hono } from "hono";
import { logger } from "hono/logger";
import settings from "./config/settings";
import appRoutes from "./api/v1/routes/AppRoutes";

const app = new Hono();

app.use("*", logger());

app.route("/api/v1", appRoutes);

Bun.serve({
  port: settings.port,
  fetch: app.fetch,
});
