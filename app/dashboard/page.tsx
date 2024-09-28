import Link from "next/link";
import type { Metadata } from "next";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { ContentLayout } from "./_components/content-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileQuestion, FileText } from "lucide-react";
import { db } from "@/lib/prisma";
import { GET_USER } from "@/services/user.service";
import { SubmissionStatus } from "@prisma/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


export const metadata: Metadata = {
  title: "LMS | Dashboard",
  description: "Next generatation learning platform.",
};

const Dashboard = async () => {
  const { userId } = await GET_USER()

  const [courses, questions, assignments, recentAssignments, notices] = await Promise.all([
    await db.course.count({
      where: {
        purchases: {
          some: {
            userId
          }
        }
      }
    }),
    await db.question.count({
      where: {
        answers: {
          none: {}
        }
      }
    }),
    await db.assignmentSubmission.count({
      where: {
        status: SubmissionStatus.Pending
      }
    }),
    await db.assignmentSubmission.findMany({
      include: {
        assignment: true
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 3
    }),
    await db.notice.findMany({
      orderBy: {
        createdAt: "desc"
      },
      take: 3
    })
  ]);

  return (<ContentLayout title="Dashboard">
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage>Dashboard</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>

    <div className="grid md:grid-cols-3 gap-4">
      <Card className="flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-md font-medium">Total Courses</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {courses}
        </CardContent>
      </Card>
      <Card className="flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-md font-medium">Unanswered Questions</CardTitle>
          <FileQuestion className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {questions}
        </CardContent>
      </Card>
      <Card className="flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-md font-medium">Unseen Assignments</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {assignments}
        </CardContent>
      </Card>
    </div>

    <div className="grid md:grid-cols-3 gap-6">
      <div className="col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Assignments</CardTitle>
            <CardDescription>You have {assignments} assignments pending.</CardDescription>
          </CardHeader>
          <CardContent>
            {
              recentAssignments.map((assignment) => (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Assignment</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Submitted At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>{assignment.assignment.title}</TableCell>
                      <TableCell>{assignment.status}</TableCell>
                      <TableCell>{assignment.createdAt.toLocaleDateString()}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              ))
            }
          </CardContent>
        </Card>
      </div>
      {/* Notice Board */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Notice Board</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="flex flex-row items-center justify-between">
                <div className="flex flex-col">
                  {
                    notices.map((notice) => (
                      <div key={notice.id}>
                        <h3>{notice.title}</h3>
                        <p>{notice.content}</p>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </ContentLayout>
  );
};

export default Dashboard;
