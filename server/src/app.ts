import { Hono } from "hono";
import { logger } from "hono/logger";
import settings from "./config/settings";
import appRoutes from "./api/v1/routes/AppRoutes";
import errorHandler from "./api/v1/middlewares/ErrorHandler";
import { serveStatic } from "hono/bun";

const app = new Hono();

app.use(logger());
app.onError((err, c) => {
  const { message, status } = errorHandler(err);
  return c.json({ message }, { status });
});

app.route("/api/v1", appRoutes);

// Server client code !For production
app.get("*", serveStatic({ root: "./client/dist" }));
app.get("*", serveStatic({ path: "./client/dist/index.html" }));

Bun.serve({
  port: settings.port,
  fetch: app.fetch,
});
