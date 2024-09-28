import { z } from "zod";

export const CategorySchema = z.object({
  name: z.string().min(1, {
    message: "required",
  }),
  description: z.string().optional(),
  imageUrl: z.string().min(1, {
    message: "required",
  }),
  tags: z.array(z.string().min(1)).nonempty("required"),
});

export type CategorySchemaType = z.infer<typeof CategorySchema>;
