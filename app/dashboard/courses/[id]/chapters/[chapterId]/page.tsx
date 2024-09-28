"use client";

import { useQuery } from "@tanstack/react-query";
import { Clock3, FileQuestion, FileText, Paperclip } from "lucide-react";
import { SubmissionStatus } from "@prisma/client";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { GET_CHAPTER } from "./action";
import { Banner } from "@/app/admin/course/[id]/_components/banner";
import { CoursePlayer } from "./_components/course-player";
import { Preview } from "@/components/preview";
import { Attachments } from "./_components/attachments";
import { QuestionForm } from "./_components/question-form";
import { Questions } from "./_components/questions";
import { cn, getVideoLength } from "@/lib/utils";
import { Assignments } from "./_components/assignments";


interface Props {
  params: {
    id: string;
    chapterId: string;
  };
}

const Chapter = ({ params: { id, chapterId } }: Props) => {
  const { data, isLoading } = useQuery({
    queryKey: ["get-chapter", id, chapterId],
    queryFn: async () => {
      const res = await GET_CHAPTER({ courseId: id, chapterId });
      return res;
    },
  });

  const isLocked = data?.isLocked;
  const isCompleted = data?.purchased && data?.userProgress?.isCompleted;
  const isPreviousChapterCompleted = data?.isPreviousChapterCompleted;
  const purchased = data?.purchased;
  console.log(purchased)

  return (
    <div className="my-2 mt-6 space-y-2">
      {!isLoading && isCompleted && isPreviousChapterCompleted && (
        <div className="px-4">
          <Banner
            variant="success"
            label="You already completed this chapter."
          />
        </div>
      )}
      {!isLoading && isLocked && (
        <div className="px-4">
          <Banner
            variant="warning"
            label="You need to purchase this course to watch this chapter."
          />
        </div>
      )}
      {!isLoading && !isPreviousChapterCompleted && purchased && (
        <div className="px-4">
          <Banner
            variant="warning"
            label="Submit the previous chapter assignment to unlock this chapter."
          />
        </div>
      )}
      <div className="grid gap-6 p-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <CoursePlayer
            chapterId={chapterId}
            courseId={id}
            nextChapterId={data?.nextChapter ?? undefined}
            previousChapterId={data?.previousChapter ?? undefined}
            videoId={data?.chapter?.videoUrl || ""}
            isLocked={isLocked ?? false}
            isCompleted={isCompleted ?? false}
            purchased={!!purchased}
            course={data?.course ?? null}
            isLoading={isLoading}
            isPreviousChapterCompleted={isPreviousChapterCompleted ?? false}
          />
        </div>
        <Card className="max-h-[60vh]">
          <CardContent className="space-y-4 p-3">
            <h1 className="text-xl font-semibold text-primary/80">
              {data?.chapter?.title}
            </h1>
            <div className="-ml-3">
              <Preview value={data?.chapter?.description || ""} />
            </div>
            <div className="flex items-center gap-x-3">
              <Clock3 />
              <Badge>{getVideoLength(data?.chapter?.videoLength || 0)}</Badge>
            </div>
            <div className="flex items-center gap-x-3">
              <Paperclip />
              <Badge variant="outline">
                {data?.chapter?.attachments?.length || 0} attachments
              </Badge>
            </div>
            <div className="flex items-center gap-x-3">
              <FileQuestion />
              <Badge variant="outline">
                {data?.questions?.length} questions
              </Badge>
            </div>
            <div className="flex items-start gap-x-3">
              <FileText />
              <div className="space-y-2 flex flex-col">
                {
                  data?.chapter?.submissions?.length ?? 0 > 0 ?
                    data?.chapter?.submissions?.map((submission) => {
                      return (
                        <Badge
                          variant={submission.status === SubmissionStatus.Accepted ? "default" :
                            submission.status === SubmissionStatus.Rejected ? "destructive" :
                              "outline"}
                          key={submission.id}
                        >
                          {submission.status}
                        </Badge>
                      )
                    }) : <Badge variant="secondary">No submissions</Badge>
                }
              </div>
            </div>
            {
              purchased && (
                <Link href={`/dashboard/assignment/${id}/${chapterId}`} className={cn(buttonVariants({ variant: "outline" }))}>
                  Submit Assignment
                </Link>
              )
            }

            {
              purchased && (
                <Link href={`/dashboard/chat?userId=${data?.adminId}`} className={cn(buttonVariants({ variant: "default" }))}>
                  Support Chat
                </Link>
              )
            }
          </CardContent>
        </Card>
      </div>
      <div className="px-4">
        <Tabs defaultValue="questions" className={cn("w-full", !purchased && "hidden")}>
          <TabsList className="w-full">
            <TabsTrigger value="questions">Questions</TabsTrigger>
            <TabsTrigger value="attachments">Attachments</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
          </TabsList>
          <TabsContent value="attachments">
            <Attachments attachments={data?.chapter?.attachments || []} />
          </TabsContent>
          <TabsContent value="questions" className="space-y-4">
            <QuestionForm chapterId={chapterId} />
            <Questions chapterId={chapterId} />
          </TabsContent>
          <TabsContent value="assignments">
            <Assignments assignments={data?.chapter?.assignments || null} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Chapter;
