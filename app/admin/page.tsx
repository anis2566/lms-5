import type { Metadata } from "next";
import { BookOpen, FileQuestion, FileText, Users } from "lucide-react";
import { SubmissionStatus } from "@prisma/client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import { ContentLayout } from "./_components/content-layout";
import { db } from "@/lib/prisma";
import { PurchaseChart } from "./_components/purchase-chart";

export const metadata: Metadata = {
  title: "LMS | Dashboard",
  description: "Next generatation learning platform.",
};

const createDateFilter = (start: Date, end: Date) => ({
  updatedAt: {
    gte: start,
    lt: end,
  },
});

const Dashboard = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);

  const monthFilter = createDateFilter(monthStart, monthEnd);

  const [courses, students, questions, assignments, purchases, recentPurchases] = await Promise.all([
    db.course.count({
      where: {
        isPublished: true,
      },
    }),
    db.user.count({
      where: {
        purchases: {
          some: {},
        },
      },
    }),
    db.question.count({
      where: {
        answers: {
          none: {},
        },
      },
    }),
    db.assignmentSubmission.count({
      where: {
        status: SubmissionStatus.Pending,
      },
    }),
    db.purchase.groupBy({
      by: ["createdAt"],
      where: { ...monthFilter },
      _count: { _all: true },
    }),
    db.purchase.findMany({
      include: {
        course: true,
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    }),
  ]);

  const daysInMonth = today.getDate();
  const purchasesByDay = purchases.reduce((acc, item) => {
    const date = item.createdAt.toLocaleDateString("en-US");
    const existingDay = acc.find((d) => d.date === date);

    if (existingDay) {
      existingDay.count += item._count._all ?? 0;
    } else {
      acc.push({
        date,
        count: item._count._all ?? 0,
      });
    }

    return acc;
  }, Array.from({ length: daysInMonth }, (_, i) => ({
    date: new Date(today.getFullYear(), today.getMonth(), i + 1).toLocaleDateString("en-US"),
    count: 0,
  })));

  return (
    <ContentLayout title="Dashboard">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>Dashboard</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid md:grid-cols-4 gap-4">
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-md font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>{courses}</CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-md font-medium">Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>{students}</CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-md font-medium">Unanswered Questions</CardTitle>
            <FileQuestion className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>{questions}</CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-md font-medium">Unseen Assignments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>{assignments}</CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <PurchaseChart data={purchasesByDay} />
        <Card>
          <CardHeader>
            <CardTitle>Recent Purchases</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentPurchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell>{purchase.user.name}</TableCell>
                    <TableCell>{purchase.course.title}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  );
};

export default Dashboard;
