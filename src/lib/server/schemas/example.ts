/**
 * @file Example Database Schema Definition
 * @description
 * This file defines the `example` database table schema for PostgreSQL using Drizzle ORM.
 * It specifies column definitions, constraints, default values, and indexing.
 *
 */

// Import necessary Drizzle ORM utilities and column types.
import { sql, type InferInsertModel } from "drizzle-orm";
import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
// Import related schema for foreign key definition.
import { user } from "./authentication";

/**
 * @constant {ReturnType<typeof pgTable>} example
 * @description
 * Defines the `example` table.
 *
 * @property {string} id - Primary key (UUID, auto-generated).
 * @property {string} title - Non-nullable text field.
 * @property {string} userId - Non-nullable text field, foreign key referencing `user.id`.
 * @property {Date} createdAt - Non-nullable timestamp, defaults to current time.
 * @property {Date} updatedAt - Timestamp, defaults to current time and updates on record modification.
 * @property {object} table-level-index - Defines a database index on `userId` for performance.
 */
export const example = pgTable('example', {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`).notNull(),
    title: text("title").notNull(),
    userId: text("user_id").references(() => user.id).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date())
}, (table) => [
    index("example_id_created_at_index").on(table.userId.desc())
]);

/**
 * @typedef {InferInsertModel<typeof example>} ExampleSchema
 * @description
 * TypeScript type for inserting data into the `example` table.
 */
export type ExampleSchema = InferInsertModel<typeof example>;