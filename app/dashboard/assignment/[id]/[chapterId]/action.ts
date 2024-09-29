"use server";

import { revalidatePath } from "next/cache";
import webPush, { WebPushError } from "web-push";

import { db } from "@/lib/prisma";
import { AssignmentSubmissionSchema, AssignmentSubmissionType } from "./schema";
import { GET_ADMIN, GET_USER } from "@/services/user.service";
import { SubmissionStatus } from "@prisma/client";
import { sendNotification } from "@/services/notification.service";

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

  const { userId, user } = await GET_USER();

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

  const { id: adminId } = await GET_ADMIN();

  const subscribers = await db.pushSubscriber.findMany({
    where: { userId: adminId },
  });

  if (subscribers.length > 0) {
    const pushPromises = subscribers.map(async (item) => {
      try {
        await webPush.sendNotification(
          {
            endpoint: item.endpoint,
            keys: {
              auth: item.auth,
              p256dh: item.p256dh,
            },
          },
          JSON.stringify({
            title: `New Assignment Submission`,
            body: `${user?.name} has submitted an assignment`,
          }),
          {
            vapidDetails: {
              subject: "mailto:anis@flowchat.com",
              publicKey: process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY!,
              privateKey: process.env.WEB_PUSH_PRIVATE_KEY!,
            },
          },
        );
      } catch (error) {
        console.error("Error sending push notification:", error);

        if (error instanceof WebPushError && error.statusCode === 410) {
          console.log("Push subscription expired, deleting...");
          await db.pushSubscriber.delete({
            where: { id: item.id },
          });
        }
      }
    });

    await Promise.all(pushPromises);
  }
  await sendNotification({
    trigger: "assignment",
    actor: { id: userId },
    recipients: [adminId],
    data: {
      redirectUrl: "/admin/assignment",
    },
  });

  revalidatePath(`/dashboard/assignment/${chapter.courseId}/${chapterId}`);

  return {
    success: "Assignment submitted successfully",
  };
};
