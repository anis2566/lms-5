"use server";

import { Knock } from "@knocklabs/node";

import { db } from "@/lib/prisma";
import { SignUpSchema, SignUpSchemaType } from "./schema";
import { saltAndHashPassword } from "@/lib/utils";
import { streamServerClient } from "@/lib/stream";

const knock = new Knock(process.env.NEXT_PUBLIC_KNOCK_API_KEY);

export const SIGN_UP_USER = async (values: SignUpSchemaType) => {
  const { data, success } = SignUpSchema.safeParse(values);
  if (!success) {
    throw new Error("Invalid input value");
  }

  const user = await db.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (user) {
    throw new Error("User already exists");
  }

  const hashedPassword = saltAndHashPassword(data.password);

  await db.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        ...data,
        password: hashedPassword,
      },
    });

    await knock.users.identify(user.id, {
      name: user.name ?? "Guest",
      avatar: user.image,
    });

    await streamServerClient.upsertUser({
      id: user.id,
      name: data.name,
      username: data.name,
    });
  });

  return {
    success: "Registration successful",
  };
};
