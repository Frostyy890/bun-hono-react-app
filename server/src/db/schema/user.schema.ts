import {
  pgTable,
  serial,
  varchar,
  pgEnum,
  timestamp,
  integer,
} from "drizzle-orm/pg-core";

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

export const userRoles = pgEnum("role", [UserRole.ADMIN, UserRole.USER]);

export const usersTable = pgTable("Users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).unique().notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  role: userRoles("role").default(UserRole.USER).notNull(),
  refreshTokenVersion: integer("refreshTokenVersion").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});
