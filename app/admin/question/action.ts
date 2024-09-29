"use server";

import { revalidatePath } from "next/cache";
import webPush, { WebPushError } from "web-push";

import { db } from "@/lib/prisma";
import { IS_ADMIN } from "@/services/authorization";
import { GET_USER } from "@/services/user.service";
import { sendNotification } from "@/services/notification.service";

type CreateAnswer = {
  answer: string;
  id: string;
};

export const CREATE_ANSWER = async ({ id, answer }: CreateAnswer) => {
  const question = await db.question.findUnique({
    where: {
      id,
    },
    include: {
      chapter: {
        select: {
          courseId: true,
        },
      },
    },
  });

  if (!question) throw new Error("Question not found");

  const { userId } = await GET_USER();

  await db.questionAnswer.create({
    data: {
      questionId: id,
      answer,
      userId,
    },
  });

  const subscribers = await db.pushSubscriber.findMany({
    where: { userId: question.userId },
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
            title: `Question Answer`,
            body: `You have a new answer to your question`,
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
    trigger: "question-reply",
    actor: { id: userId },
    recipients: [question.userId],
    data: {
      redirectUrl: `/dashboard/courses/${question.chapter.courseId}/chapters/${question.chapterId}`,
    },
  });

  revalidatePath("/admin/question");

  return {
    success: "Answer created successfully",
  };
};

export const DELETE_QUESTION = async (id: string) => {
  const isAdmin = await IS_ADMIN();

  if (!isAdmin) {
    throw new Error("You are not authorized to delete a question");
  }

  const question = await db.question.findUnique({
    where: {
      id,
    },
  });

  if (!question) throw new Error("Question not found");

  await db.question.delete({
    where: {
      id,
    },
  });

  revalidatePath("/admin/question");

  return {
    success: "Question deleted successfully",
  };
};
