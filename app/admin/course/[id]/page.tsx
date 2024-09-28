import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { ContentLayout } from "../../_components/content-layout";
import { db } from "@/lib/prisma";
import { CourseDetails } from "./_components/course-details";

export const metadata: Metadata = {
  title: "LMS | Course | Details",
  description: "Next generatation learning platform.",
};

interface Props {
  params: {
    id: string;
  };
}

const Course = async ({ params: { id } }: Props) => {
  const course = await db.course.findUnique({
    where: {
      id,
    },
    include: {
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) redirect("/admin");

  const chapters = await db.chapter.findMany({
    where: {
      courseId: id,
    },
    orderBy: {
      position: "asc",
    },
  });

  return (
    <ContentLayout title="Course">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/admin">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/admin/course">Course</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Details</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <CourseDetails course={course} chapters={chapters} />
    </ContentLayout>
  );
};

export default Course;
