"use client";

import { AssignmentSubmission, SubmissionStatus } from "@prisma/client";
import Link from "next/link";
import { Download, Eye } from "lucide-react";
import { toast } from "sonner";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Props {
  submissions: AssignmentSubmission[];
}

export const SubmissionList = ({ submissions }: Props) => {
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

  if(submissions.length === 0) return (
    <div className="flex flex-col items-center justify-between gap-y-5">
      <h1 className="text-md italic text-center">No Submissions Found</h1>
    </div>
  )

  return (
    <div className="space-y-4">
      {submissions.map((submission) => (
        <div
          key={submission.id}
          className="space-y-2 p-2 shadow-sm shadow-primary"
        >
          <h1 className="text-sm">{submission.content}</h1>
          {submission.fileUrl && (
            <div className="flex items-center gap-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button asChild variant="outline" size="icon">
                      <Link href={submission.fileUrl} target="_blank">
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>View File</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() =>
                        submission.fileUrl &&
                        handleDownload(submission.fileUrl, "Attachment")
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
          )}
          <Badge
            variant={
              submission.status === SubmissionStatus.Pending
                ? "secondary"
                : submission.status === SubmissionStatus.Rejected
                  ? "destructive"
                  : "default"
            }
          >
            {submission.status}
          </Badge>
        </div>
      ))}
    </div>
  );
};
