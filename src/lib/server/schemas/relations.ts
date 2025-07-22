/**
 * @file Drizzle ORM Schema Relations
 * @description
 * This file defines the explicit relationships between different database schemas (tables)
 * using Drizzle ORM's `relations` function. These definitions enable Drizzle to understand
 * the structural connections between the data models and facilitate advanced querying,
 * such as eager loading related entities.
 *
 * @note For a comprehensive guide to Drizzle relations, consult the
 * [Drizzle ORM Relations documentation](https://orm.drizzle.team/docs/relations).
 */

// Import the `relations` utility from Drizzle ORM.
import { relations } from "drizzle-orm";
// Import individual schema definitions that participate in relationships.
import { user } from "./authentication";
import { example } from "./example";

/**
 * @constant {ReturnType<typeof relations>} exampleRelations
 * @description
 * Defines relationships originating from the `example` schema.
 *
 * @property {object} user - A one-to-one relationship indicating that an `example` entry
 * belongs to a single `user`. This explicitly maps `example.userId` as a foreign key
 * referencing `user.id`.
 * @property {string[]} user.fields - The column(s) in the `example` table serving as the foreign key.
 * @property {string[]} user.references - The column(s) in the `user` table that the foreign key refers to.
 */
export const exampleRelations = relations(example, ({ one }) => ({
    user: one(user, {
        fields: [example.userId],
        references: [user.id]
    })
}));