import { z } from "zod";

export const QuestionSchema = z.object({
  question: z.string().min(1),
});

export type QuestionSchemaType = z.infer<typeof QuestionSchema>;
