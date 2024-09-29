"use server";

import { revalidatePath } from "next/cache";

import { CategorySchema, CategorySchemaType } from "../schema";
import { db } from "@/lib/prisma";
import { IS_ADMIN } from "@/services/authorization";

export const CREATE_CATEGORY = async (values: CategorySchemaType) => {
  const { success, data } = CategorySchema.safeParse(values);

  if (!success) {
    throw new Error(`Invalid input value"}`);
  }

  const isAdmin = await IS_ADMIN();

  if (!isAdmin) {
    throw new Error("You are not authorized to create a category");
  }

  try {
    const existingCategory = await db.category.findFirst({
      where: { name: data.name },
    });

    if (existingCategory) {
      throw new Error("Category already exists");
    }

    await db.category.create({
      data,
    });

    revalidatePath("/admin/category");

    return {
      success: "Category created successfully",
    };
  } catch (error) {
    console.error("Error creating category:", error);
    throw new Error("Failed to create category");
  }
};
