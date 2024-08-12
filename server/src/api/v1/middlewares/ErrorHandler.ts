import type { HTTPResponseError } from "hono/types";
import postgres from "postgres";
import { HTTPException } from "hono/http-exception";
import type { StatusCode } from "hono/utils/http-status";
import HTTPStatusCode from "../constants/HTTPStatusCode";

export default function errorHandler(err: Error | HTTPResponseError): {
  message: string;
  status: StatusCode;
} {
  if (err instanceof postgres.PostgresError) {
    if (err.code === "23505" && err.detail)
      return { message: err.detail, status: HTTPStatusCode.CONFLICT };
    return { message: "Internal Server Error", status: HTTPStatusCode.INTERNAL_SERVER_ERROR };
  }
  if (err instanceof HTTPException) return { message: err.message, status: err.status };
  return { message: "Internal Server Error", status: HTTPStatusCode.INTERNAL_SERVER_ERROR };
}
