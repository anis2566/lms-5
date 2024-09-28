import Link from "next/link";
import type { Metadata } from "next";

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

import { ContentLayout } from "../_components/content-layout";
import { db } from "@/lib/prisma";
import { GET_USER } from "@/services/user.service";
import { CourseList } from "./_components/course-list";

export const metadata: Metadata = {
  title: "LMS | Assignment",
  description: "Next generatation learning platform.",
};

const Assignment = async () => {
  const { userId } = await GET_USER();

  const courses = await db.course.findMany({
    where: {
      purchases: {
        some: {
          userId,
        },
      },
    },
    include: {
      chapters: {
        select: {
          id: true,
        },
      },
    },
  });

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
            <BreadcrumbPage>Assignment</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <CardTitle>Courses</CardTitle>
          <CardDescription>You can see all your courses here.</CardDescription>
        </CardHeader>
        <CardContent>
          <CourseList courses={courses} />
        </CardContent>
      </Card>
    </ContentLayout>
  );
};

export default Assignment;
