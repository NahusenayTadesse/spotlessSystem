import { sql } from 'drizzle-orm';
import {
    varchar,
    int,
    mysqlTable,
    decimal,
    char,
    boolean,
    timestamp,
    index,
    
} from 'drizzle-orm/mysql-core';
export const branches = mysqlTable('branches', {
    id: int('id').autoincrement().primaryKey(),
    parent_branch_id: int('parent_branch_id'), // nullable, FK -> branches.id
    name: varchar('name', { length: 64 }).notNull(),
    address_line1: varchar('address_line1', { length: 128 }),
    address_line2: varchar('address_line2', { length: 128 }),
    city: varchar('city', { length: 64 }),
    state: varchar('state', { length: 64 }),
    postal_code: varchar('postal_code', { length: 16 }),
    country_code: char('country_code', { length: 2 }), // ISO-3166-1 alpha-2
    phone_number: varchar('phone_number', { length: 32 }),
    email: varchar('email', { length: 128 }),
    timezone: varchar('timezone', { length: 64 }),
    latitude: decimal('latitude', { precision: 10, scale: 8 }),
    longitude: decimal('longitude', { precision: 11, scale: 8 }),
    is_active: boolean('is_active').default(true),
    created_at: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').default(sql`CURRENT_TIMESTAMP(3) on update CURRENT_TIMESTAMP(3)`).notNull(),
},  (table) => [
  index("branch_id_idx").on(table.id),
]);
