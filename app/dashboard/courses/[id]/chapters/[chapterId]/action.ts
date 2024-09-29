"use server";

import { revalidatePath } from "next/cache";
import webPush, { WebPushError } from "web-push";
import { SubmissionStatus } from "@prisma/client";

import { db } from "@/lib/prisma";
import { GET_ADMIN, GET_USER } from "@/services/user.service";
import { getQuestionDataInclude } from "@/lib/types";
import { sendNotification } from "@/services/notification.service";

type GetChapter = {
  courseId: string;
  chapterId: string;
};
export const GET_CHAPTER = async ({ chapterId, courseId }: GetChapter) => {
  const { userId } = await GET_USER();

  try {
    const purchased = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    const course = await db.course.findUnique({
      where: {
        id: courseId,
        isPublished: true,
      },
      include: {
        chapters: {
          select: {
            id: true,
            position: true,
            isFree: true,
          },
          orderBy: {
            position: "asc",
          },
        },
      },
    });

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        isPublished: true,
      },
      include: {
        attachments: true,
        questions: true,
        assignments: true,
        submissions: {
          where: {
            userId,
          },
        },
      },
    });

    if (!chapter || !course) {
      throw new Error("Chapter or course not found");
    }

    let previousChapter = null;
    let previousChapterDetails = null;

    if (chapter.position !== null) {
      const pre = await db.chapter.findFirst({
        where: {
          courseId,
          isPublished: true,
          position: chapter.position - 1,
        },
        include: {
          assignments: true,
          submissions: true,
        },
      });
      if (pre) {
        previousChapter = pre.id;
        previousChapterDetails = pre;
      }
    }

    let nextChapter = null;
    if (chapter.position !== null) {
      const nex = await db.chapter.findFirst({
        where: {
          courseId,
          isPublished: true,
          position: chapter.position + 1,
        },
      });

      if (nex) {
        nextChapter = nex.id;
      }
    }

    let isLocked = false;
    let isPreviousChapterCompleted = false;

    if (!chapter.isFree && !purchased) {
      isLocked = true;
    }

    if (previousChapterDetails) {
      if (previousChapterDetails.assignments) {
        if (
          previousChapterDetails.submissions.some(
            (item) => item.status === SubmissionStatus.Accepted,
          )
        ) {
          isPreviousChapterCompleted = true;
        } else {
          isPreviousChapterCompleted = false;
        }
      } else {
        isPreviousChapterCompleted = true;
      }
    } else {
      isPreviousChapterCompleted = true;
    }

    const userProgress = await db.userProgress.findUnique({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
    });

    const {id} = await GET_ADMIN()

    return {
      chapter,
      course,
      previousChapter,
      nextChapter,
      userProgress,
      purchased: !!purchased,
      attachments: chapter.attachments || [],
      questions: chapter.questions || [],
      isLocked,
      isPreviousChapterCompleted,
      adminId: id
    };
  } catch (error) {
    return {
      chapter: null,
      course: null,
      nextChapter: null,
      userProgress: null,
      purchase: null,
      attachments: [],
      questions: [],
      isLocked: true,
      isPreviousChapterCompleted: false,
      adminId: null
    };
  }
};

type CreateQuestion = {
  chapterId: string;
  question: string;
};

export const CREATE_QUESTION = async ({
  chapterId,
  question,
}: CreateQuestion) => {
  const { userId, user } = await GET_USER();

  const newQuestion = await db.question.create({
    data: {
      question,
      chapterId,
      userId,
    },
    include: getQuestionDataInclude(),
  });

  const { id } = await GET_ADMIN();

  const subscribers = await db.pushSubscriber.findMany({
    where: { userId: id },
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
            title: `New Question`,
            body: `${user?.name} has asked a question`,
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
    trigger: "question",
    actor: { id: userId },
    recipients: [id],
    data: {
      redirectUrl: "/admin/question",
    },
  });

  return newQuestion;
};

type ToggleProgress = {
  courseId: string;
  chapterId: string;
};
export const MARK_COMPLETE = async ({
  chapterId,
  courseId,
}: ToggleProgress) => {
  const chapter = await db.chapter.findUnique({
    where: {
      courseId,
      id: chapterId,
      isPublished: true,
    },
  });

  if (!chapter) {
    throw new Error("Chapter not found");
  }

  const { userId } = await GET_USER();

  await db.userProgress.upsert({
    where: {
      userId_chapterId: {
        userId,
        chapterId,
      },
    },
    create: {
      userId,
      chapterId,
      isCompleted: true,
    },
    update: {
      isCompleted: true,
    },
  });

  revalidatePath(
    `/dashboard/courses/${chapter.courseId}/chapters/${chapter.id}`,
  );

  return {
    success: "Chapter completed",
  };
};

export const MARK_INCOMPLETE = async ({
  chapterId,
  courseId,
}: ToggleProgress) => {
  const chapter = await db.chapter.findUnique({
    where: {
      courseId,
      id: chapterId,
      isPublished: true,
    },
  });

  if (!chapter) {
    throw new Error("Chapter not found");
  }

  const { userId } = await GET_USER();

  await db.userProgress.update({
    where: {
      userId_chapterId: {
        userId,
        chapterId,
      },
    },
    data: {
      isCompleted: false,
    },
  });

  revalidatePath(
    `/dashboard/courses/${chapter.courseId}/chapters/${chapter.id}`,
  );

  return {
    success: "Chapter incompleted",
  };
};

export const GET_PROGRESS = async (
  userId: string,
  courseId: string,
): Promise<number> => {
  try {
    const publishedChapters = await db.chapter.findMany({
      where: {
        courseId: courseId,
        isPublished: true,
      },
      select: {
        id: true,
      },
    });

    const publishedChapterIds = publishedChapters.map((chapter) => chapter.id);

    const validCompletedChapters = await db.userProgress.count({
      where: {
        userId: userId,
        chapterId: {
          in: publishedChapterIds,
        },
        isCompleted: true,
      },
    });

    const progressPercentage =
      (validCompletedChapters / publishedChapterIds.length) * 100;

    return progressPercentage;
  } catch (error) {
    console.log("[GET_PROGRESS]", error);
    return 0;
  }
};
