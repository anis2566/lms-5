"use client";

import * as z from "zod";
import { Pencil, PlusCircle, ImageIcon, Trash2 } from "lucide-react";
import { useState } from "react";
import { Course } from "@prisma/client";
import Image from "next/image";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

import {
  Form,
  FormControl,
  FormField,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";

import { UploadDropzone } from "@/lib/uploadthing";
import { UPDATE_COURSE } from "../action";

interface ImageFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: "required",
  }),
});

export const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageUrl: "",
    },
  });

  const { mutate: updateCourse, isPending } = useMutation({
    mutationFn: UPDATE_COURSE,
    onSuccess: (data) => {
      setIsEditing(false);
      toast.success(data?.success, {
        id: "update-course",
      });
    },
    onError: (error) => {
      toast.error(error.message, {
        id: "update-course",
      });
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    toast.loading("Course updating...", {
      id: "update-course",
    });
    updateCourse({
      id: courseId,
      values: { ...initialData, imageUrl: values.imageUrl },
    });
  };

  return (
    <div className="mt-6 rounded-md border bg-card p-4">
      <div className="flex items-center justify-between font-medium">
        Course thumbnail
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing && <>Cancel</>}
          {!isEditing && !initialData.imageUrl && (
            <>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add an image
            </>
          )}
          {!isEditing && initialData.imageUrl && (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit image
            </>
          )}
        </Button>
      </div>
      {!isEditing &&
        (!initialData.imageUrl ? (
          <div className="flex h-60 items-center justify-center rounded-md bg-slate-200">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative mt-2 aspect-video">
            <Image
              alt="Upload"
              fill
              className="rounded-md object-cover"
              src={initialData.imageUrl}
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
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      {form.getValues("imageUrl") ? (
                        <div className="relative mt-2 aspect-video">
                          <Image
                            alt="Upload"
                            fill
                            className="rounded-md object-cover"
                            src={form.getValues("imageUrl")}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0"
                            onClick={() => form.setValue("imageUrl", "")}
                          >
                            <Trash2 className="h-5 w-5 text-rose-500" />
                          </Button>
                        </div>
                      ) : (
                        <UploadDropzone
                          endpoint="imageUploader"
                          onClientUploadComplete={(res) => {
                            field.onChange(res[0].url);
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
