import { z } from "zod";

export const AttachmentSchema = z.object({
  title: z.string().min(1, {
    message: "required",
  }),
  url: z.string().min(1, {
    message: "required",
  }),
  chapterId: z.string().min(1, { message: "required" }),
});

export type AttachmentSchemaType = z.infer<typeof AttachmentSchema>;

export const AssignmentSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "required"),
  description: z.string().min(1, "required"),
  dueDate: z.date().optional(),
  fileUrl: z.string().optional(),
});

export type AssignmentSchemaType = z.infer<typeof AssignmentSchema>;
