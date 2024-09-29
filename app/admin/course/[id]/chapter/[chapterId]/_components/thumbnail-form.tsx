"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ImageIcon, Pencil, PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { Chapter } from "@prisma/client";
import Image from "next/image";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { UploadDropzone } from "@/lib/uploadthing";
import { UPDATE_CHAPTER } from "../action";

interface ThumbnailFormProps {
  initialData: Chapter;
  chapterId: string;
  courseId: string;
}

const formSchema = z.object({
  videoThumbnail: z.string().min(1, { message: "Image is required" }),
});

export const ThumbnailForm = ({ initialData, chapterId, courseId }: ThumbnailFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { videoThumbnail: initialData.videoThumbnail || "" },
  });

  const { mutate: updateChapter, isPending } = useMutation({
    mutationFn: UPDATE_CHAPTER,
    onSuccess: (data) => {
      setIsEditing(false);
      toast.success(data.success || "Chapter updated successfully", { id: "update-chapter" });
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update chapter", { id: "update-chapter" });
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    toast.loading("Updating chapter...", { id: "update-chapter" });
    updateChapter({
      id: chapterId,
      courseId,
      values: { ...initialData, videoThumbnail: values.videoThumbnail },
    });
  };

  return (
    <div className="mt-6 rounded-md border bg-card p-4">
      <div className="flex items-center justify-between font-medium">
        Thumbnail
        <Button onClick={() => setIsEditing((prev) => !prev)} variant="ghost">
          {isEditing ? "Cancel" : (initialData.videoThumbnail ? <Pencil className="mr-2 h-4 w-4" /> : <PlusCircle className="mr-2 h-4 w-4" />)}
          {isEditing ? "Cancel" : (initialData.videoThumbnail ? "Edit" : "Add an image")}
        </Button>
      </div>
      {!isEditing ? (
        initialData.videoThumbnail ? (
          <div className="relative mt-2 aspect-video">
            <Image
              alt="Upload"
              fill
              className="rounded-md object-cover"
              src={initialData.videoThumbnail}
            />
          </div>
        ) : (
          <div className="flex h-60 items-center justify-center rounded-md bg-slate-200">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        )
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-4">
            <FormField
              control={form.control}
              name="videoThumbnail"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    {field.value ? (
                      <div className="relative mt-2 aspect-video">
                        <Image
                          alt="Upload"
                          fill
                          className="rounded-md object-cover"
                          src={field.value}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0"
                          onClick={() => field.onChange("")}
                        >
                          <Trash2 className="h-5 w-5 text-rose-500" />
                        </Button>
                      </div>
                    ) : (
                      <UploadDropzone
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                          field.onChange(res[0].url);
                          toast.success("Image uploaded successfully");
                        }}
                        onUploadError={(error: Error) => {
                          toast.error("Image upload failed");
                        }}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="mt-4 text-xs text-muted-foreground">
              16:9 aspect ratio recommended
            </div>
            <div className="flex justify-end">
              <Button disabled={isPending} type="submit">
                {isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
