"use server";

import { db } from "@/lib/prisma";
import { GET_USER } from "@/services/user.service";

type CreateReview = {
  rating: number;
  content: string;
  courseId: string;
};

export const CREATE_REVIEW = async (review: CreateReview) => {
  const { rating, content, courseId } = review;

  const { userId } = await GET_USER();

  const isPurchased = await db.purchase.findFirst({
    where: {
      userId,
      courseId,
    },
  });

  if (!isPurchased) throw new Error("You have not purchased this course");

  const isReviewed = await db.review.findFirst({
    where: {
      userId,
      courseId,
    },
  });

  if (isReviewed) throw new Error("You have already reviewed this course");

  await db.review.create({
    data: {
      rating,
      content,
      userId,
      courseId,
    },
  });

  const course = await db.course.findUnique({
    where: {
      id: courseId,
    },
  });

  if (!course) throw new Error("Course not found");

  const totalReviews = await db.review.count({
    where: {
      courseId,
    },
  });

  const averageRating = await db.review.aggregate({
    _avg: {
      rating: true,
    },
  });

  const avgRating = averageRating._avg.rating ?? 0;
  const newRating = (avgRating * totalReviews + rating) / (totalReviews + 1);

  await db.course.update({
    where: {
      id: courseId,
    },
    data: {
      rating: newRating,
    },
  });

  return {
    success: "Review created submitted,",
  };
};
