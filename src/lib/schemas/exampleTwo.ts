import { sql, type InferInsertModel } from "drizzle-orm";
import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./authentication";



export const exampleTwo = pgTable('example_two', {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`).notNull(),
    title: text("title").notNull(),
    userId: text("user_id").references(() => user.id).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date())
}, (table) => [
    index("example_two_id_created_at_index").on(table.userId.desc())
]);


export type ExampleTwoSchema = InferInsertModel<typeof exampleTwo>;