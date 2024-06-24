"use server";

import { eq } from "drizzle-orm";
import { db } from "../db";
import { Post } from "../schema";

// Reference: https://github.com/t6adev/waku-simple-todo/blob/main/src/actions/todoActions.ts

export const updatePostPreviewContent = async (
  slug: string,
  content: string
) => {
  return await db
    .update(Post)
    .set({ previewContent: content })
    .where(eq(Post.slug, slug))
    .returning();
};

export const publishPreviewContent = async ({
  slug,
  isPublished,
  publishedAt,
  title,
  previewContent,
}: {
  slug: string;
  publishedAt: Date;
  title: string;
  isPublished: boolean;
  previewContent: string;
}) => {
  return await db
    .update(Post)
    .set({
      content: previewContent,
      publishedAt,
      isPublished,
      title,
    })
    .where(eq(Post.slug, slug))
    .returning();
};
