"use server";

import { AuthError } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect";

import { signIn } from "@/auth";
import { SignInSchemaType } from "./schema";
import { db } from "@/lib/prisma";

type SignInUser = {
  values: SignInSchemaType;
  callbackUrl: string | null;
};

export const SIGN_IN_USER = async ({ values, callbackUrl }: SignInUser) => {
  try {
    const user = await db.user.findUnique({
      where: {
        email: values.email,
      },
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    await signIn("credentials", {
      email: values.email,
      password: values.password,
        redirect: true,
        redirectTo: callbackUrl ? callbackUrl : "/",
    });

    return { success: "Login successful", user };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    if (error instanceof Error) {
      const { type, cause } = error as AuthError;

      switch (type) {
        case "CredentialsSignin":
          throw new Error("Invalid credentials");
        case "CallbackRouteError":
          throw new Error(cause?.err?.toString());
        default:
          throw new Error("Something went wrong");
      }
    }
  }
};

type GoogleSignIn = {
  callback: string | null;
};

export const SIGN_IN_WITH_GOOGLE = async ({ callback }: GoogleSignIn) => {
  await signIn("google", {
    redirectTo: callback ? callback : "/",
  });
};
