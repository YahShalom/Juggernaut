
import { integer, sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

export const users = sqliteTable('users', {
    id: text('id').primaryKey(),
    email: text('email').notNull().unique(),
    role: text('role', { enum: ['admin', 'user'] }).notNull().default('user'),
});

export const sessions = sqliteTable('sessions', {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => users.id),
    expiresAt: integer('expires_at').notNull(),
});

export const tenants = sqliteTable('tenants', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    slug: text('slug').notNull().unique(),
});

export const usersToTenants = sqliteTable('users_to_tenants', {
    userId: text('user_id').notNull().references(() => users.id),
    tenantId: text('tenant_id').notNull().references(() => tenants.id),
    role: text('role', { enum: ['admin', 'member'] }).notNull(),
}, (t) => ({
    pk: primaryKey({ columns: [t.userId, t.tenantId] }),
}));

export const invites = sqliteTable('invites', {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id').notNull().references(() => tenants.id),
    userId: text('user_id').notNull().references(() => users.id),
    role: text('role', { enum: ['admin', 'member'] }).notNull(),
    token: text('token').notNull().unique(),
    expiresAt: integer('expires_at').notNull(),
});

export const hairStyles = sqliteTable('hair_styles', {
    id: text('id').primaryKey(),
    tenantId: text('tenant_id').notNull().references(() => tenants.id),
    name: text('name').notNull(),
    // other fields as necessary
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

export type Tenant = typeof tenants.$inferSelect;
export type NewTenant = typeof tenants.$inferInsert;

export type UserToTenant = typeof usersToTenants.$inferSelect;
export type NewUserToTenant = typeof usersToTenants.$inferInsert;

export type Invite = typeof invites.$inferSelect;
export type NewInvite = typeof invites.$inferInsert;

export type HairStyle = typeof hairStyles.$inferSelect;
export type NewHairStyle = typeof hairStyles.$inferInsert;
