"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/prisma";

export const DELETE_CATEGORY = async (id: string) => {
  const category = await db.category.findUnique({
    where: {
      id,
    },
  });
  if (!category) {
    throw new Error("Category not found");
  }

  await db.category.delete({
    where: {
      id,
    },
  });

  revalidatePath("/admin/category");

  return {
    success: "Category deleted",
  };
};
