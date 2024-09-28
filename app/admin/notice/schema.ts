import { z } from "zod";

export const NoticeSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  content: z.string().min(1, { message: "Content is required" }),
});

export type NoticeSchemaType = z.infer<typeof NoticeSchema>;
