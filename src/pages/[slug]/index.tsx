import { eq } from "drizzle-orm";
import { Post as PostComponent } from "~/components/post";
import { db } from "~/db";
import { Post } from "~/schema";

export default async function PostPage({ slug }: { slug: string }) {
  const data = await getData(slug);
  if (!data.post) {
    return "Not Found";
  }
  return <PostComponent post={data.post} />;
}

const getData = async (slug: string) => {
  return {
    post: await db.query.Post.findFirst({
      where: eq(Post.slug, slug),
    }),
  };
};

export const getConfig = async () => {
  return {
    render: "dynamic",
  };
};
