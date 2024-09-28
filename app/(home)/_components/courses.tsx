"use client";

import { Category, Chapter, Course } from "@prisma/client";

import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { CourseCard } from "@/components/course-card";

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
    return null; // Or return a message that no courses are available
  }

  return (
    <section className="container mx-auto w-full max-w-screen-xl py-24 sm:py-32">
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

      <Carousel className="relative mx-auto w-full max-w-screen-xl pt-10">
        <CarouselContent>
          {displayCourses.map((course, i) => (
            <CarouselItem key={i} className="md:basis-1/5">
              <CourseCard course={course} purchased={false} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute -left-5 top-1/2 z-50 -translate-y-1/2 transform" />
        <CarouselNext className="absolute -right-5 top-1/2 z-50 -translate-y-1/2 transform" />
      </Carousel>
    </section>
  );
};
