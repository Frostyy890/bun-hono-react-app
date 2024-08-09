import { zValidator } from "@hono/zod-validator";
import { HTTPException } from "hono/http-exception";
import type { ZodSchema } from "zod";

export default function validateRequest<T>(schema: ZodSchema<T>) {
  return zValidator("json", schema, (result, c) => {
    if (!result.success) {
      const message = `${result.error.errors[0].path.join("")} is ${
        result.error.errors[0].message
      }`.toLowerCase();
      throw new HTTPException(400, { message });
    }
  });
}
