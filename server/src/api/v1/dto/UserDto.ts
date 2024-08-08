import type { TUser } from "../types/TUser";

export class UserDto {
  declare id: TUser["id"];
  declare username: TUser["username"];
  declare email: TUser["email"];
  declare role: TUser["role"];
  constructor(user: TUser) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
    this.role = user.role;
  }
}
