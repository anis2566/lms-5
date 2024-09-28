"use server";

import { db } from "@/lib/prisma";

export const CREATE_COURSE = async (title: string) => {
  const course = await db.course.findFirst({
    where: {
      title,
    },
  });

  if (course) {
    throw new Error("Course exists");
  }

  const newCourse = await db.course.create({
    data: {
      title,
    },
  });

  return {
    success: "Course created",
    id: newCourse.id,
  };
};
