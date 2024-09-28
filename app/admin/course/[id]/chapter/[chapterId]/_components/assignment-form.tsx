"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { CalendarIcon, Eye, Pencil, Trash, Trash2 } from "lucide-react";
import { useState } from "react";
import { Assignment } from "@prisma/client";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { format } from "date-fns";

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
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import { UploadButton } from "@/lib/uploadthing";
import { AssignmentSchema } from "../schema";
import { cn } from "@/lib/utils";
import { CREATE_ASSIGNMENT } from "../action";
import { useAssignment } from "@/hooks/use-assignment";

interface Props {
  chapterId: string;
  assignment: Assignment | null;
}

export const AssignmentForm = ({ chapterId, assignment }: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = () => setIsEditing((current) => !current);
  const { onOpen } = useAssignment();

  const { mutate: createAssignment, isPending } = useMutation({
    mutationFn: CREATE_ASSIGNMENT,
    onSuccess: (data) => {
      toast.success(data.success, {
        id: "create-assignment",
      });
      toggleEdit();
    },
    onError: (error) => {
      toast.error(error.message, {
        id: "create-assignment",
      });
    },
    onSettled: () => {
      form.reset();
    },
  });

  const form = useForm<z.infer<typeof AssignmentSchema>>({
    resolver: zodResolver(AssignmentSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: undefined,
      fileUrl: undefined,
    },
  });

  const onSubmit = async (values: z.infer<typeof AssignmentSchema>) => {
    toast.loading("Assignment creating...", {
      id: "create-assignment",
    });
    createAssignment({ chapterId, values });
  };

  return (
    <div className="mt-6 rounded-md border bg-card p-4">
      <div className="flex items-center justify-between font-medium">
        Assignments
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
          {assignment && (
            <div
              className="flex items-center justify-between rounded-sm border-2 p-2"
            >
              <p>{assignment.title}</p>
              <div className="flex items-center gap-x-2">
                {assignment.fileUrl && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button asChild variant="outline" size="icon">
                          <Link href={assignment.fileUrl} target="_blank">
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View File</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => onOpen(assignment.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete Assignment</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          )}
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                          disabled={isPending}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date() || isPending}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fileUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Attachment</FormLabel>
                  <FormControl>
                    {field.value ? (
                      <div className="flex items-center gap-x-3">
                        <Link
                          href={field.value}
                          className="hover:underline"
                          target="_blank"
                        >
                          View File
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => form.setValue("fileUrl", "")}
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
                        disabled={isPending}
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
