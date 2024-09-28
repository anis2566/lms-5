import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  FileText,
  LayoutDashboard,
  Paperclip,
  Video,
} from "lucide-react";
import { Assignment, Attachment, Chapter } from "@prisma/client";

import { Banner } from "../../../_components/banner";
import { IconBadge } from "@/components/icon-badge";
import { TitleForm } from "./title-form";
import { DescriptionForm } from "./description-form";
import { AccessForm } from "./access-form";
import { AttachmentsForm } from "./attachment-form";
import { ThumbnailForm } from "./thumbnail-form";
import { VideoForm } from "./video-form";
import { Actions } from "./action";
import { AssignmentForm } from "./assignment-form";

interface chapterWithAttachments extends Chapter {
  attachments: Attachment[];
}

interface Props {
  chapter: chapterWithAttachments;
  assignment: Assignment | null;
}

export const ChapterForm = async ({ chapter, assignment }: Props) => {
  const requiredFields = [
    chapter.title,
    chapter.description,
    chapter.videoUrl,
    chapter.videoThumbnail,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  const { attachments, ...ChapterWithoutAttachments } = chapter;

  return (
    <>
      {!chapter.isPublished && (
        <Banner
          variant="warning"
          label="This chapter is unpublished. It will not be visible in the course"
        />
      )}
      <div>
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/admin/course/${chapter.id}`}
              className="my-6 flex items-center text-sm transition hover:opacity-75"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to course setup
            </Link>
            <div className="flex w-full items-center justify-between">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium">Chapter Creation</h1>
                <span className="text-sm text-slate-700">
                  Complete all fields {completionText}
                </span>
              </div>
              <Actions
                disabled={!isComplete}
                isPublished={chapter.isPublished}
                chapterId={chapter.id}
                courseId={chapter.courseId}
              />
            </div>
          </div>
        </div>
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">Customize your chapter</h2>
              </div>
              <TitleForm
                initialData={ChapterWithoutAttachments}
                courseId={chapter.courseId}
                chapterId={chapter.id}
              />
              <DescriptionForm
                initialData={ChapterWithoutAttachments}
                courseId={chapter.courseId}
                chapterId={chapter.id}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Eye} />
                <h2 className="text-xl">Access Settings</h2>
              </div>
              <AccessForm
                initialData={ChapterWithoutAttachments}
                courseId={chapter.courseId}
                chapterId={chapter.id}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={Paperclip} />
                <h2 className="text-xl">Attachments</h2>
              </div>
              <AttachmentsForm
                attachments={attachments}
                chapterId={chapter.id}
              />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={FileText} />
                <h2 className="text-xl">Assignments</h2>
              </div>
              <AssignmentForm
                chapterId={chapter.id}
                assignment={assignment}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Video} />
              <h2 className="text-xl">Add Media</h2>
            </div>
            <ThumbnailForm
              initialData={ChapterWithoutAttachments}
              chapterId={chapter.id}
              courseId={chapter.courseId}
            />
            <VideoForm
              initialData={ChapterWithoutAttachments}
              chapterId={chapter.id}
              courseId={chapter.courseId}
            />
          </div>
        </div>
      </div>
    </>
  );
};
