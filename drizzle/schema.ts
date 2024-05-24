import { pgTable, index, pgEnum, serial, varchar, timestamp, foreignKey, uuid, jsonb } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const keyStatus = pgEnum("key_status", ['default', 'valid', 'invalid', 'expired'])
export const keyType = pgEnum("key_type", ['aead-ietf', 'aead-det', 'hmacsha512', 'hmacsha256', 'auth', 'shorthash', 'generichash', 'kdf', 'secretbox', 'secretstream', 'stream_xchacha20'])
export const aalLevel = pgEnum("aal_level", ['aal1', 'aal2', 'aal3'])
export const codeChallengeMethod = pgEnum("code_challenge_method", ['s256', 'plain'])
export const factorStatus = pgEnum("factor_status", ['unverified', 'verified'])
export const factorType = pgEnum("factor_type", ['totp', 'webauthn'])
export const equalityOp = pgEnum("equality_op", ['eq', 'neq', 'lt', 'lte', 'gt', 'gte', 'in'])
export const action = pgEnum("action", ['INSERT', 'UPDATE', 'DELETE', 'TRUNCATE', 'ERROR'])
export const oneTimeTokenType = pgEnum("one_time_token_type", ['confirmation_token', 'reauthentication_token', 'recovery_token', 'email_change_token_new', 'email_change_token_current', 'phone_change_token'])


export const createT3AppPost = pgTable("create-t3-app_post", {
	id: serial("id").primaryKey().notNull(),
	name: varchar("name", { length: 256 }),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { mode: 'string' }),
},
(table) => {
	return {
		nameIdx: index("name_idx").on(table.name),
	}
});

export const createT3AppUser = pgTable("create-t3-app_user", {
	id: uuid("id").primaryKey().notNull().references(() => users.id, { onDelete: "cascade" } ),
	email: varchar("email", { length: 256 }),
	tel: varchar("tel", { length: 256 }),
	firstName: varchar("firstName", { length: 256 }),
	lastName: varchar("lastName", { length: 256 }),
});

export const createT3AppFormResponses = pgTable("create-t3-app_formResponses", {
	id: serial("id").primaryKey().notNull(),
	data: jsonb("data").notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updatedAt", { mode: 'string' }),
	mondayItemId: varchar("mondayItemId", { length: 256 }),
	status: varchar("status", { length: 256 }),
	createdById: uuid("createdById").references(() => createT3AppUser.id),
});