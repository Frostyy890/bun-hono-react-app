import { zValidator } from "@hono/zod-validator";
import type { ZodSchema } from "zod";
import { HTTPException } from "hono/http-exception";
import HTTPStatusCode from "../constants/HTTPStatusCode";

export default function validateRequest<T>(schema: ZodSchema<T>) {
  return zValidator("json", schema, (result, c) => {
    if (!result.success) {
      const error = result.error.errors[0];
      const message = `Validation Error: At [${error.path.join("")}] ${error.message}`;
      throw new HTTPException(HTTPStatusCode.BAD_REQUEST, { message });
    }
  });
}
