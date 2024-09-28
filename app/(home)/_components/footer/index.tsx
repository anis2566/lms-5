import React from "react";
import { BookOpen } from "lucide-react";

import { Separator } from "@/components/ui/separator";

export const Footer = () => {
  return (
    <footer id="footer" className="container py-24 sm:py-32">
      <div className="rounded-2xl border bg-muted/50 p-10 dark:bg-card">
        <div className="grid grid-cols-2 gap-x-12 gap-y-8 md:grid-cols-4 xl:grid-cols-6">
          <div className="col-span-full xl:col-span-2">
            <a href="#" className="flex items-center font-bold">
              <BookOpen className="mr-2 h-9 w-9 rounded-lg border bg-gradient-to-tr from-primary via-primary/70 to-primary text-white" />

              <h3 className="text-2xl">EduLMS</h3>
            </a>
          </div>

          {/* Courses section */}
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold">Courses</h3>
            {["All Courses", "Featured", "Categories"].map((item) => (
              <div key={item}>
                <a href="#" className="opacity-60 hover:opacity-100">
                  {item}
                </a>
              </div>
            ))}
          </div>

          {/* For Students section */}
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold">For Students</h3>
            {["My Dashboard", "Assignments", "Progress Tracker"].map((item) => (
              <div key={item}>
                <a href="#" className="opacity-60 hover:opacity-100">
                  {item}
                </a>
              </div>
            ))}
          </div>

          {/* For Instructors section */}
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold">For Instructors</h3>
            {["Create Course", "Instructor Dashboard", "Resources"].map(
              (item) => (
                <div key={item}>
                  <a href="#" className="opacity-60 hover:opacity-100">
                    {item}
                  </a>
                </div>
              ),
            )}
          </div>

          {/* Support section */}
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold">Support</h3>
            {["Help Center", "Contact Us", "Privacy Policy"].map((item) => (
              <div key={item}>
                <a href="#" className="opacity-60 hover:opacity-100">
                  {item}
                </a>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-6" />
        <section className="">
          <h3 className="">&copy; 2024 EduLMS. All rights reserved.</h3>
        </section>
      </div>
    </footer>
  );
};
