import { createUserSchema } from "./UserValidations";

export const registerSchema = createUserSchema.omit({
  role: true,
  refreshTokenVersion: true,
});
export const loginSchema = registerSchema.omit({ email: true });
