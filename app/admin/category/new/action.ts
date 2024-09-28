"use server";

import { revalidatePath } from "next/cache";

import { CategorySchema, CategorySchemaType } from "../schema";
import { db } from "@/lib/prisma";

export const CREATE_CATEGORY = async (values: CategorySchemaType) => {
  const { data, success } = CategorySchema.safeParse(values);

  if (!success) {
    throw new Error("Invalid input value");
  }

  const category = await db.category.findFirst({
    where: {
      name: data.name,
    },
  });

  if (category) {
    throw new Error("Category already exists");
  }

  await db.category.create({
    data: {
      ...data,
    },
  });

  revalidatePath("/admin/category");

  return {
    success: "Category created",
  };
};
