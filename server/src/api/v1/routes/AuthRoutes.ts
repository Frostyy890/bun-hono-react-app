import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { registerSchema, loginSchema } from "../validations/AuthValidations";
import AuthService from "../services/AuthService";

const authRoutes = new Hono()
  .post("/register", zValidator("json", registerSchema), async (c) => {
    const data = c.req.valid("json");
    await AuthService.register(data);
  })
  .post("/login", zValidator("json", loginSchema), async (c) => {
    const data = c.req.valid("json");
    await AuthService.login(data);
  })
  .post("/logout", async (c) => {})
  .post("/refresh-token", async (c) => {});

export default authRoutes;
