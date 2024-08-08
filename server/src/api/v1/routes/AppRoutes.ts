import { Hono } from "hono";
import userRoutes from "./UserRoutes";

const appRoutes = new Hono();
appRoutes.route("/users", userRoutes);
export default appRoutes;
