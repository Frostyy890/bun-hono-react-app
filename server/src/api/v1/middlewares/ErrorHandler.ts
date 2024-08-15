import type { HTTPResponseError } from "hono/types";
import postgres from "postgres";
import { HTTPException } from "hono/http-exception";
import type { StatusCode } from "hono/utils/http-status";
import HTTPStatusCode from "../constants/HTTPStatusCode";

export default function errorHandler(err: Error | HTTPResponseError): {
  message: string;
  status: StatusCode;
} {
  if (err instanceof postgres.PostgresError) return handlePostgresError(err);

  if (err instanceof HTTPException) return handleHTTPException(err);

  if (err instanceof Error) return handleBaseError(err);

  console.error(`Unhandled exception`, JSON.stringify(err, null, 2));
  return { message: "Internal Server Error", status: HTTPStatusCode.INTERNAL_SERVER_ERROR };
}

function handlePostgresError(error: postgres.PostgresError) {
  if (error.code === "23505" && error.detail)
    return { message: error.detail, status: HTTPStatusCode.CONFLICT };
  return { message: "Internal Server Error", status: HTTPStatusCode.INTERNAL_SERVER_ERROR };
}

function handleHTTPException(error: HTTPException) {
  return { message: error.message, status: error.status };
}

function handleBaseError(error: Error) {
  if (error.message === "No values to set")
    return { message: error.message, status: HTTPStatusCode.BAD_REQUEST };
  console.error("Unhandled Base Error", JSON.stringify(error, null, 2));
  return { message: "Internal Server Error", status: HTTPStatusCode.INTERNAL_SERVER_ERROR };
}
