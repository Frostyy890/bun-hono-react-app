import { z } from "zod";
import { registerSchema, loginSchema } from "../validations/AuthValidations";
import type { TUser } from "./TUser";
import type { JWTPayload } from "hono/utils/jwt/types";
import type { UserRole } from "../../../db/schema";

export type TRegisterInput = z.infer<typeof registerSchema>;
export type TLoginInput = z.infer<typeof loginSchema>;

export type TAuthTokenPayload = {
  sub: {
    userId: TUser["id"];
    refreshTokenVersion: TUser["refreshTokenVersion"];
  };
  role: UserRole;
} & JWTPayload;

export type TAuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export type TAuthEnv = {
  Variables: {
    jwtPayload: TAuthTokenPayload;
  };
};
