import { relations } from "drizzle-orm";
import { boolean, integer, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const files = pgTable("files", {
    id: uuid("id").defaultRandom().primaryKey(),

    //basic file/folder information
    name: text("name").notNull(),
    path: text("path").notNull(), // /document/project/resume
    size: integer("size").notNull(),
    type: text("type").notNull(), //"Folder",


    // storage Information
    fileUrl: text("file_url").notNull(),
    thumbnailUrl: text("thumbnail_url"),

    // Ownership
    userId: text("user_id").notNull(),
    parentId: uuid("parent_id"),//parent folder id (null for root items)

    // file/folder flags
    isFolder: boolean("is_folder").default(false).notNull(),
    isStarred: boolean("is_starred").default(false).notNull(),
    isTrash: boolean("is_trash").default(false).notNull(),

    //Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/*
    parent: Each file/folder can have one parent folder

    children: Each folder can have many child files/folder
*/


export const filesRelations = relations(files, ({one, many})=>({
    parent: one(files, {
        fields: [files.parentId],
        references: [files.id]
    }),

    // relationship to child file/folder
    children: many(files)
}));

//Type defintions
export const File = typeof files.$inferSelect
export const NewFile = typeof files.$inferInsert