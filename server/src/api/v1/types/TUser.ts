import { z } from "zod";
import {
  createUserSchema,
  updateUserSchema,
  selectUserSchema,
} from "../validations/UserValidations";

export type TCreateUserInput = z.infer<typeof createUserSchema>;
export type TUpdateUserInput = z.infer<typeof updateUserSchema>;
export type TUser = z.infer<typeof selectUserSchema>;
