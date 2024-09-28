"use client";

import { Loader2, Lock } from "lucide-react";
import { Course } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";

import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

import { VideoPlayer } from "@/components/video-player";
import { formatPrice } from "@/lib/utils";
import { CREATE_PAYMENT } from "@/services/payment.service";
import { VideoController } from "./video-controller";

interface CoursePlayerProps {
  videoId: string;
  courseId: string;
  chapterId: string;
  nextChapterId?: string;
  previousChapterId?: string;
  isLocked: boolean;
  isCompleted: boolean;
  purchased: boolean;
  course: Course | null;
  isLoading: boolean;
  isPreviousChapterCompleted: boolean;
}

export const CoursePlayer = ({
  videoId,
  courseId,
  chapterId,
  nextChapterId,
  previousChapterId,
  isLocked,
  isCompleted,
  purchased,
  course,
  isLoading,
  isPreviousChapterCompleted,
}: CoursePlayerProps) => {
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
      createPayment({ amount: course.price.toString(), courseId });
    }
  };

  if (isLoading) {
    return <Skeleton className="aspect-video w-full" />;
  }

  return (
    <div className="space-y-4">
      <div className="relative aspect-video">
        {!isLoading && !isLocked && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
            <Loader2 className="h-8 w-8 animate-spin text-secondary" />
          </div>
        )}
        {!isLoading && (isLocked || !isPreviousChapterCompleted) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-y-2 bg-slate-800 text-secondary dark:text-white">
            <Lock className="h-8 w-8" />
            <p className="text-sm">This chapter is locked</p>
          </div>
        )}
        {!purchased && !isLocked && <VideoPlayer videoId={videoId} />}
        {purchased && isPreviousChapterCompleted && (
          <VideoPlayer videoId={videoId} />
        )}
      </div>
      {!purchased && (
        <Button onClick={handleEnroll} disabled={isPending}>
          Enroll with {formatPrice(course?.price ?? 0)}
        </Button>
      )}
      {purchased && (
        <VideoController
          isCompleted={isCompleted}
          nextChapterId={nextChapterId || ""}
          previousChapterId={previousChapterId || ""}
          courseId={courseId}
          chapterId={chapterId}
          isPreviousChapterCompleted={isPreviousChapterCompleted}
        />
      )}
    </div>
  );
};
