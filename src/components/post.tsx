import { type EvaluateOptions, evaluate } from "@mdx-js/mdx";
import type { RehypeShikiOptions } from "@shikijs/rehype";
import rehypeShikiFromHighlighter from "@shikijs/rehype/core";
import { createHighlighterCore } from "shiki/core";

import * as runtime from "react/jsx-runtime";
import getWasm from "shiki/wasm";
import type { Post as PostType } from "../schema";
import { PostHeader } from "./post-header";

const highlighter = await createHighlighterCore({
  themes: [import("shiki/themes/night-owl.mjs")],
  langs: [
    import("shiki/langs/javascript.mjs"),
    import("shiki/langs/typescript.mjs"),
    import("shiki/langs/markdown.mjs"),
    import("shiki/langs/sql.mjs"),
    import("shiki/langs/bash.mjs"),
    import("shiki/langs/jsx.mjs"),
    import("shiki/langs/tsx.mjs"),
  ],
  loadWasm: getWasm,
});

export interface MDXProps
  extends Omit<
    EvaluateOptions,
    "Fragment" | "jsx" | "jsxDEV" | "jsxs" | "development"
  > {
  source: Parameters<typeof evaluate>[0];
}

export async function MDX(props: MDXProps) {
  const { source, ...rest } = props;
  const { default: MDXContent } = await evaluate(source, {
    ...rest,
    ...(runtime as Pick<EvaluateOptions, "Fragment" | "jsx" | "jsxs">),
  });

  return <MDXContent />;
}

export async function Post({ post }: { post: PostType }) {
  const image = false;
  return (
    <div
      className={[
        "prose",
        "max-w-none",
        "grid grid-cols-[minmax(10px,1fr)_min(65ch,90%)_minmax(10px,1fr)] [&>*]:col-[2] [&>.full-bleed]:col-[1/4]",
        "[&_p]:mb-4 [&_p]:sm:mb-6",
        "[&_a]:underline",
        "[&_h2]:mb-4 [&_h2]:font-serif [&_h2]:text-2xl",
        "[&_h3]:mb-4 [&_h3]:font-serif [&_h3]:text-xl",
        "[&_h4]:mb-4 [&_h4]:font-serif [&_h4]:text-lg",
        "[&_li]:mb-2 [&_li_p]:mb-0 [&_li_p]:inline",
        "[&_ul]:mb-4 [&_ul]:sm:mb-6 [&_ul_li]:ml-6 [&_ul_li]:list-disc [&_ul_li]:marker:text-lime",
        "[&_ol]:mb-4 [&_ol]:sm:mb-6 [&_ol_li]:list-inside [&_ol_li]:list-decimal",
        "[&>table]:col-[1/4] [&>table]:mx-auto [&>table]:max-w-[min(125ch,calc(100%-40px))] [&>table]:overflow-x-auto",
        "[&_pre]:col-[1/4] [&_pre]:mx-auto [&_pre]:mb-4 [&_pre]:w-full [&_pre]:overflow-x-auto [&_pre]:rounded-none [&_pre]:p-4 [&_pre]:text-xs [&_pre]:sm:max-w-[calc(100%-16px)]",
        "[&_pre]:sm:mb-6 [&_pre]:sm:w-auto [&_pre]:sm:rounded-lg",
        "[&_p_code]:font-medium",
        "[&_.wider]:col-[1/4] [&_.wider]:max-w-[calc(100%-16px)] [&_.wider]:overflow-x-auto",
        "[&_.full-bleed]:mx-auto [&_.full-bleed]:mb-4 [&_.full-bleed]:w-full  [&_.full-bleed]:sm:mb-6",
        "[&_blockquote]:relative [&_blockquote]:ml-4 [&_blockquote]:pr-4 [&_blockquote]:font-mono [&_blockquote]:text-xs",
        "[&_blockquote]:before:absolute [&_blockquote]:before:-left-1.5 [&_blockquote]:before:h-full [&_blockquote]:before:w-0.5 [&_blockquote]:before:rounded [&_blockquote]:before:bg-slate-900",
        "[&_blockquote_footer]:font-medium",
        "[&_hr]:mx-4",
      ].join(" ")}
    >
      <div className="full-bleed">
        {image ? (
          <div className="relative mb-16 sm:mb-24">
            <div className="absolute inset-0 bg-gradient-to-t from-black/70" />
            <div className="absolute inset-x-0 bottom-[10%] flex flex-col items-center justify-center">
              <PostHeader
                date={post.publishedAt ?? post.createdAt}
                title={post.title}
                locale={post.locale}
              />
            </div>
            <img
              src={`/blog/${image}`}
              className="max-h-[70vh] min-h-[80vh] w-full object-cover sm:min-h-0"
              alt="Banner"
            />
          </div>
        ) : (
          <div className="py py-16 sm:py-24">
            <PostHeader
              date={post.publishedAt ?? post.createdAt}
              title={post.title}
              locale={post.locale}
            />
          </div>
        )}
      </div>

      <MDX
        source={post.content}
        rehypePlugins={[
          [
            rehypeShikiFromHighlighter,
            highlighter,
            {
              theme: "night-owl",
              fallbackLanguage: "txt",
            } satisfies RehypeShikiOptions,
          ],
        ]}
      />
    </div>
  );
}
