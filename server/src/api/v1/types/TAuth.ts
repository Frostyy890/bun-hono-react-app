import { z } from "zod";
import { registerSchema, loginSchema } from "../validations/AuthValidations";

export type TRegisterInput = z.infer<typeof registerSchema>;
export type TLoginInput = z.infer<typeof loginSchema>;
