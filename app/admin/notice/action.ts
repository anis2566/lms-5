"use server";

import { revalidatePath } from "next/cache";
import webPush, { WebPushError } from "web-push";

import { db } from "@/lib/prisma";
import { NoticeSchema, NoticeSchemaType } from "./schema";
import { IS_ADMIN } from "@/services/authorization";
import { sendNotification } from "@/services/notification.service";
import { GET_USER } from "@/services/user.service";

export const CREATE_NOTICE = async (values: NoticeSchemaType) => {
  const { data, success } = NoticeSchema.safeParse(values);

  if (!success) throw new Error("Invalid input values");

  const isAdmin = await IS_ADMIN();

  if (!isAdmin) {
    throw new Error("You are not authorized to create a notice");
  }

  const { userId } = await GET_USER();

  await db.notice.create({
    data: {
      ...data,
    },
  });

  const subscribers = await db.pushSubscriber.findMany();

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
            title: `New Notice`,
            body: `You have a new notice.`,
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
    trigger: "notice",
    actor: { id: userId },
    recipients: subscribers.map((item) => item.userId),
    data: {
      course: "You have a new notice.",
    },
  });

  revalidatePath("/admin/notice");

  return {
    success: "Notice created successfully",
  };
};

export const DELETE_NOTICE = async (id: string) => {
  const isAdmin = await IS_ADMIN();

  if (!isAdmin) {
    throw new Error("You are not authorized to delete a notice");
  }

  const notice = await db.notice.findUnique({
    where: {
      id,
    },
  });

  if (!notice) throw new Error("Notice not found");

  await db.notice.delete({
    where: {
      id,
    },
  });

  revalidatePath("/admin/notice");

  return {
    success: "Notice deleted successfully",
  };
};
