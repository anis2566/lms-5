"use server";

import { revalidatePath } from "next/cache";
import { CategorySchema, CategorySchemaType } from "../../schema";
import { db } from "@/lib/prisma";
import { IS_ADMIN } from "@/services/authorization";

type EditCategory = {
  id: string;
  values: CategorySchemaType;
};

export const EDIT_CATEGORY = async ({ id, values }: EditCategory) => {
  const { success, data } = CategorySchema.safeParse(values);
  if (!success) {
    throw new Error(`Invalid input value`);
  }

  const isAdmin = await IS_ADMIN();

  if (!isAdmin) {
    throw new Error("You are not authorized to edit a category");
  }

  try {
    const category = await db.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new Error("Category not found");
    }

    await db.category.update({
      where: { id },
      data,
    });

    revalidatePath("/admin/category");

    return {
      success: "Category updated successfully",
    };
  } catch (error) {
    console.error("Error updating category:", error);
    throw new Error("Failed to update category");
  }
};
