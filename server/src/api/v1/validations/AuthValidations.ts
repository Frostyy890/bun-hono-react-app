import { z } from "zod";
import { createUserSchema } from "./UserValidations";

export const registerSchema = createUserSchema.omit({
  role: true,
  refreshTokenVersion: true,
  isBlacklisted: true,
});
export const loginSchema = registerSchema.omit({ email: true });

export const logoutSchema = z.object({
  isLogoutFromAll: z.boolean().optional(),
});
