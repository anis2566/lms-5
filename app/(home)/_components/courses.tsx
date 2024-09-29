"use client";

import { Category, Chapter, Course } from "@prisma/client";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

import { CourseCard } from "@/components/course-card";
import { cn } from "@/lib/utils";

interface CourseWithFeatures extends Course {
  category: Category | null;
  chapters: Chapter[];
  progress: number | null;
}

interface Props {
  courses: CourseWithFeatures[];
}

export const Courses = ({ courses }: Props) => {
  const displayCourses = courses.slice(0, 5);

  if (displayCourses.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto w-full max-w-screen-xl py-10">
      <div className="space-y-8 text-center">
        <Badge variant="outline" className="rounded-full py-2 text-sm">
          <span className="mr-2 text-primary">
            <Badge className="rounded-full">New</Badge>
          </span>
          <span>Popular Courses</span>
        </Badge>
      </div>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Explore our most popular courses.
      </p>

      <div className="grid md:grid-cols-4 gap-6 mt-10">
        {displayCourses.map((course, i) => (
          <CourseCard key={i} course={course} purchased={false} />
        ))}
      </div>
      <Link className={cn(buttonVariants({ variant: "outline" }), "mt-10 mx-auto flex w-fit")} href="/dashboard/courses">View More</Link>
    </section>
  );
};
