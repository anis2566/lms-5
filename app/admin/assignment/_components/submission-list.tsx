"use client"

import { Assignment, AssignmentSubmission, Chapter, Course, SubmissionStatus, User } from "@prisma/client";
import Link from "next/link";
import { Eye, Download, FileText, Check, BookOpen } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { IconBadge } from "@/components/icon-badge";
import { useFeedbackSubmission } from "@/hooks/use-assignment-submission";

interface ChapterWithCourse extends Chapter {
    course: Course
}

interface SubmissionWithUser extends AssignmentSubmission {
    user: User;
    assignment: Assignment;
    chapter: ChapterWithCourse;
}

interface Props {
    submissions: SubmissionWithUser[];
}

export const SubmissionList = ({ submissions }: Props) => {
    const { onOpen } = useFeedbackSubmission()

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

    if (submissions.length === 0) return (
        <div className="flex flex-col items-center justify-between gap-y-5">
            <h1 className="text-md italic text-center">No Submissions Found</h1>
        </div>
    )

    return (
        <div className="space-y-5">
            {
                submissions.map((submission) => (
                    <div key={submission.id} className="border p-2 rounded-md space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-x-2">
                                <Avatar>
                                    <AvatarImage src={submission.user.image ?? ""} />
                                    <AvatarFallback>
                                        {submission.user.name?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <h1 className="text-md font-semibold">{submission.user.name}</h1>
                                    <p className="text-sm text-muted-foreground">
                                        {submission.createdAt.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <Button size="sm" onClick={() => onOpen(submission.id)}>
                                Feedback
                            </Button>
                        </div>
                        <div className="space-y-2 border p-2 rounded-md">
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={BookOpen} variant="default" size="sm" />
                                <p>Course & Chapter</p>
                            </div>
                            <p className="text-md">{submission.chapter.course.title}</p>
                            <div className="flex items-center gap-x-2">
                                <Badge variant="outline">{(submission.chapter?.position ?? -1) + 1}</Badge>
                                <p className="text-sm text-muted-foreground">
                                    {submission.chapter?.title}
                                </p>
                            </div>
                        </div>
                        <div className="space-y-2 border p-2 rounded-md">
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={FileText} variant="default" size="sm" />
                                <p>Assignment</p>
                            </div>
                            <div>
                                <p className="text-md font-semibold">{submission.assignment.title}</p>
                                <p className="text-sm text-muted-foreground">
                                    {submission.assignment.description}
                                </p>
                            </div>
                            {
                                submission.assignment.fileUrl && (
                                    <div className="flex items-center gap-x-2">
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button asChild variant="outline" size="icon">
                                                        <Link href={submission.assignment.fileUrl} target="_blank">
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
                                                            submission.assignment.fileUrl &&
                                                            handleDownload(submission.assignment.fileUrl, "Assignment")
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
                                )
                            }
                        </div>
                        <div className="space-y-2 border p-2 rounded-md">
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={Check} variant="default" size="sm" />
                                <p>Submission</p>
                            </div>
                            <div className="space-y-2">
                                <p className="text-md">{submission.content}</p>
                                {
                                    submission.fileUrl && (
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
                                    )
                                }
                            </div>
                        </div>
                        <Badge variant={submission.status === SubmissionStatus.Pending ? "outline" : submission.status === SubmissionStatus.Rejected ? "destructive" : "default"}>{submission.status}</Badge>
                    </div>
                ))
            }
        </div>
    )
}