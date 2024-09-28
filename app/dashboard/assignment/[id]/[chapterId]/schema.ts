import { z } from "zod";

export const AssignmentSubmissionSchema = z.object({
  content: z.string().min(1),
  fileUrl: z.string().optional(),
});

export type AssignmentSubmissionType = z.infer<
  typeof AssignmentSubmissionSchema
>;
