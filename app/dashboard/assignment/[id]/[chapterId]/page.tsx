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

import { ContentLayout } from "@/app/dashboard/_components/content-layout";
import { db } from "@/lib/prisma";
import { AssignmentList } from "./_components/assignment-list";
import { SubmissionList } from "./_components/submission-list";

export const metadata: Metadata = {
  title: "LMS | Assignment | Course | Chapter",
  description: "Next generatation learning platform.",
};

interface Props {
  params: { id: string; chapterId: string };
}

const Chapter = async ({ params: { id, chapterId } }: Props) => {
  const chapter = await db.chapter.findUnique({
    where: {
      id: chapterId,
    },
    include: {
      assignments: true,
      submissions: true,
    },
  });

  if (!chapter) redirect("/dashboard/assignment");

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
            <BreadcrumbPage>Chapter</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <CardTitle>{chapter.title}</CardTitle>
          <CardDescription>
            You can see all your assignments here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AssignmentList
            chapterId={chapterId}
            assignment={chapter.assignments}
            courseId={id}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Submissions</CardTitle>
          <CardDescription>
            You can see all your submissions here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SubmissionList submissions={chapter.submissions} />
        </CardContent>
      </Card>
    </ContentLayout>
  );
};

export default Chapter;
