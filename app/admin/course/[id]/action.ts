"use server";

import { Course } from "@prisma/client";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/prisma";
import { IS_ADMIN } from "@/services/authorization";

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
  values: Partial<Course>;
};

export const UPDATE_COURSE = async ({ id, values }: UpdateCourse) => {
  if (!values || Object.keys(values).length === 0) {
    throw new Error("No values provided for update");
  }

  const isAdmin = await IS_ADMIN();

  if (!isAdmin) {
    throw new Error("You are not authorized to edit a course");
  }

  const course = await db.course.findUnique({
    where: { id },
  });

  if (!course) {
    throw new Error("Course not found");
  }

  const { id: courseId, ...updateData } = values;

  await db.course.update({
    where: { id },
    data: updateData,
  });

  revalidatePath(`/admin/course/${id}`);

  return {
    success: "Course updated successfully",
  };
};

type CreateChapter = {
  courseId: string;
  title: string;
};
export const CREATE_CHAPTER = async ({ courseId, title }: CreateChapter) => {
  const isAdmin = await IS_ADMIN();

  if (!isAdmin) {
    throw new Error("You are not authorized to create a chapter");
  }

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
  const isAdmin = await IS_ADMIN();

  if (!isAdmin) {
    throw new Error("You are not authorized to reorder a chapter");
  }

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
  const isAdmin = await IS_ADMIN();

  if (!isAdmin) {
    throw new Error("You are not authorized to publish a course");
  }

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
  const isAdmin = await IS_ADMIN();

  if (!isAdmin) {
    throw new Error("You are not authorized to unpublish a course");
  }

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
  const isAdmin = await IS_ADMIN();

  if (!isAdmin) {
    throw new Error("You are not authorized to delete a course");
  }

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
