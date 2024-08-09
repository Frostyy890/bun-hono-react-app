import type { HTTPResponseError } from "hono/types";
import postgres from "postgres";
import { HTTPException } from "hono/http-exception";

export default function errorHandler(err: Error | HTTPResponseError): {
  message: string;
  status: number;
} {
  if (err instanceof postgres.PostgresError) {
    if (err.code === "23505" && err.detail) return { message: err.detail, status: 409 };
    return { message: "Internal Server Error", status: 500 };
  }
  if (err instanceof HTTPException) return { message: err.message, status: err.status };
  return { message: "Internal Server Error", status: 500 };
}
