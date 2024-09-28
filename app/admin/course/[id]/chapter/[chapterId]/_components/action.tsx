"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { PUBLISH_CHAPTER, UNPUBLISH_CHAPTER } from "../action";
import { useChapter } from "@/hooks/use-chapter";

interface ChapterActionsProps {
  disabled: boolean;
  isPublished: boolean;
  chapterId: string;
  courseId: string;
}

export const Actions = ({
  disabled,
  isPublished,
  chapterId,
  courseId,
}: ChapterActionsProps) => {
  const { onOpen } = useChapter();
  const router = useRouter();

  const { mutate: publishChapter, isPending } = useMutation({
    mutationFn: PUBLISH_CHAPTER,
    onSuccess: (data) => {
      router.push(`/admin/course/${courseId}`);
      toast.success(data?.success, {
        id: "publish-chapter",
      });
    },
    onError: (error) => {
      toast.error(error.message, {
        id: "publish-chapter",
      });
    },
  });

  const { mutate: unpublishChapter, isPending: isLoading } = useMutation({
    mutationFn: UNPUBLISH_CHAPTER,
    onSuccess: (data) => {
      toast.success(data?.success, {
        id: "unpublish-chapter",
      });
    },
    onError: (error) => {
      toast.error(error.message, {
        id: "unpublish-chapter",
      });
    },
  });

  const togglePublisth = () => {
    if (isPublished) {
      toast.loading("Chapter unpublishing...", {
        id: "unpublish-chapter",
      });
      unpublishChapter(chapterId);
    } else {
      toast.loading("Chapter publishing...", {
        id: "publish-chapter",
      });
      publishChapter(chapterId);
    }
  };

  return (
    <div className="flex items-center gap-x-2">
      <Button
        disabled={disabled || isPending || isLoading}
        variant="outline"
        size="sm"
        onClick={togglePublisth}
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpen(chapterId, courseId)}
            >
              <Trash2 className="h-5 w-5 text-rose-500" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete chapter</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
