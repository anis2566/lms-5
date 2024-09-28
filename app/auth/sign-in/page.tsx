import { Metadata } from "next";

import { SignInForm } from "./_components/sign-in-form";

export const metadata: Metadata = {
  title: "App | Sign In",
  description: "Start up Project",
};

const SignIn = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center py-4">
      <SignInForm />;
    </div>
  );
};

export default SignIn;
