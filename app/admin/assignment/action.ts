"use server";

import { db } from "@/lib/prisma";
import { SubmissionStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

type UpdateSubmissionStatus = {
  id: string;
  status: SubmissionStatus;
  feedback: string;
};

export const UPDATE_STATUS = async ({
  id,
  status,
  feedback,
}: UpdateSubmissionStatus) => {
  const submission = await db.assignmentSubmission.findUnique({
    where: { id },
  });

  if (!submission) {
    return { error: "Submission not found" };
  }

  await db.assignmentSubmission.update({
    where: { id },
    data: { status, feedback },
  });

  revalidatePath("/admin/assignment");

  return { success: "Feedback submitted" };
};
