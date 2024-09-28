"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Loader2, PlusCircle } from "lucide-react";
import { useState } from "react";
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
  title: z.string().min(1),
});

export const ChaptersForm = ({ chapters, courseId }: ChaptersFormProps) => {
  const [isCreating, setIsCreating] = useState(false);

  const toggleCreating = () => {
    setIsCreating((current) => !current);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { mutate: createChapter, isPending } = useMutation({
    mutationFn: CREATE_CHAPTER,
    onSuccess: (data) => {
      toggleCreating();
      form.reset();
      toast.success(data?.success, {
        id: "create-chapter",
      });
    },
    onError: (error) => {
      toast.error(error.message, {
        id: "create-chapter",
      });
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    toast.loading("Chapter creating...", {
      id: "create-chapter",
    });
    createChapter({ courseId: courseId, title: values.title });
  };

  const { mutate: reorderChapter, isPending: isReordering } = useMutation({
    mutationFn: REORDER_CHAPTER,
    onSuccess: (data) => {
      toast.success(data?.success, {
        id: "reorder-chapter",
      });
    },
    onError: (error) => {
      toast.error(error.message, {
        id: "reorder-chapter",
      });
    },
  });

  const onReorder = async (updateData: { id: string; position: number }[]) => {
    toast.loading("Chapter reordering...", {
      id: "reorder-chapter",
    });
    await reorderChapter({ list: updateData });
  };

  return (
    <div className="relative mt-6 rounded-md border bg-card p-4">
      {isReordering && (
        <div className="rounded-m absolute right-0 top-0 flex h-full w-full items-center justify-center bg-slate-500/20">
          <Loader2 className="h-6 w-6 animate-spin text-sky-700" />
        </div>
      )}
      <div className="flex items-center justify-between font-medium">
        Course chapters
        <Button onClick={toggleCreating} variant="ghost">
          {isCreating ? (
            <>Cancel</>
          ) : (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add a chapter
            </>
          )}
        </Button>
      </div>
      {isCreating && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="e.g. 'Introduction to the course'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isPending} type="submit">
              Create
            </Button>
          </form>
        </Form>
      )}
      {!isCreating && (
        <div
          className={cn(
            "mt-2 text-sm",
            !chapters.length && "italic text-slate-500",
          )}
        >
          {!chapters.length && "No chapters"}
          <ChaptersList
            courseId={courseId}
            onReorder={onReorder}
            items={chapters || []}
          />
        </div>
      )}
      {!isCreating && (
        <p className="mt-4 text-xs text-muted-foreground">
          Drag and drop to reorder the chapters
        </p>
      )}
    </div>
  );
};
