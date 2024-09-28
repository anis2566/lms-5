import Image from "next/image";
import Link from "next/link";
import { BookOpen, Clock3, DollarSign } from "lucide-react";
import { Category, Chapter, Course } from "@prisma/client";

import { Badge } from "@/components/ui/badge";

// import { CourseProgress } from "../course/course-progress";
import { formatPrice, getVideoLength } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { IconBadge } from "./icon-badge";
import { Button } from "./ui/button";
import { CourseProgress } from "./course-progress";

interface CourseWithFeatures extends Course {
  category: Category | null;
  chapters: Chapter[];
  progress: number | null;
}

interface Props {
  course: CourseWithFeatures;
  purchased: boolean;
}

export const CourseCard = ({ course, purchased }: Props) => {
  const handleBuyClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    // Add your buy logic here
    console.log("Buy button clicked for course:", course.id);
  };

  return (
    <div className="group h-full overflow-hidden rounded-lg border p-3 transition hover:shadow-sm">
      <Link href={`/dashboard/courses/${course.id}`}>
        <div className="relative aspect-video w-full overflow-hidden rounded-md">
          <Image
            fill
            className="object-cover"
            alt={course.title}
            src={course.imageUrl || ""}
          />
        </div>
        <div className="flex flex-col pt-2">
          <div className="line-clamp-2 text-lg font-medium transition group-hover:text-sky-700 md:text-base">
            {course.title}
          </div>
          <Badge className="max-w-fit">{course.category?.name}</Badge>
          <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1">
              <IconBadge size="sm" icon={BookOpen} />
              <span>
                {course.chapters?.length}{" "}
                {course.chapters?.length === 1 ? "Chapter" : "Chapters"}
              </span>
            </div>
            <div className="flex items-center gap-x-1">
              <IconBadge size="sm" icon={Clock3} />
              <span>
                {getVideoLength(
                  course.chapters.reduce(
                    (acc, chapter) => acc + (chapter.videoLength || 0),
                    0,
                  ),
                )}
              </span>
            </div>
          </div>
        </div>
      </Link>
      {course.progress ? (
        <CourseProgress
          variant={course.progress === 100 ? "success" : "default"}
          size="sm"
          value={course.progress || 0}
        />
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-1">
            <IconBadge size="sm" icon={DollarSign} />
            <span>{formatPrice(course.price || 0)}</span>
          </div>
          <Button>Buy</Button>
        </div>
      )}
    </div>
  );
};

export const CourseCardSkeleton = () => {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="group overflow-hidden rounded-lg border p-3 transition hover:shadow-sm"
        >
          <div className="relative aspect-video w-full overflow-hidden rounded-md">
            <Skeleton className="h-full w-full object-cover" />
          </div>
          <div className="flex flex-col gap-y-1 pt-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-1/3 rounded-full" />
            <Skeleton className="h-6 w-1/3 rounded-full" />
            <Skeleton className="h-6 w-1/3 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
};
