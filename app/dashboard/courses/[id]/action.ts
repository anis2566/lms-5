"use server";

import { db } from "@/lib/prisma";

export const GET_COURSE = async (id: string) => {
  const course = await db.course.findUnique({
    where: {
      id,
    },
    include: {
      chapters: true,
    },
  });

  if (!course) {
    throw new Error("Course not found");
  }

  return { course };
};
