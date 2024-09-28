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

import { ContentLayout } from "@/app/admin/_components/content-layout";
import { db } from "@/lib/prisma";
import { ChapterForm } from "./_components/chapter-form";

export const metadata: Metadata = {
  title: "LMS | Course | Details | Chapter",
  description: "Next generatation learning platform.",
};

interface Props {
  params: {
    chapterId: string;
  };
}

const Chapter = async ({ params: { chapterId } }: Props) => {
  const chapter = await db.chapter.findUnique({
    where: {
      id: chapterId,
    },
    include: {
      attachments: true,
      assignments: true,
    },
  });

  if (!chapter) redirect("/admin");

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
            <BreadcrumbPage>Chapter</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <ChapterForm chapter={chapter} assignment={chapter.assignments} />
    </ContentLayout>
  );
};

export default Chapter;
