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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ContentLayout } from "../../_components/content-layout";
import { db } from "@/lib/prisma";
import { ChapterList } from "./_components/chapter-list";

export const metadata: Metadata = {
  title: "LMS | Assignment | Course",
  description: "Next generatation learning platform.",
};

interface Props {
  params: { id: string };
}

const Course = async ({ params: { id } }: Props) => {
  const course = await db.course.findUnique({
    where: { id },
    include: {
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) redirect("/dashboard");

  return (
    <ContentLayout title="Assignment">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard/assignment">Assignment</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Course</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <CardTitle>{course.title}</CardTitle>
          <CardDescription>You can see all your chapters here.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChapterList chapters={course.chapters} />
        </CardContent>
      </Card>
    </ContentLayout>
  );
};

export default Course;
