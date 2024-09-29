"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/prisma";
import { IS_ADMIN } from "@/services/authorization";

export const DELETE_CATEGORY = async (id: string) => {
  const isAdmin = await IS_ADMIN();

  if (!isAdmin) {
    throw new Error("You are not authorized to delete a category");
  }

  try {
    const category = await db.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new Error("Category not found");
    }

    await db.category.delete({
      where: { id },
    });

    revalidatePath("/admin/category");

    return {
      success: "Category deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting category:", error);
    throw new Error("Failed to delete category");
  }
};
