"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, PlusCircle } from "lucide-react";
import { useState, useCallback } from "react";
import { Chapter } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";
import { CREATE_CHAPTER, REORDER_CHAPTER } from "../action";
import { ChaptersList } from "./chapter-list";

interface ChaptersFormProps {
  chapters: Chapter[];
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
});

export const ChaptersForm = ({ chapters, courseId }: ChaptersFormProps) => {
  const [isCreating, setIsCreating] = useState(false);

  const toggleCreating = useCallback(() => setIsCreating((current) => !current), []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "" },
  });

  const { mutate: createChapter, isPending: isCreatingChapter } = useMutation({
    mutationFn: CREATE_CHAPTER,
    onSuccess: (data) => {
      toggleCreating();
      form.reset();
      toast.success(data?.success, { id: "create-chapter" });
    },
    onError: (error) => {
      toast.error(error.message, { id: "create-chapter" });
    },
  });

  const onSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => {
      toast.loading("Creating chapter...", { id: "create-chapter" });
      createChapter({ courseId, title: values.title });
    },
    [createChapter, courseId]
  );

  const { mutate: reorderChapter, isPending: isReordering } = useMutation({
    mutationFn: REORDER_CHAPTER,
    onSuccess: (data) => {
      toast.success(data?.success, { id: "reorder-chapter" });
    },
    onError: (error) => {
      toast.error(error.message, { id: "reorder-chapter" });
    },
  });

  const onReorder = useCallback(
    (updateData: { id: string; position: number }[]) => {
      toast.loading("Reordering chapters...", { id: "reorder-chapter" });
      reorderChapter({ list: updateData });
    },
    [reorderChapter]
  );

  return (
    <div className="relative mt-6 rounded-md border bg-card p-4">
      {(isReordering || isCreatingChapter) && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-500/20 z-10">
          <Loader2 className="h-6 w-6 animate-spin text-sky-700" />
        </div>
      )}

      <div className="flex items-center justify-between font-medium">
        <span>Chapters</span>
        <Button onClick={toggleCreating} variant="ghost">
          {isCreating ? "Cancel" : (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add a chapter
            </>
          )}
        </Button>
      </div>

      {isCreating ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isCreatingChapter}
                      placeholder="e.g. 'Introduction to the course'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isCreatingChapter} type="submit">
              {isCreatingChapter ? "Creating..." : "Create"}
            </Button>
          </form>
        </Form>
      ) : (
        <>
          <div className={cn("mt-2 text-sm", !chapters.length && "italic text-slate-500")}>
            {chapters.length ? (
              <ChaptersList
                courseId={courseId}
                onReorder={onReorder}
                items={chapters}
              />
            ) : (
              "No chapters"
            )}
          </div>
          {chapters.length > 0 && (
            <p className="mt-4 text-xs text-muted-foreground">
              Drag and drop to reorder the chapters
            </p>
          )}
        </>
      )}
    </div>
  );
};
