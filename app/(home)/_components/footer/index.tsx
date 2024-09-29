import React from "react";
import { BookOpen } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { Logo } from "@/components/logo";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer id="footer" className="container py-24 sm:py-32">
      <div className="rounded-2xl border bg-muted/50 p-10 dark:bg-card">
        <div className="grid grid-cols-2 gap-x-12 gap-y-8 md:grid-cols-5">
          <div className="col-span-full xl:col-span-2">
            <a href="#" className="flex items-center font-bold">
              <Logo callbackUrl="/" />
            </a>
          </div>

          {/* Courses section */}
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold">Courses</h3>
            <Link href="/dashboard/courses" className="opacity-60 hover:opacity-100">
              All Courses
            </Link>
            <Link href="/dashboard/my-courses" className="opacity-60 hover:opacity-100">
              My Courses
            </Link>
          </div>

          {/* For Students section */}
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold">For Students</h3>
            <Link href="/dashboard" className="opacity-60 hover:opacity-100">
              Dashboard
            </Link>
            <Link href="/dashboard/assignments" className="opacity-60 hover:opacity-100">
              Assignments
            </Link>
          </div>

          {/* Support section */}
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold">Support</h3>
            <Link href="/dashboard/chat" className="opacity-60 hover:opacity-100">
              Chat
            </Link>
            <Link href="/contact" className="opacity-60 hover:opacity-100">
              Contact Us
            </Link>
          </div>
        </div>

        <Separator className="my-6" />
        <section className="">
          <h3 className="">&copy; 2024 E-Learn. All rights reserved.</h3>
        </section>
      </div>
    </footer>
  );
};
