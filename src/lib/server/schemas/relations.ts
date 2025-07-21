/**
 * @file Drizzle ORM Schema Relations
 * @description
 * This file defines the explicit relationships between different database schemas (tables)
 * using Drizzle ORM's `relations` function. These definitions enable Drizzle to understand
 * the structural connections between your data models and facilitate advanced querying,
 * such as eager loading related entities.
 *
 * For a comprehensive guide to Drizzle relations, consult the
 * [Drizzle ORM Relations documentation](https://orm.drizzle.team/docs/relations).
 */

// Import the `relations` utility from Drizzle ORM.
import { relations } from "drizzle-orm";
// Import individual schema definitions that participate in relationships.
import { user } from "./authentication";
import { example } from "./example";
import { exampleTwo } from "./exampleTwo";

/**
 * @constant {ReturnType<typeof relations>} userRelations
 * @description
 * Defines relationships originating from the `user` schema.
 *
 * @property {object} example - A one-to-one relationship indicating that a `user`
 * is associated with a single `example` entry.
 * @property {object} exampleTwo - A one-to-many relationship indicating that a `user`
 * can be associated with multiple `exampleTwo` entries.
 * @property {object} exampleTwoRelates - An additional one-to-many relationship to `exampleTwo`,
 * distinguished by a `relationName`. This is used when multiple distinct relationships
 * exist between the same two schemas.
 * @property {object} exampleTwoRelates.options
 * @property {string} exampleTwoRelates.options.relationName - A unique identifier for this specific relationship.
 */
export const userRelations = relations(user, ({ many, one }) => ({
    example: one(example),
    exampleTwo: many(exampleTwo),

    exampleTwoRelates: many(exampleTwo, {
        relationName: "example_two_relations"
    })
}));

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