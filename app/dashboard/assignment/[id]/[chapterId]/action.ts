"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/prisma";
import { AssignmentSubmissionSchema, AssignmentSubmissionType } from "./schema";
import { GET_USER } from "@/services/user.service";
import { SubmissionStatus } from "@prisma/client";

type CreateSubmission = {
  chapterId: string;
  values: AssignmentSubmissionType;
  assignmentId: string;
};

export const CREATE_ASSIGNMENT_SUBMISSION = async ({
  chapterId,
  values,
  assignmentId,
}: CreateSubmission) => {
  const { data, success } = AssignmentSubmissionSchema.safeParse(values);

  if (!success) throw new Error("Invalid input value");

  const { userId } = await GET_USER();

  const isSubmitted = await db.assignmentSubmission.findFirst({
    where: {
      chapterId,
      userId: userId,
      status: SubmissionStatus.Pending,
    },
  });

  if (isSubmitted) throw new Error("You already submitted this assignment");

  const chapter = await db.chapter.findUnique({
    where: {
      id: chapterId,
    },
  });

  if (!chapter) throw new Error("Chapter not found");

  await db.assignmentSubmission.create({
    data: {
      ...data,
      chapterId,
      userId,
      assignmentId,
    },
  });

  revalidatePath(`/dashboard/assignment/${chapter.courseId}/${chapterId}`);

  return {
    success: "Assignment submitted successfully",
  };
};
