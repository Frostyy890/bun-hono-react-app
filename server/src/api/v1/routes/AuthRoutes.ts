import { Hono } from "hono";
import { registerSchema, loginSchema, logoutSchema } from "../validations/AuthValidations";
import validateRequest from "../middlewares/ValidateRequest";
import AuthService from "../services/AuthService";
import { UserDto } from "../dto/UserDto";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import type { CookieOptions } from "hono/utils/cookie";

const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  sameSite: "none",
  maxAge: 60 * 60 * 24 * 1, // 1 day
  // secure: true,
};

const authRoutes = new Hono()
  .post("/register", validateRequest(registerSchema), async (c) => {
    const data = c.req.valid("json");
    const { user, tokens } = await AuthService.register(data);
    const { accessToken, refreshToken } = tokens;
    setCookie(c, "refreshToken", refreshToken, COOKIE_OPTIONS);
    return c.json({ user: new UserDto(user), token: accessToken });
  })
  .post("/login", validateRequest(loginSchema), async (c) => {
    const data = c.req.valid("json");
    const { user, tokens } = await AuthService.login(data);
    const { accessToken, refreshToken } = tokens;
    setCookie(c, "refreshToken", refreshToken, COOKIE_OPTIONS);
    return c.json({ user: new UserDto(user), token: accessToken });
  })
  .post("/refresh-token", async (c) => {
    const refreshToken = getCookie(c, "refreshToken");
    const tokens = await AuthService.refresh(refreshToken);
    const { accessToken, refreshToken: newRefreshToken } = tokens;
    setCookie(c, "refreshToken", newRefreshToken, COOKIE_OPTIONS);
    return c.json({ token: accessToken });
  })
  .post("/logout", validateRequest(logoutSchema), async (c) => {
    const refreshToken = getCookie(c, "refreshToken");
    if (!refreshToken) return c.json({}, { status: 204 });
    const { isLogoutFromAll } = c.req.valid("json");
    await AuthService.logout(refreshToken, isLogoutFromAll);
    deleteCookie(c, "refreshToken", COOKIE_OPTIONS);
    return c.json({}, { status: 204 });
  });

export default authRoutes;
