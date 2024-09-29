"use server";

import { Role } from "@prisma/client";

import { db } from "@/lib/prisma";
import { GET_USER } from "./user.service";

export const IS_ADMIN = async () => {
  const { userId } = await GET_USER();

  const user = await db.user.findUnique({
    where: {
      id: userId,
      role: Role.Admin,
    },
  });

  return user ? true : false;
};
