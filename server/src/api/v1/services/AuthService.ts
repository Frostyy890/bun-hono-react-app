import type { TRegisterInput, TLoginInput } from "../types/TAuth";
import UserService from "./UserService";

async function register(data: TRegisterInput) {}
async function login(data: TLoginInput) {}
async function logout() {}
async function refresh() {}

export default { register, login, logout, refresh };
