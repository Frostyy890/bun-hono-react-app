import { Hono } from "hono";
import BlacklistService from "../services/BlacklistService";
import validateRequest from "../middlewares/ValidateRequest";
import { addToBlacklistSchema, updateBlacklistSchema } from "../validations/BlacklistValidations";
import type { TAuthEnv } from "../types/TAuth";
import AuthMiddleware from "../middlewares/AuthMiddleware";
import { UserRole } from "../../../db/schema";

const blacklistRoutes = new Hono<TAuthEnv>()
  .get("/", AuthMiddleware.authorizeRole([UserRole.ADMIN]), async (c) => {
    const blacklist = await BlacklistService.getAllBlacklistRecords();
    return c.json({ blacklist });
  })
  .get("/:blRecordId{[0-9]+}", AuthMiddleware.authorizeRole([UserRole.ADMIN]), async (c) => {
    const blRecordId = Number.parseInt(c.req.param("blRecordId"));
    const blacklistRecord = await BlacklistService.getOneBlacklistRecord({
      id: blRecordId,
    });
    if (!blacklistRecord) return BlacklistService.throwBlRecordNotFound();
    return c.json({ blacklistRecord });
  })
  .post(
    "/add-user/:userId{[0-9]+}",
    AuthMiddleware.authorizeRole([UserRole.ADMIN]),
    validateRequest(addToBlacklistSchema),
    async (c) => {
      const userId = Number.parseInt(c.req.param("userId"));
      const data = c.req.valid("json");
      const blacklistRecord = await BlacklistService.addToBlacklist(userId, data);
      return c.json({ blacklistRecord });
    }
  )
  .patch(
    "/:blRecordId{[0-9]+}",
    AuthMiddleware.authorizeRole([UserRole.ADMIN]),
    validateRequest(updateBlacklistSchema),
    async (c) => {
      const blRecordId = Number.parseInt(c.req.param("blRecordId"));
      const data = c.req.valid("json");
      const updatedRecord = await BlacklistService.updateBlacklistRecord(blRecordId, data);
      return c.json({ updatedRecord });
    }
  )
  .delete(
    "/remove-user/:userId{[0-9]+}",
    AuthMiddleware.authorizeRole([UserRole.ADMIN]),
    async (c) => {
      const userId = Number.parseInt(c.req.param("userId"));
      const deletedRecord = await BlacklistService.removeFromBlacklist(userId);
      return c.json({ message: "User removed from blacklist", deletedRecord });
    }
  );

export default blacklistRoutes;
