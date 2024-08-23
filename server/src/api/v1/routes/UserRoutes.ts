import { Hono } from "hono";
import UserService from "../services/UserService";
import validateRequest from "../middlewares/ValidateRequest";
import { createUserSchema, updateUserSchema } from "../validations/UserValidations";
import { UserDto } from "../dto/UserDto";
import HTTPStatusCode from "../constants/HTTPStatusCode";
import type { TAuthEnv } from "../types/TAuth";
import AuthMiddleware from "../middlewares/AuthMiddleware";
import { UserRole } from "../../../db/schema";

const userRoutes = new Hono<TAuthEnv>()
  .get("/", AuthMiddleware.authorizeRole([UserRole.ADMIN]), async (c) => {
    const users = await UserService.getAllUsers();
    const usersDto = users.map((user) => new UserDto(user));
    return c.json({ users: usersDto, length: users.length }, HTTPStatusCode.OK);
  })
  .get("/:id{[0-9]+}", AuthMiddleware.authorizeRole([UserRole.ADMIN]), async (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const maybeUser = await UserService.getUserByAttribute("id", id);
    const user = UserService.checkUserOutput(maybeUser);
    return c.json({ user: new UserDto(user) }, HTTPStatusCode.OK);
  })
  .get("/me", async (c) => {
    const payload = c.get("jwtPayload");
    const maybeUser = await UserService.getUserByAttribute("id", payload.sub.userId);
    const user = UserService.checkUserOutput(maybeUser);
    return c.json({ user: new UserDto(user) }, HTTPStatusCode.OK);
  })
  .post(
    "/",
    AuthMiddleware.authorizeRole([UserRole.ADMIN]),
    validateRequest(createUserSchema),
    async (c) => {
      const data = c.req.valid("json");
      const newUser = new UserDto(await UserService.createUser(data));
      return c.json({ user: newUser }, HTTPStatusCode.CREATED);
    }
  )
  .patch(
    "/:id{[0-9]+}",
    AuthMiddleware.authorizeRole([UserRole.ADMIN]),
    validateRequest(updateUserSchema),
    async (c) => {
      const id = Number.parseInt(c.req.param("id"));
      const data = c.req.valid("json");
      const maybeUpdatedUser = await UserService.updateUser(id, data);
      const updatedUser = UserService.checkUserOutput(maybeUpdatedUser);
      return c.json({ user: new UserDto(updatedUser) }, HTTPStatusCode.OK);
    }
  )
  .delete("/:id{[0-9]+}", AuthMiddleware.authorizeRole([UserRole.ADMIN]), async (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const maybeDeletedUser = await UserService.deleteUser(id);
    UserService.checkUserOutput(maybeDeletedUser);
    return c.json({ message: "User deleted" }, HTTPStatusCode.OK);
  });

export default userRoutes;
