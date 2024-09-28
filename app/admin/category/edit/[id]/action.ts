"use server";

import { revalidatePath } from "next/cache";

import { CategorySchema, CategorySchemaType } from "../../schema";
import { db } from "@/lib/prisma";

type EditCategory = {
  id: string;
  values: CategorySchemaType;
};
export const EDIT_CATEGORY = async ({ id, values }: EditCategory) => {
  const { data, success } = CategorySchema.safeParse(values);
  if (!success) {
    throw new Error("Invalid input value");
  }

  const category = await db.category.findUnique({
    where: {
      id,
    },
  });

  if (!category) {
    throw new Error("Category not found");
  }

  await db.category.update({
    where: {
      id,
    },
    data: {
      ...data,
    },
  });

  revalidatePath("/admin/category");

  return {
    success: "Category updated",
  };
};
