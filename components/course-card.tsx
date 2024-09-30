import Image from "next/image";
import Link from "next/link";
import { BookOpen, Clock3, DollarSign } from "lucide-react";
import { Category, Chapter, Course } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { Rating } from "@smastrom/react-rating";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { formatPrice, getVideoLength } from "@/lib/utils";
import { IconBadge } from "./icon-badge";
import { Button } from "./ui/button";
import { CourseProgress } from "./course-progress";
import { CREATE_PAYMENT } from "@/services/payment.service";
import { useReview } from "@/hooks/use-review";

interface CourseWithFeatures extends Course {
  category: Category | null;
  chapters: Chapter[];
  progress: number | null;
}

interface Props {
  course: CourseWithFeatures;
  purchased: boolean;
  totalReviews: number;
  isReviewed: boolean;
}

export const CourseCard = ({ course, purchased, totalReviews, isReviewed }: Props) => {
  const { onOpen } = useReview();

  const { mutate: createPayment, isPending } = useMutation({
    mutationFn: CREATE_PAYMENT,
    onSuccess: (data) => {
      if (data?.url) {
        window.location.replace(data?.url);
      }
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleEnroll = () => {
    if (course?.price) {
      createPayment({ amount: course.price.toString(), courseId: course.id });
    }
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
          <Badge className="max-w-fit">{course.category?.name}</Badge>
          <div className="line-clamp-2 text-lg font-medium transition group-hover:text-sky-700 md:text-base space-x-1 pt-1">
            <p>{course.title}</p>
            <div className="flex items-center gap-x-1">
              <Rating value={course.rating ?? 0} readOnly style={{ maxWidth: 70 }}  />
              <span className="text-xs text-gray-500">({totalReviews ?? 0})</span>
            </div>
          </div>
          <div className="my-1 flex items-center gap-x-2 text-sm md:text-xs">
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
      {purchased || course.progress ? (
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
          <Button onClick={handleEnroll} disabled={isPending}>
            {isPending ? "Loading..." : "Buy"}
          </Button>
        </div>
      )}
      {
        purchased && !isReviewed && (
          <Button variant="outline" size="sm" className="mt-4" onClick={() => onOpen(course.id)}>
            Leave a Review
          </Button>
        )
      }
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
