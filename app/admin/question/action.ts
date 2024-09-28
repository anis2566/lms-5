"use server";

import { db } from "@/lib/prisma";
import { GET_USER } from "@/services/user.service";
import { revalidatePath } from "next/cache";

type CreateAnswer = {
  answer: string;
  id: string;
};

export const CREATE_ANSWER = async ({ id, answer }: CreateAnswer) => {
  const question = await db.question.findUnique({
    where: {
      id,
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

  revalidatePath("/admin/question");

  return {
    success: "Answer created successfully",
  };
};
