"use client";

import { z } from "zod";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { UploadButton } from "@/lib/uploadthing";
import { CREATE_ASSIGNMENT_SUBMISSION } from "../action";
import { AssignmentSubmissionSchema } from "../schema";
import { useAssignmentSubmission } from "@/hooks/use-assignment-submission";

export const SubmissionModal = () => {
  const { open, onClose, assignmentId, chapterId } = useAssignmentSubmission();

  const { mutate: submitAssignment, isPending } = useMutation({
    mutationFn: CREATE_ASSIGNMENT_SUBMISSION, 
    onSuccess: () => {
      toast.success("Assignment submitted successfully", {
        id: "submission-toast",
      });
      onClose();
    },
    onError: (error) => {
      toast.error(error.message, {
        id: "submission-toast",
      });
    }, 
  });

  const form = useForm<z.infer<typeof AssignmentSubmissionSchema>>({
    resolver: zodResolver(AssignmentSubmissionSchema),
    defaultValues: {
      content: "",
      fileUrl: "",
    },
  });

  function onSubmit(values: z.infer<typeof AssignmentSubmissionSchema>) {
    toast.loading("Submitting assignment...", {
      id: "submission-toast",
    });
    submitAssignment({ chapterId, values, assignmentId });
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submission</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Answer</FormLabel>
                  <FormControl>
                    <Textarea {...field} rows={5} disabled={isPending} />
                  </FormControl>
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
                    {form.getValues("fileUrl") ? (
                      <div className="flex items-center gap-x-3">
                        <p>File</p>
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

            <Button type="submit" disabled={isPending}>
              Submit
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
