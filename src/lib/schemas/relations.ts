
import { relations } from "drizzle-orm";
import { user } from "./authentication";
import { example } from "./example";
import { exampleTwo } from "./exampleTwo";

export const userRelations = relations(user, ({ many, one }) => ({
    example: one(example),
    exampleTwo: many(exampleTwo),

    exampleTwoRelates: many(exampleTwo, {
        relationName: "example_two_relations"
    })
}));

export const exampleRelations = relations(example, ({ one }) => ({
    user: one(user, {
        fields: [example.userId],
        references: [user.id]
    })
}))