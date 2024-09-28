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
import { GET_USER } from "@/services/user.service";

export const metadata: Metadata = {
  title: "LMS | My Courses",
  description: "Next generatation learning platform.",
};

const MyCourses = async () => {
  const { userId } = await GET_USER();

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
            <BreadcrumbPage>My Courses</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Suspense fallback={<p>Loading</p>}>
        <CourseList userId={userId} />
      </Suspense>
    </ContentLayout>
  );
};

export default MyCourses;
