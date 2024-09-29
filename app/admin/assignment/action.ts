"use server";

import { SubmissionStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import webPush, { WebPushError } from "web-push";

import { db } from "@/lib/prisma";
import { IS_ADMIN } from "@/services/authorization";
import { sendNotification } from "@/services/notification.service";
import { GET_USER } from "@/services/user.service";

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
  const isAdmin = await IS_ADMIN();

  if (!isAdmin) {
    throw new Error("You are not authorized to update a submission status");
  }

  const { userId } = await GET_USER();

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

  const subscribers = await db.pushSubscriber.findMany({
    where: { userId: submission.userId },
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
            title: `Assignment Feedback`,
            body: `You have a new feedback to your assignment`,
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
    trigger: "assignment-reply",
    actor: { id: userId },
    recipients: [submission.userId],
    data: {
      redirectUrl: `/dashboard/feedback`,
    },
  });

  revalidatePath("/admin/assignment");

  return { success: "Feedback submitted" };
};
