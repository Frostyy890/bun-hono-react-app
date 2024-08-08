import { z } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { usersTable } from "../../../db/schema";

export const createUserSchema = createInsertSchema(usersTable)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    username: z
      .string()
      .min(3, "Username is too short")
      .max(255, "Username is too long"),
    email: z.string().email().max(255, "Email is too long"),
    password: z.string().min(6, "Password is too short"),
  });
export const updateUserSchema = createUserSchema.partial();
export const selectUserSchema = createSelectSchema(usersTable);
