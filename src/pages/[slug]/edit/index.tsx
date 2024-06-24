import { eq } from "drizzle-orm";
import { Editor } from "~/components/editor";
import { Modal } from "~/components/modal";
import { Post as PostComponent } from "~/components/post";
import { db } from "~/db";
import { Post } from "~/schema";

export default async function PostPage({ slug }: { slug: string }) {
  const data = await getData(slug);
  if (!data.post) {
    return "Not Found";
  }

  return (
    <Modal defaultOpen={true}>
      <div className="grid grid-cols-[1.2fr_1fr] gap-4 h-full p-4">
        <div className="overflow-y-auto">
          <Editor post={data.post} />
        </div>
        <div className="overflow-y-auto">
          <PostComponent
            post={{
              ...data.post,
              content: data.post.previewContent ?? data.post.content,
            }}
          />
        </div>
      </div>
    </Modal>
  );
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
