"use server";

import { db } from "@/lib/prisma";
import { Course } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const GET_CATEGORIES = async () => {
  const categories = await db.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    categories,
  };
};

type UpdateCourse = {
  id: string;
  values: Course;
};

export const UPDATE_COURSE = async ({ id, values }: UpdateCourse) => {
  const course = await db.course.findUnique({
    where: {
      id,
    },
  });

  if (!course) {
    throw new Error("Course not found");
  }

  const { id: courseId, ...rest } = values;

  await db.course.update({
    where: {
      id,
    },
    data: {
      ...rest,
    },
  });

  revalidatePath(`/admin/course/${id}`);

  return {
    success: "Course updated",
  };
};

type CreateChapter = {
  courseId: string;
  title: string;
};
export const CREATE_CHAPTER = async ({ courseId, title }: CreateChapter) => {
  const chapter = await db.chapter.findFirst({
    where: {
      title,
      courseId,
    },
  });

  if (chapter) {
    throw new Error("Chapter exists");
  }

  const lastChapter = await db.chapter.findFirst({
    where: {
      courseId,
    },
    orderBy: {
      position: "desc",
    },
  });

  await db.chapter.create({
    data: {
      title,
      courseId,
      position: lastChapter
        ? lastChapter.position !== null
          ? lastChapter.position + 1
          : 1
        : 1,
    },
  });

  revalidatePath(`/admin/course/${courseId}`);

  return {
    success: "Chapter created",
  };
};

interface ReorderChapter {
  list: { id: string; position: number }[];
}

export const REORDER_CHAPTER = async ({ list }: ReorderChapter) => {
  const transaction = list.map((item) => {
    return db.chapter.update({
      where: { id: item.id },
      data: { position: item.position },
    });
  });

  try {
    await db.$transaction(transaction);
    return {
      success: "Chapters reordered",
    };
  } catch (error) {
    return {
      error: "Failed to reorder chapters",
    };
  }
};

export const PUBLISH_COURSE = async (id: string) => {
  const course = await db.course.findUnique({
    where: {
      id,
    },
  });

  if (!course) {
    throw new Error("Course not found");
  }

  await db.course.update({
    where: {
      id,
    },
    data: {
      isPublished: true,
    },
  });

  revalidatePath(`/admin/course/${id}`);

  return {
    success: "Course published",
  };
};

export const UNPUBLISH_COURSE = async (id: string) => {
  const course = await db.course.findUnique({
    where: {
      id,
    },
  });

  if (!course) {
    throw new Error("Course not found");
  }

  await db.course.update({
    where: {
      id,
    },
    data: {
      isPublished: false,
    },
  });

  revalidatePath(`/admin/course/${id}`);

  return {
    success: "Course unpublished",
  };
};

export const DELETE_COURSE = async (id: string) => {
  const course = await db.course.findUnique({
    where: {
      id,
    },
  });

  if (!course) {
    throw new Error("Course not found");
  }

  await db.course.delete({
    where: {
      id,
    },
  });

  revalidatePath("/admin/course");

  return {
    success: "Course deleted",
  };
};
