"use client";

import { fromDate, toCalendarDate } from "@internationalized/date";
import MonacoEditor from "@monaco-editor/react";
import { useField, useForm } from "@shopify/react-form";
import { RefreshCwIcon } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { DialogTrigger } from "react-aria-components";
import { useRouter_UNSTABLE as useRouter } from "waku";
import {
  publishPreviewContent,
  updatePostPreviewContent,
} from "~/actions/editor-actions";
import { useDebounce } from "~/hooks/use-debounce";
import type { Post } from "~/schema";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { Popover } from "./popover";
import { Switch } from "./switch";
import { TextField } from "./text-field";

export const Editor = ({ post }: { post: Post }) => {
  const debounce = useDebounce(2000);
  const router = useRouter();
  const [showChild, setShowChild] = useState(false);
  const [isPending, startTransition] = useTransition();

  const { fields, submit, dirty, submitting } = useForm({
    fields: {
      title: useField(post.title),
      publishedAt: useField(post.publishedAt),
      content: useField(post.previewContent ?? post.content),
      isPublished: useField(post.isPublished),
    },
    onSubmit: async (form) => {
      await publishPreviewContent({
        isPublished: form.isPublished,
        publishedAt: form.publishedAt,
        slug: post.slug,
        title: form.title,
        previewContent: form.content,
      }).then((value) => {
        router.reload();
        return value;
      });
      return { status: "success" };
    },
    makeCleanAfterSubmit: true,
  });

  // Wait until after client-side hydration to show
  useEffect(() => {
    setShowChild(true);
  }, []);

  return (
    <div className="h-full">
      <form
        className="grid grid-cols-[2fr_1fr_auto_auto_auto] gap-2 mt-1 mb-4 mx-1"
        onSubmit={submit}
      >
        <TextField
          type="text"
          value={fields.title.value}
          onChange={(event) => {
            fields.title.onChange(event);
          }}
        />
        <DialogTrigger>
          <Button variant="secondary">
            {toCalendarDate(
              fromDate(fields.publishedAt.value, "UTC")
            ).toString()}
          </Button>
          <Popover className="p-4">
            <Calendar
              value={toCalendarDate(fromDate(fields.publishedAt.value, "UTC"))}
              onChange={(value) => {
                fields.publishedAt.onChange(value.toDate("UTC"));
              }}
            />
          </Popover>
        </DialogTrigger>
        <Switch
          isSelected={fields.isPublished.value ?? false}
          onChange={(value) => fields.isPublished.onChange(value)}
        >
          Published
        </Switch>
        <Button type="submit" isDisabled={isPending || !dirty || submitting}>
          Publish
        </Button>
        <Button
          variant="icon"
          isDisabled={post.previewContent === fields.content.value || isPending}
          onPress={() => {
            startTransition(async () => {
              router.reload();
            });
          }}
        >
          <RefreshCwIcon className="w-5 h-5" />
        </Button>
      </form>
      <div className="contents">
        {showChild ? (
          <Inner
            value={fields.content.value}
            onChange={(previewContent) => {
              fields.content.onChange(previewContent);
              debounce(previewContent, (debouncedPreviewContent) => {
                startTransition(async () => {
                  await updatePostPreviewContent(
                    post.slug,
                    debouncedPreviewContent
                  );
                  router.reload();
                });
              });
            }}
          />
        ) : null}
      </div>
    </div>
  );
};

export const Inner = ({
  onChange,
  value,
}: {
  value: string;
  onChange: (value: string) => void;
}) => {
  return (
    <MonacoEditor
      theme="night-owl"
      height="100%"
      defaultLanguage="markdown"
      options={{
        minimap: { enabled: false },
      }}
      value={value}
      onChange={(value) => {
        onChange(value || "");
      }}
    />
  );
};
