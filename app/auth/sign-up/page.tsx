import { Metadata } from "next";

import { SignUpForm } from "./_components/sign-up-form";

export const metadata: Metadata = {
  title: "App | Sign Up",
  description: "Start up Project",
};

const SignUp = () => {
  return (
    <div className="flex min-h-screen w-full items-center justify-center py-4">
      <SignUpForm />;
    </div>
  );
};

export default SignUp;
