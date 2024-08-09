import { Hono } from "hono";
import UserService from "../services/UserService";
import validateRequest from "../middlewares/ValidateRequest";
import { createUserSchema, updateUserSchema } from "../validations/UserValidations";
import { UserDto } from "../dto/UserDto";
import HTTPStatusCode from "../constants/HTTPStatusCode";

const userRoutes = new Hono()
  .get("/", async (c) => {
    const users = await UserService.getAllUsers();
    const usersDto = users.map((user) => new UserDto(user));
    return c.json({ users: usersDto, length: users.length });
  })
  .get("/:id{[0-9]+}", async (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const user = new UserDto(await UserService.getUserById(id));
    return c.json({ user });
  })
  .post("/", validateRequest(createUserSchema), async (c) => {
    const data = c.req.valid("json");
    const newUser = new UserDto(await UserService.createUser(data));
    return c.json({ user: newUser }, { status: HTTPStatusCode.CREATED });
  })
  .patch("/:id{[0-9]+}", validateRequest(updateUserSchema), async (c) => {
    const id = Number.parseInt(c.req.param("id"));
    const data = c.req.valid("json");
    await UserService.getUserById(id);
    const updatedUser = new UserDto(await UserService.updateUser(id, data));
    return c.json({ user: updatedUser });
  })
  .delete("/:id{[0-9]+}", async (c) => {
    const id = Number.parseInt(c.req.param("id"));
    await UserService.getUserById(id);
    await UserService.deleteUser(id);
    return c.json({ message: "User deleted" });
  });

export default userRoutes;
