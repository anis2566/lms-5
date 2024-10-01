"use server";

import { Chapter } from "@prisma/client";
import { revalidatePath } from "next/cache";
import axios from "axios";

import { db } from "@/lib/prisma";
import {
  AssignmentSchema,
  AssignmentSchemaType,
  AttachmentSchema,
  AttachmentSchemaType,
} from "./schema";
import { IS_ADMIN } from "@/services/authorization";

type UpdateChapter = {
  id: string;
  courseId: string;
  values: Chapter;
};

export const UPDATE_CHAPTER = async ({
  id,
  values,
  courseId,
}: UpdateChapter) => {
  const isAdmin = await IS_ADMIN();

  if (!isAdmin) {
    throw new Error("You are not authorized to edit a chapter");
  }

  const chapter = await db.chapter.findUnique({
    where: {
      id,
      courseId,
    },
  });

  if (!chapter) {
    throw new Error("Chapter not found");
  }

  const { id: chapterId, courseId: _, ...rest } = values;

  await db.chapter.update({
    where: {
      id,
      courseId,
    },
    data: {
      ...rest,
    },
  });

  revalidatePath(`/admin/course/${courseId}/chapter/${id}`);

  return {
    success: "Chapter updated",
  };
};

export const CREATE_ATTACHMENT = async (values: AttachmentSchemaType) => {
  const { data, success } = AttachmentSchema.safeParse(values);
  if (!success) {
    throw new Error("Invalid input value");
  }

  const isAdmin = await IS_ADMIN();

  if (!isAdmin) {
    throw new Error("You are not authorized to create an attachment");
  }

  const chapter = await db.chapter.findUnique({
    where: {
      id: data.chapterId,
    },
  });
  if (!chapter) {
    throw new Error("Chapter not found");
  }

  await db.attachment.create({
    data: { ...data },
  });

  revalidatePath(`/admin/course/${chapter.courseId}/chapter/${data.chapterId}`);

  return { success: "Attachment created" };
};

export const DELETE_ATTACHMENT = async (id: string) => {
  const isAdmin = await IS_ADMIN();

  if (!isAdmin) {
    throw new Error("You are not authorized to delete an attachment");
  }

  const attachment = await db.attachment
    .findUniqueOrThrow({
      where: { id },
      include: { chapter: true },
    })
    .catch(() => {
      throw new Error("Attachment not found");
    });

  await db.attachment.delete({
    where: { id },
  });

  revalidatePath(
    `/admin/course/${attachment.chapter.courseId}/chapter/${attachment.chapterId}`,
  );

  return { success: "Attachment deleted" };
};

export const GET_CREDENTIALS = async (title: string) => {
  const isAdmin = await IS_ADMIN();

  if (!isAdmin) {
    throw new Error("You are not authorized to get credentials");
  }

  const res = await fetch(
    `https://dev.vdocipher.com/api/videos?title=${title}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Apisecret ${process.env.VIDEO_CIPHER_API_KEY}`,
      },
    },
  );

  if (!res.ok) {
    const errorText = await res.text(); // Log the error response
    console.error(`Error fetching credentials: ${errorText}`);
    throw new Error(`Fail to obtain credentials`);
  }

  const data = await res.json();

  return {
    payload: data?.clientPayload,
    videoId: data?.videoId,
  };
};

export const UPLOAD_VIDEO = async (formData: FormData) => {
  const isAdmin = await IS_ADMIN();

  if (!isAdmin) {
    throw new Error("You are not authorized to upload a video");
  }

  const uploadLink = formData.get("uploadLink") as string;
  const videoId = formData.get("videoId") as string;
  const chapterId = formData.get("chapterId") as string;
  const courseId = formData.get("courseId") as string;
  const videoLength = formData.get("videoLength") as string;

  formData.delete("uploadLink");
  formData.delete("videoId");
  formData.delete("chapterId");
  formData.delete("courseId");
  formData.delete("videoLength");
  try {
    const uploadRes = await axios.post(uploadLink, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (uploadRes.status === 201) {
      const res = await fetch(
        `https://dev.vdocipher.com/api/videos/${videoId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Apisecret ${process.env.VIDEO_CIPHER_API_KEY}`,
          },
        },
      );

      await db.chapter.update({
        where: {
          id: chapterId,
        },
        data: {
          videoUrl: videoId,
          videoLength: parseInt(videoLength, 10),
        },
      });
    }

    revalidatePath(`/admin/course/${courseId}/chapters/${chapterId}`);

    return {
      success: "Video uploaded",
    };
  } catch (error) {
    console.error(`Failed to upload video: ${error}`); // Log the error message
    throw new Error("Failed to upload video");
  }
};

