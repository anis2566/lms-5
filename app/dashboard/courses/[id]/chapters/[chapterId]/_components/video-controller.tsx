"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { useConfettiStore } from "@/hooks/use-confetti";
import { MARK_COMPLETE, MARK_INCOMPLETE } from "../action";
import { Button, buttonVariants } from "@/components/ui/button";

interface Props {
  nextChapterId: string;
  previousChapterId: string;
  courseId: string;
  chapterId: string;
  isCompleted: boolean;
  isPreviousChapterCompleted: boolean;
}

export const VideoController = ({
  nextChapterId,
  courseId,
  previousChapterId,
  chapterId,
  isCompleted,
  isPreviousChapterCompleted,
}: Props) => {
  const { onOpen } = useConfettiStore();
  const queryClient = useQueryClient();

  const { mutate: markComplete, isPending } = useMutation({
    mutationFn: MARK_COMPLETE,
    onSuccess: (data) => {
      onOpen();
      queryClient.invalidateQueries({
        queryKey: ["get-chapter"],
      });
      queryClient.refetchQueries({
        queryKey: ["get-chapter"],
      });
      toast.success(data?.success, {
        id: "chapter-complete",
      });
    },
    onError: (error) => {
      toast.error(error.message, {
        id: "chapter-complete",
      });
    },
  });

  const { mutate: markInComplete, isPending: isLoading } = useMutation({
    mutationFn: MARK_INCOMPLETE,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["get-chapter"],
      });
      queryClient.refetchQueries({
        queryKey: ["get-chapter"],
      });
      toast.success(data?.success, {
        id: "chapter-incomplete",
      });
    },
    onError: (error) => {
      toast.error(error.message, {
        id: "chapter-incomplete",
      });
    },
  });

  const hanldeComplete = () => {
    if (isCompleted) {
      toast.loading("Chapter incompleting...", {
        id: "chapter-incomplete",
      });
      markInComplete({ chapterId, courseId });
    } else {
      toast.loading("Chapter completing...", {
        id: "chapter-complete",
      });
      markComplete({ chapterId, courseId });
    }
  };

  return (
    <div className="w-full space-y-4">
      {
        isPreviousChapterCompleted && (
          <Button
            variant="outline"
            onClick={hanldeComplete}
            disabled={isPending || isLoading}
          >
            {isCompleted ? "Mark as Incomplete" : "Mark as Complete"}
          </Button>
        )
      }
      <div className="flex items-center justify-between">
        {previousChapterId ? (
          <Link
            href={`/dashboard/courses/${courseId}/chapters/${previousChapterId}`}
            className={cn(buttonVariants({ variant: "default" }))}
          >
            <ChevronLeft />
            Previous
          </Link>
        ) : (
          <Button disabled>
            <ChevronLeft />
            Previous
          </Button>
        )}
        {nextChapterId ? (
          <Link
            href={`/dashboard/courses/${courseId}/chapters/${nextChapterId}`}
            className={cn(buttonVariants({ variant: "default" }))}
          >
            Next
            <ChevronRight />
          </Link>
        ) : (
          <Button disabled>
            Next
            <ChevronRight />
          </Button>
        )}
      </div>
    </div>
  );
};
