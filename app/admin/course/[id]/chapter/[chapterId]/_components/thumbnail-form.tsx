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
  videoThumbnail: z.string().min(1, { message: "required" }),
});

export const ThumbnailForm = ({
  initialData,
  chapterId,
  courseId,
}: ThumbnailFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { videoThumbnail: "" },
  });

  const { mutate: updateChapter, isPending } = useMutation({
    mutationFn: UPDATE_CHAPTER,
    onSuccess: (data) => {
      setIsEditing(false);
      toast.success(data?.success, {
        id: "update-chapter",
      });
    },
    onError: (error) => {
      toast.error(error.message, {
        id: "update-chapter",
      });
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    toast.loading("Chapter updating...", {
      id: "update-chapter",
    });
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
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.videoThumbnail && (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add an image
            </>
          )}
          {!isEditing && initialData.videoThumbnail && (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.videoThumbnail ? (
          <div className="flex h-60 items-center justify-center rounded-md bg-slate-200">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative mt-2 aspect-video">
            <Image
              alt="Upload"
              fill
              className="rounded-md object-cover"
              src={initialData.videoThumbnail}
            />
          </div>
        ))}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-8 space-y-4"
          >
            <div>
              <FormField
                control={form.control}
                name="videoThumbnail"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      {form.getValues("videoThumbnail") ? (
                        <div className="relative mt-2 aspect-video">
                          <Image
                            alt="Upload"
                            fill
                            className="rounded-md object-cover"
                            src={form.getValues("videoThumbnail")}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0"
                            onClick={() => form.setValue("videoThumbnail", "")}
                          >
                            <Trash2 className="h-5 w-5 text-rose-500" />
                          </Button>
                        </div>
                      ) : (
                        <UploadDropzone
                          endpoint="imageUploader"
                          onClientUploadComplete={(res) => {
                            // Do something with the response
                            field.onChange(res[0].url);
                            // toggleEdit()
                            toast.success("Image uploaded");
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
                  Save
                </Button>
              </div>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
