import { Hono } from "hono";
import UserService from "../services/UserService";
import { zValidator } from "@hono/zod-validator";
import { createUserSchema, updateUserSchema } from "../validations/UserValidations";
import { UserDto } from "../dto/UserDto";

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
  .post("/", zValidator("json", createUserSchema), async (c) => {
    const data = c.req.valid("json");
    const newUser = new UserDto(await UserService.createUser(data));
    return c.json({ user: newUser }, { status: 201 });
  })
  .patch("/:id{[0-9]+}", zValidator("json", updateUserSchema), async (c) => {
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
