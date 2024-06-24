import { type InferSelectModel, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

const Post = sqliteTable("post", {
  slug: text("slug").primaryKey(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
  modifiedAt: integer("modified_at", { mode: "timestamp" }).$onUpdate(
    () => new Date()
  ),
  title: text("title").notNull(),
  content: text("content").notNull(),
  previewContent: text("preview_content"),
  locale: text("locale", { enum: ["is-IS", "en-US"] })
    .default("en-US")
    .notNull(),
  publishedAt: integer("published_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(strftime('%s', 'now'))`),
  isPublished: integer("is_published", { mode: "boolean" })
    .notNull()
    .default(true),
});
export type Post = InferSelectModel<typeof Post>;

// biome-ignore lint/style/useExportType: Biome doesn't understand overlapping TS Type/Object exports
export { Post };