export const PUBLISH_CHAPTER = async (id: string) => {
  const isAdmin = await IS_ADMIN();

  if (!isAdmin) {
    throw new Error("You are not authorized to publish a chapter");
  }

  const chapter = await db.chapter.findUnique({
    where: {
      id,
    },
  });

  if (!chapter) {
    throw new Error("Chapter not found");
  }

  await db.chapter.update({
    where: {
      id,
    },
    data: {
      isPublished: true,
    },
  });

  revalidatePath(`/admin/course/${chapter.courseId}/chapter/${id}`);

  return {
    success: "Chapter published",
  };
};

export const UNPUBLISH_CHAPTER = async (id: string) => {
  const isAdmin = await IS_ADMIN();

  if (!isAdmin) {
    throw new Error("You are not authorized to unpublish a chapter");
  }

  const chapter = await db.chapter.findUnique({
    where: {
      id,
    },
  });

  if (!chapter) {
    throw new Error("Chapter not found");
  }

  await db.chapter.update({
    where: {
      id,
    },
    data: {
      isPublished: false,
    },
  });

  revalidatePath(`/admin/course/${chapter.courseId}/chapter/${id}`);

  return {
    success: "Chapter published",
  };
};

export const DELETE_CHAPTER = async (id: string) => {
  const isAdmin = await IS_ADMIN();

  if (!isAdmin) {
    throw new Error("You are not authorized to delete a chapter");
  }

  const chapter = await db.chapter.findUnique({
    where: {
      id,
    },
  });

  if (!chapter) {
    throw new Error("Chapter not found");
  }

  await db.chapter.delete({
    where: {
      id,
    },
  });

  revalidatePath(`/admin/course/${chapter.courseId}`);

  return {
    success: "Chapter deleted",
  };
};

type CreateAssignment = {
  chapterId: string;
  values: AssignmentSchemaType;
};

export const CREATE_ASSIGNMENT = async ({
  chapterId,
  values,
}: CreateAssignment) => {
  const { data, success } = AssignmentSchema.safeParse(values);

  if (!success) {
    throw new Error("Invalid input value");
  }

  const isAdmin = await IS_ADMIN();

  if (!isAdmin) {
    throw new Error("You are not authorized to create an assignment");
  }

  const chapter = await db.chapter.findUnique({
    where: {
      id: chapterId,
    },
  });

  if (!chapter) {
    throw new Error("Chapter not found");
  }

  const assignment = await db.assignment.findFirst({
    where: {
      chapterId,
    },
  });

  if (assignment) {
    throw new Error("Assignment already exists");
  }

  await db.assignment.create({
    data: {
      ...data,
      chapterId,
    },
  });

  revalidatePath(`/admin/course/${chapter.courseId}/chapter/${chapterId}`);

  return {
    success: "Assignment created",
  };
};

export const DELETE_ASSIGNMENT = async (id: string) => {
  const isAdmin = await IS_ADMIN();

  if (!isAdmin) {
    throw new Error("You are not authorized to delete an assignment");
  }

  const assignment = await db.assignment.findUnique({
    where: { id },
    include: { chapter: true },
  });

  if (!assignment) {
    throw new Error("Assignment not found");
  }

  const {
    chapter: { courseId },
    chapterId,
  } = assignment;

  await db.assignment.delete({ where: { id } });

  revalidatePath(`/admin/course/${courseId}/chapter/${chapterId}`);

  return { success: "Assignment deleted successfully" };
};
