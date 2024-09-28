import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { ContentLayout } from "../_components/content-layout";
import { CourseList } from "./_components/course-list";
import { GET_CATEGORIES } from "./action";

export const metadata: Metadata = {
  title: "LMS | Courses",
  description: "Next generatation learning platform.",
};

const Courses = async () => {
  const { categories } = await GET_CATEGORIES();

  return (
    <ContentLayout title="Course">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/dashboard">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Course</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Suspense fallback={<p>Loading</p>}>
        <CourseList categories={categories} />
      </Suspense>
    </ContentLayout>
  );
};

export default Courses;
