import { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import webPush, { WebPushError } from "web-push";

import { db } from "@/lib/prisma";
import { sendNotification } from "@/services/notification.service";

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);

    const queryParams = Object.fromEntries(url.searchParams.entries());

    const data = await request.text();
    const params = new URLSearchParams(data);
    const paymentData = Object.fromEntries(params.entries());

    const baseUrl = `${url.protocol}//${url.host}`;

    if (paymentData.pay_status === "Successful") {
      if (queryParams.userId && queryParams.courseId) {
        await db.purchase.create({
          data: {
            userId: queryParams.userId,
            courseId: queryParams.courseId,
          },
        });
      }

      const admin = await db.user.findFirst({
        where: {
          role: Role.Admin,
        },
      });

      const course = await db.course.findUnique({
        where: {
          id: queryParams.courseId,
        },
      });

      const user = await db.user.findUnique({
        where: {
          id: queryParams.userId,
        },
      });

      if (admin?.id) {
        const subscribers = await db.pushSubscriber.findMany({
          where: { userId: admin.id },
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
                  title: `New Purchase`,
                  body: `${user?.name} has purchased ${course?.title}`,
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
          trigger: "purchase",
          actor: { id: user?.id || "" },
          recipients: [admin?.id || ""],
          data: {
            course: course?.title,
          },
        });
      }

      return NextResponse.redirect(
        `${baseUrl}/dashboard/payment/success?callback=/dashboard`,
        303,
      );
    } else {
      return NextResponse.redirect(`${baseUrl}/dashboard/payment/fail`, 303);
    }
  } catch (error) {
    console.log(error);
  }
}
