import {
  index,
  jsonb,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { sql } from "drizzle-orm";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `create-t3-app_${name}`);

export const posts = createTable(
  "post",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  }),
);

export const formResponse = createTable("formResponses", {
  id: serial("id").primaryKey(),
  data: jsonb("data"),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
});
