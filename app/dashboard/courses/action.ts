"use server";

import { db } from "@/lib/prisma";

export const GET_CATEGORIES = async () => {
  const categories = await db.category.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    categories,
  };
};
