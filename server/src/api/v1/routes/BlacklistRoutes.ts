import { Hono } from "hono";
import BlacklistService from "../services/BlacklistService";
import validateRequest from "../middlewares/ValidateRequest";
import { addToBlacklistSchema, updateBlacklistSchema } from "../validations/BlacklistValidations";

const blacklistRoutes = new Hono()
  .get("/", async (c) => {
    const blacklist = await BlacklistService.getAllBlacklistRecords();
    return c.json({ blacklist });
  })
  .get("/:blRecordId{[0-9]+}", async (c) => {
    const blRecordId = Number.parseInt(c.req.param("blRecordId"));
    const blacklistRecord = await BlacklistService.getBlacklistRecordById(blRecordId);
    return c.json({ blacklistRecord });
  })
  .post("/", validateRequest(addToBlacklistSchema), async (c) => {
    const data = c.req.valid("json");
    const blacklistRecord = await BlacklistService.addToBlacklist(data);
    return c.json({ blacklistRecord });
  })
  .patch("/:blRecordId{[0-9]+}", validateRequest(updateBlacklistSchema), async (c) => {
    const blRecordId = Number.parseInt(c.req.param("blRecordId"));
    const data = c.req.valid("json");
    const updatedRecord = await BlacklistService.updateBlacklistRecord(blRecordId, data);
    return c.json({ updatedRecord });
  })
  .delete("remove-user/:userId{[0-9]+}", async (c) => {
    const userId = Number.parseInt(c.req.param("userId"));
    const deletedRecord = await BlacklistService.removeFromBlacklist(userId);
    return c.json({ message: "User removed from blacklist", deletedRecord });
  });

export default blacklistRoutes;
