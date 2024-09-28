"use client";

import { Assignment } from "@prisma/client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { Download, Eye } from "lucide-react";
import { toast } from "sonner";
import { useAssignmentSubmission } from "@/hooks/use-assignment-submission";

interface Props {
  assignment: Assignment | null;
  chapterId: string;
  courseId: string;
}

export const AssignmentList = ({ assignment, chapterId, courseId }: Props) => {
  const { onOpen } = useAssignmentSubmission();

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Error downloading file");
      }
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `${filename}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download file");
    }
  };

  if (!assignment) return (
    <div className="space-y-5">
      <div className="flex flex-col items-center justify-between gap-y-5">
        <h1 className="text-md italic text-center">No Assignment Found</h1>
        <Button>
          <Link href={`/dashboard/assignment/${courseId}`}>
            Go to Course
          </Link>
        </Button>
      </div>
    </div>
  )

  return (
    <div className="space-y-5">
      {assignment && (
        <Button onClick={() => onOpen(assignment.id, chapterId)}>Submit Assignment</Button>
      )}
      {assignment && (
        <div
          key={assignment.id}
          className="space-y-2 p-2 shadow-sm shadow-primary"
        >
          <h1>{assignment.title}</h1>
          <p className="text-sm text-muted-foreground">
            {assignment.description}
          </p>
          <div className="flex items-center gap-x-2">
            {assignment.fileUrl && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button asChild variant="outline" size="icon">
                      <Link href={assignment.fileUrl} target="_blank">
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View File</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() =>
                      handleDownload(assignment.fileUrl!, assignment.title)
                    }
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download File</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      )}
    </div>
  );
};
