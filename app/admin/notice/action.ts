"use server";

import { revalidatePath } from "next/cache";

import { db } from "@/lib/prisma";
import { NoticeSchema, NoticeSchemaType } from "./schema";

export const CREATE_NOTICE = async (values: NoticeSchemaType) => {
  const { data, success } = NoticeSchema.safeParse(values);

  if (!success) throw new Error("Invalid input values");

  await db.notice.create({
    data: {
      ...data,
    },
  });

  revalidatePath("/admin/notice");

  return {
    success: "Notice created successfully",
  };
};

export const DELETE_NOTICE = async (id: string) => {
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
