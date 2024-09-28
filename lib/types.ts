import { Prisma } from "@prisma/client";

export function getUserDataSelect(loggedInUserId: string) {
  return {
    id: true,
    name: true,
    image: true,
  } satisfies Prisma.UserSelect;
}

export function getChapterDataInclude() {
  return {
    assignments: true,
    submissions: true,
  } satisfies Prisma.ChapterInclude;
}

export function getCourseDataInclude() {
  return {
    chapters: {
      include: getChapterDataInclude(),
      where: {
        isPublished: true,
      },
    },
    category: true,
  } satisfies Prisma.CourseInclude;
}

export type CourseData = Prisma.CourseGetPayload<{
  include: ReturnType<typeof getCourseDataInclude>;
}> & {
  progress: number | null;
};

export interface CoursePage {
  courses: CourseData[];
  nextCursor: string | null;
}

export function getAnswerDataInclude() {
  return {
    user: true,
  } satisfies Prisma.QuestionAnswerInclude;
}

export function getQuestionDataInclude() {
  return {
    user: true, // Include the user who asked the question
    answers: {
      include: getAnswerDataInclude(),
    },
  } satisfies Prisma.QuestionInclude;
}

export type QuestionData = Prisma.QuestionGetPayload<{
  include: ReturnType<typeof getQuestionDataInclude>;
}>;

export interface QuestionPage {
  questions: QuestionData[];
  previousCursor: string | null;
}
