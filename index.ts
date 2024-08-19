import type { TUser } from "./server/src/api/v1/types/TUser";
import { db, type TDbClient } from "./server/src/db/connection";
import { usersTable } from "./server/src/db/schema";

// async function getByAttr<T extends keyof TBlacklistRecord>(args: {
//   [key in T]: TBlacklistRecord[T];
// }) {
//   const attributes = Object.keys(args) as T[];
//   const values = Object.values(args) as TBlacklistRecord[T][];
//   return await db.select().from(blacklistTable).where();
// }

// getByAttr({ reason: BlacklistReason.SPAM, userId: 1 });

// async function getUserByAttr<T extends keyof TUser>(args: {
//   [key in T]: TUser[T];
// }) {
//   const attributes = Object.keys(args) as T[];
//   const values = Object.values(args) as TUser[T][];
//   console.log("Attributes", attributes);
//   console.log("Values", values);
//   const [user] = await db
//     .select()
//     .from(usersTable)
//     .where(and(...attributes.map((attr, index) => eq(usersTable[attr], values[index]))));
//   return user;
// }
