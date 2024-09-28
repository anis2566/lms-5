"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Newslettr = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Implement newsletter subscription logic here
    console.log("Subscribing email:", email);
    setIsSubmitted(true);
  };

  return (
    <section className="my-8 rounded-lg bg-background py-16 shadow-lg dark:shadow-sm dark:shadow-primary">
      <div className="container mx-auto px-4">
        <h2 className="mb-6 text-center text-3xl font-bold">
          Stay Updated with Our Newsletter
        </h2>
        <p className="mb-8 text-center text-gray-600">
          Get the latest updates, course announcements, and exclusive offers
          directly in your inbox.
        </p>
        {!isSubmitted ? (
          <form
            onSubmit={handleSubmit}
            className="mx-auto flex max-w-md flex-col gap-4 sm:flex-row"
          >
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-grow"
            />
            <Button type="submit" className="w-full sm:w-auto">
              Subscribe
            </Button>
          </form>
        ) : (
          <div className="text-center font-semibold text-green-600">
            Thank you for subscribing! Check your email for confirmation.
          </div>
        )}
      </div>
    </section>
  );
};
