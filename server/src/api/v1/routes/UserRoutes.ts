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
    const user = await UserService.getOneUser({ id });
    if (!user) throw UserService.throwUserNotFound();
    return c.json({ user: new UserDto(user) }, HTTPStatusCode.OK);
  })
  .get("/me", async (c) => {
    const payload = c.get("jwtPayload");
    const user = await UserService.getOneUser({ id: payload.sub.userId });
    if (!user) throw UserService.throwUserNotFound();
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
      const updatedUser = await UserService.updateUser(id, data);
      if (!updatedUser) throw UserService.throwUserNotFound();
      return c.json({ user: new UserDto(updatedUser) }, HTTPStatusCode.OK);
    }
  )
  .delete("/:id{[0-9]+}", AuthMiddleware.authorizeRole([UserRole.ADMIN]), async (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const deletedUser = await UserService.deleteUser(id);
    if (!deletedUser) throw UserService.throwUserNotFound();
    return c.json({ message: "User deleted" }, HTTPStatusCode.OK);
  });

export default userRoutes;
