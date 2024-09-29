"use server";

import { db } from "@/lib/prisma";
import { IS_ADMIN } from "@/services/authorization";

export const CREATE_COURSE = async (title: string) => {
  const isAdmin = await IS_ADMIN();

  if (!isAdmin) {
    throw new Error("You are not authorized to create a course");
  }

  try {
    const existingCourse = await db.course.findFirst({
      where: { title },
    });

    if (existingCourse) {
      throw new Error("Course with this title already exists");
    }

    const newCourse = await db.course.create({
      data: { title },
    });

    return {
      success: "Course created successfully",
      id: newCourse.id,
    };
  } catch (error) {
    console.error("Error creating course:", error);
    throw new Error("Failed to create course");
  }
};
