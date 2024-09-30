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

import { Header } from "../category/_components/header";
import { CustomPagination } from "@/components/custom-pagination";
import { CourseList } from "./_components/course-list";
import { ContentLayout } from "../_components/content-layout";
import { db } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "LMS | Courses",
  description: "Next generatation learning platform.",
};

interface Props {
  searchParams: {
    page: string;
    perPage: string;
    name?: string;
    sort?: string;
  };
}

const Courses = async ({ searchParams }: Props) => {
  const { sort, name, page = "1", perPage = "5" } = searchParams;

  const itemsPerPage = parseInt(perPage, 10);
  const currentPage = parseInt(page, 10);

  const [courses, totalCourse] = await Promise.all([
    db.course.findMany({
      where: {
        ...(name && {
          title: { contains: name, mode: "insensitive" },
        }),
      },
      include: {
        category: true,
        chapters: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          },
        },
        purchases: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: sort === "asc" ? "asc" : "desc",
      },
      skip: (currentPage - 1) * itemsPerPage,
      take: itemsPerPage,
    }),
    db.course.count({
      where: {
        ...(name && { title: { contains: name, mode: "insensitive" } }),
      },
    }),
  ]);

  const totalPage = Math.ceil(totalCourse / itemsPerPage);

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
            <BreadcrumbPage>Course</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <CardTitle>Course Management</CardTitle>
          <CardDescription>View and manage your courses</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Header />
          <CourseList courses={courses} />
          <CustomPagination totalPage={totalPage} />
        </CardContent>
      </Card>
    </ContentLayout>
  );
};

export default Courses;
