import { InferSelectModel } from "drizzle-orm";
import { pgTable, text, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";
			
export const roleEnum = pgEnum('role', [
  'admin',
  'user'
])

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text('name').notNull().unique(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull(),
  image: text('image').default("default").notNull(),
  banner: text('banner'),
  isAnonymous: boolean('is_anonymous').default(false),
  roles: roleEnum('roles').array().default(["user"]).notNull(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull()
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  token: text('token').notNull().unique(),
  userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expires_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  userId: text('user_id').notNull().references(()=> user.id, { onDelete: 'cascade' }),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  idToken: text('id_token'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull()
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at'),
  updatedAt: timestamp('updated_at')
});

export type User = InferSelectModel<typeof user>;