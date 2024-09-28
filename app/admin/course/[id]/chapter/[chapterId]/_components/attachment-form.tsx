"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil, Trash } from "lucide-react";
import { useState } from "react";
import { Attachment } from "@prisma/client";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { UploadButton } from "@/lib/uploadthing";
import { CREATE_ATTACHMENT } from "../action";
import { useAttachment } from "@/hooks/use-attachment";

interface Props {
  attachments: Attachment[];
  chapterId: string;
}

const formSchema = z.object({
  title: z.string().min(1, { message: "required" }),
  url: z.string().min(1, { message: "required" }),
});

export const AttachmentsForm = ({ attachments, chapterId }: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  const { onOpen } = useAttachment();

  const toggleEdit = () => setIsEditing((current) => !current);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "", url: "" },
  });

  const { mutate: createAttachment, isPending } = useMutation({
    mutationFn: CREATE_ATTACHMENT,
    onSuccess: (data) => {
      form.reset();
      setIsEditing(false);
      toast.success(data?.success, {
        id: "create-attachment",
      });
    },
    onError: (error) => {
      toast.error(error.message, {
        id: "create-attachment",
      });
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    toast.loading("Attachment creating...", {
      id: "create-attachment",
    });
    createAttachment({ chapterId, ...values });
  };

  return (
    <div className="mt-6 rounded-md border bg-card p-4">
      <div className="flex items-center justify-between font-medium">
        Attachments
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
      {!isEditing && (
        <div className="mt-2 space-y-3">
          {attachments.length > 0 &&
            attachments.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-sm border-2 p-2"
              >
                <div>
                  <Link
                    href={item.url}
                    target="_blank"
                    className="hover:underline"
                  >
                    {item.title}
                  </Link>
                </div>
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="flex-shrink-0"
                        onClick={() => onOpen(item.id)}
                      >
                        <Trash className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete attachment</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            ))}
        </div>
      )}
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
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attachment</FormLabel>
                  <FormControl>
                    {form.getValues("url") ? (
                      <div className="flex items-center gap-x-3">
                        <Link
                          href={form.getValues("url")}
                          className="hover:underline"
                          target="_blank"
                        >
                          View File
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => form.setValue("url", "")}
                          type="button"
                          disabled={isPending}
                        >
                          <Trash className="text-rose-500" />
                        </Button>
                      </div>
                    ) : (
                      <UploadButton
                        endpoint="fileUploader"
                        onClientUploadComplete={(res) => {
                          field.onChange(res[0].url);
                          toast.success("File uploaded");
                        }}
                        onUploadError={(error: Error) => {
                          console.log(error);
                          toast.error("File upload failed");
                        }}
                      />
                    )}
                  </FormControl>
                  <FormDescription>Only Pdf file is allowed</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={isPending} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
