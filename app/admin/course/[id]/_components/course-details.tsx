"use client";

import { Chapter, Course } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { CircleDollarSign, LayoutDashboard, ListChecks } from "lucide-react";

import { GET_CATEGORIES } from "../action";
import { Banner } from "./banner";
import { IconBadge } from "@/components/icon-badge";
import { TitleForm } from "./title-form";
import { DescriptionForm } from "./description-form";
import { ImageForm } from "./image-form";
import { CategoryForm } from "./category-form";
import { PriceForm } from "./price-form";
import { ChaptersForm } from "./chapter-form";
import { Actions } from "./action";

interface CourseWithChapter extends Course {
  chapters: Chapter[];
}

interface Props {
  course: CourseWithChapter;
  chapters: Chapter[];
}

export const CourseDetails = ({ course, chapters }: Props) => {
  const { data: categories } = useQuery({
    queryKey: ["get-categories-for-course"],
    queryFn: async () => {
      const res = await GET_CATEGORIES();
      return res.categories;
    },
    staleTime: 60 * 60 * 1000,
  });

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.price,
    course.categoryId,
    chapters.some((chapter) => chapter.isPublished),
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;

  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);

  return (
    <>
      {!course.isPublished && (
        <Banner label="This course is unpublished. It will not be visible to the students." />
      )}
      <div>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="mt-6 text-2xl font-medium">Course setup</h1>
            <span className="text-sm text-slate-700">
              Complete all fields {completionText}
            </span>
          </div>
          <Actions
            disabled={!isComplete}
            courseId={course.id}
            isPublished={course.isPublished}
          />
        </div>
        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">Customize your course</h2>
            </div>
            <TitleForm initialData={course} courseId={course.id} />
            <DescriptionForm initialData={course} courseId={course.id} />
            <ImageForm initialData={course} courseId={course.id} />
            <CategoryForm initialData={course} courseId={course.id} />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">Course chapters</h2>
              </div>
              <ChaptersForm chapters={chapters} courseId={course.id} />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-xl">Sell your course</h2>
              </div>
              <PriceForm initialData={course} courseId={course.id} />
              {/* <TeacherForm
                initialData={course}
                courseId={course.id}
                teachers={teachers ?? []}
              /> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
