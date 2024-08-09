import { Hono } from "hono";
import { logger } from "hono/logger";
import settings from "./config/settings";
import appRoutes from "./api/v1/routes/AppRoutes";
import errorHandler from "./api/v1/middlewares/ErrorHandler";

const app = new Hono();

app.use(logger());
app.onError((err, c) => {
  const { message, status } = errorHandler(err);
  return c.json({ message }, { status });
});

app.route("/api/v1", appRoutes);

Bun.serve({
  port: settings.port,
  fetch: app.fetch,
});
