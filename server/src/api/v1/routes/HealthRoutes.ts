import { Hono } from "hono";

const healthRoutes = new Hono().get("/", async (c) => {
  return c.json({ message: "Server is running" });
});

export default healthRoutes;
