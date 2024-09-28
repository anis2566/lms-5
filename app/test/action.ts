"use server";

import { db } from "@/lib/prisma";
import webPush, { WebPushError } from "web-push";

export const SEND_NOTIFICATION = async () => {
  const subscriptions = await db.pushSubscriber.findMany({
    where: {
      userId: "cm14t6jja0000d5i5u7xujxjb",
    },
  });

  if (subscriptions.length > 0) {
    for (const item of subscriptions) {
      await webPush
        .sendNotification(
          {
            endpoint: item.endpoint,
            keys: {
              auth: item.auth,
              p256dh: item.p256dh,
            },
          },
          JSON.stringify({
            title: "New Notification",
            body: "This is new Notification",
          }),
          {
            vapidDetails: {
              subject: "mailto:anis@flowchat.com",
              publicKey: process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY!,
              privateKey: process.env.WEB_PUSH_PRIVATE_KEY!,
            },
          },
        )
        .catch((error) => {
          console.error("Error sending push notification: ", error);
          if (error instanceof WebPushError && error.statusCode === 410) {
            console.log("Push subscription expired, deleting...");
          }
        });
    }
  }
  return;
};
