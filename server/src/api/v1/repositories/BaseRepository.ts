import { type PgTableWithColumns, type TableConfig, type PgInsertValue } from "drizzle-orm/pg-core";
import { eq, and } from "drizzle-orm";
import { db, type TDbClient } from "../../../db/connection";

export default class BaseRepository<T extends TableConfig> {
  private table: PgTableWithColumns<T>;
  constructor(table: typeof this.table) {
    this.table = table;
  }
  async findMany<
    TSchema extends typeof this.table.$inferSelect,
    TSchemaKey extends keyof typeof this.table.$inferSelect
  >(
    args: {
      where?: {
        [key in TSchemaKey]: TSchema[TSchemaKey];
      };
    },
    tx?: TDbClient // for transactions
  ) {
    const query = tx ?? db;
    if (args.where) {
      const attributes = Object.keys(args.where) as TSchemaKey[];
      const values = Object.values(args.where) as TSchema[TSchemaKey][];
      return await query
        .select()
        .from(this.table)
        .where(and(...attributes.map((attr, index) => eq(this.table[attr], values[index]))));
    }
    return await query.select().from(this.table);
  }
  async findOne<
    TSchema extends typeof this.table.$inferSelect,
    TSchemaKey extends keyof typeof this.table.$inferSelect
  >(
    args: {
      where: {
        [key in TSchemaKey]: TSchema[TSchemaKey];
      };
    },
    tx?: TDbClient
  ) {
    return (await this.findMany(args, tx))[0];
  }
  async create<TTable extends typeof this.table>(
    args: {
      data: TTable["$inferInsert"] & PgInsertValue<TTable>;
    },
    tx?: TDbClient
  ) {
    const query = tx ?? db;
    const [record] = await query.insert(this.table).values(args.data).returning();
    return record;
  }
  async update<
    TSchema extends typeof this.table.$inferSelect,
    TSchemaKey extends keyof typeof this.table.$inferSelect,
    TTable extends typeof this.table
  >(
    args: {
      where: {
        [key in TSchemaKey]: TSchema[TSchemaKey];
      };
      data: Partial<TTable["$inferInsert"] & PgInsertValue<TTable>>;
    },
    tx?: TDbClient
  ) {
    const query = tx ?? db;
    const attributes = Object.keys(args.where) as TSchemaKey[];
    const values = Object.values(args.where) as TSchema[TSchemaKey][];
    const [record] = await query
      .update(this.table)
      .set(args.data)
      .where(and(...attributes.map((attr, index) => eq(this.table[attr], values[index]))))
      .returning();
    return record;
  }
  async delete<
    TSchema extends typeof this.table.$inferSelect,
    TSchemaKey extends keyof typeof this.table.$inferSelect
  >(
    args: {
      where: {
        [key in TSchemaKey]: TSchema[TSchemaKey];
      };
    },
    tx?: TDbClient
  ) {
    const query = tx ?? db;
    const attributes = Object.keys(args.where) as TSchemaKey[];
    const values = Object.values(args.where) as TSchema[TSchemaKey][];
    const [deletedRecord] = await query
      .delete(this.table)
      .where(and(...attributes.map((attr, index) => eq(this.table[attr], values[index]))))
      .returning();
    return deletedRecord;
  }
}
