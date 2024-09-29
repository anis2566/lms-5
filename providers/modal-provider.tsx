"use client";

import { FeedbackModal } from "@/app/admin/assignment/_components/feedback-modal";
import { DeleteCategoryModal } from "@/app/admin/category/_components/delete-modal";
import { DeleteCourseModal } from "@/app/admin/course/[id]/_components/delete-modal";
import { DeleteAssignmentModal } from "@/app/admin/course/[id]/chapter/[chapterId]/_components/delete-assignment-modal";
import { DeleteChapterModal } from "@/app/admin/course/[id]/chapter/[chapterId]/_components/delete-chapter-modal";
import { DeleteAttachmentModal } from "@/app/admin/course/[id]/chapter/[chapterId]/_components/delete-modal";
import { CreateNoticeModal } from "@/app/admin/notice/_components/create-notice-modal";
import { DeleteNoticeModal } from "@/app/admin/notice/_components/delete-modal";
import { AnswerModal } from "@/app/admin/question/_components/answer-modal";
import { DeleteQuestionModal } from "@/app/admin/question/_components/delete-modal";
import { SubmissionModal } from "@/app/dashboard/assignment/[id]/[chapterId]/_components/submission-modal";

export const ModalProvider = () => {
  return (
    <>
      <DeleteCategoryModal />
      <DeleteAttachmentModal />
      <DeleteChapterModal />
      <DeleteCourseModal />
      <DeleteAssignmentModal />
      <SubmissionModal />
      <FeedbackModal />
      <AnswerModal />
      <CreateNoticeModal />
      <DeleteNoticeModal />
      <DeleteQuestionModal />
    </>
  );
};
