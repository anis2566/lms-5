"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { Chapter } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { VideoPlayer } from "@/components/video-player";
import { GET_CREDENTIALS, UPLOAD_VIDEO } from "../action";

interface ChapterVideoFormProps {
  initialData: Chapter;
  chapterId: string;
  courseId: string;
}

const formSchema = z.object({
  title: z.string().min(1, { message: "required" }),
  file: z.instanceof(File, { message: "required" }),
  videoLength: z.number().min(1, { message: "required" }),
});

export const VideoForm = ({
  initialData,
  chapterId,
  courseId,
}: ChapterVideoFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      file: undefined,
    },
  });

  const { mutate: uploadVideo, isPending: isLoading } = useMutation({
    mutationFn: UPLOAD_VIDEO,
    onSuccess: (data) => {
      toggleEdit();
      form.reset();
      toast.success(data?.success, {
        id: "upload-video",
      });
    },
    onError: (error) => {
      toast.error(error.message, {
        id: "upload-video",
      });
    },
  });

  const { mutate: getCredentials, isPending } = useMutation({
    mutationFn: GET_CREDENTIALS,
    onSuccess: (data) => {
      const formData = new FormData();
      const payload = data?.payload;

      if (payload) {
        formData.append("policy", payload.policy);
        formData.append("key", payload.key);
        formData.append("x-amz-signature", payload["x-amz-signature"]);
        formData.append("x-amz-algorithm", payload["x-amz-algorithm"]);
        formData.append("x-amz-date", payload["x-amz-date"]);
        formData.append("x-amz-credential", payload["x-amz-credential"]);
        formData.append("uploadLink", payload.uploadLink);
        formData.append("success_action_status", "201");
        formData.append("success_action_redirect", "");
        formData.append("videoId", data?.videoId);
        formData.append("chapterId", chapterId);
        formData.append("courseId", courseId);
        formData.append(
          "videoLength",
          form.getValues("videoLength").toString(),
        );
        formData.append("file", form.getValues("file"));

        uploadVideo(formData);
      }
    },
    onError: (error) => {
      toast.error(error.message, {
        id: "upload-video",
      });
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    toast.loading("Video uploading", {
      id: "upload-video",
    });
    getCredentials(values.title);
  };

  return (
    <div className="mb-10 mt-6 rounded-md border bg-card p-4">
      <div className="flex items-center justify-between font-medium">
        Video
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </>
          )}
        </Button>
      </div>
      {!isEditing && initialData.videoUrl ? (
        <VideoPlayer videoId={initialData.videoUrl} />
      ) : null}
      {isEditing && (
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
                  <FormLabel>Video title</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter video title"
                      {...field}
                      disabled={isPending || isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="videoLength"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video length</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter video length"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                      disabled={isPending || isLoading}
                    />
                  </FormControl>
                  <FormDescription>In minute</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="grid w-full items-center gap-1.5">
                      <Label htmlFor="video">Video</Label>
                      <Input
                        id="video"
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            field.onChange(e.target.files[0]);
                          }
                        }}
                        disabled={isPending || isLoading}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={isPending || isLoading} type="submit">
                Upload
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
