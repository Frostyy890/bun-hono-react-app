import { Hono } from "hono";
import BlacklistService from "../services/BlacklistService";

const blacklistRoutes = new Hono().delete("/remove-user/:userId{[0-9]+}", async (c) => {
  const userId = Number.parseInt(c.req.param("userId"));
  const deletedEntry = await BlacklistService.removeFromBlacklist(userId);
  return c.json({ message: "User removed from blacklist", deletedEntry });
});

export default blacklistRoutes;
