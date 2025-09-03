import {
  index,
  integer,
  jsonb,
  pgEnum,
  pgSchema,
  pgTableCreator,
  real,
  serial,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

import { InventoryFormData } from "~/app/_components/DefaultForm";

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

export const formResponses = createTable("formResponses", {
  id: serial("id").primaryKey(),
  data: jsonb("data").$type<string>().notNull(),
  createdAt: timestamp("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp("updatedAt"),
  createdById: uuid("createdById")
    .notNull()
    .references(() => users.id),
  mondayItemId: varchar("mondayItemId", { length: 256 }),
  status: varchar("status", { length: 256 }),
  processingStatus: varchar("processingStatus", { length: 64 }),
  processingMeta: jsonb("processingMeta").$type<Record<string, unknown>>(),
});

export const formResponsesRelations = relations(formResponses, ({ one }) => ({
  users: one(users, {
    fields: [formResponses.createdById],
    references: [users.id],
  }),
}));

export const authSchema = pgSchema("auth");

export const authUsers = authSchema.table("users", {
  id: uuid("id").primaryKey().notNull(),
});

export const users = createTable("user", {
  id: uuid("id")
    .primaryKey()
    .notNull()
    .references(() => authUsers.id, { onDelete: "cascade" }),

  firstName: varchar("firstName", { length: 256 }),
  lastName: varchar("lastName", { length: 256 }),
  email: varchar("email", { length: 256 }),
  tel: varchar("tel", { length: 256 }),
});

// 1. Enum for role names
export const appRoleEnum = pgEnum("app_role", ["admin", "moderator", "user"]);

// 2. Table that binds a Supabase user to one or more roles
export const userRoles = createTable(
  "user_roles",
  {
    id: serial("id").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => authUsers.id, { onDelete: "cascade" }),
    role: appRoleEnum("role").notNull(),
  },
  (t) => ({
    // avoid duplicate role assignments
    userRoleUnique: unique("user_role_unique").on(t.userId, t.role),
  }),
);

export const products = createTable(
  "products",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }).notNull(),
    description: varchar("description", { length: 256 }),
    quantity: integer("quantity").notNull().default(0),
    price: real("price").notNull().default(0.0),
    category: varchar("category", { length: 256 }),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt"),
  },
  (example) => ({
    productNameIndex: index("product_name_idx").on(example.name),
  }),
);
