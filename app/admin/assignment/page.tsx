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
import { SubmissionList } from "./_components/submission-list";
import { SubmissionStatus } from "@prisma/client";
import { CustomPagination } from "@/components/custom-pagination";
import { Header } from "./_components/header";

export const metadata: Metadata = {
    title: "LMS | Assignment",
    description: "Next generatation learning platform.",
};

interface Props {
    searchParams: {
        name?: string;
        status?: SubmissionStatus;
        page?: string;
        perPage?: string;
    }
}

const Assignmetn = async ({ searchParams }: Props) => {
    const { name, status, page = "1", perPage = "5" } = searchParams;
    const itemsPerPage = parseInt(perPage, 10);
    const currentPage = parseInt(page, 10);

    const [submissions, totalSubmission] = await Promise.all([
        db.assignmentSubmission.findMany({
            where: {
                ...(name && {
                    user: {
                        name: {
                            contains: name,
                            mode: "insensitive"
                        }
                    }
                }),
                ...(status && {
                    status: status
                }),
            },
            include: {
                chapter: {
                    include: {
                        assignments: true,
                        course: true
                    },
                },
                user: true,
                assignment: true
            },
            take: itemsPerPage,
            skip: (currentPage - 1) * itemsPerPage,
        }),
        db.assignmentSubmission.count({
            where: {
                ...(name && {
                    user: {
                        name: {
                            contains: name,
                            mode: "insensitive"
                        }
                    }
                }),
                ...(status && {
                    status: status
                }),
            },
        }),
    ]);

    const totalPage = Math.ceil(totalSubmission / itemsPerPage);

    return (
        <ContentLayout title="Assignment">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/admin">Dashboard</Link>
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
                    <CardTitle>Submissions</CardTitle>
                    <CardDescription>
                        View all assignment submissions.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                    <Header />
                    <SubmissionList submissions={submissions} />
                    <CustomPagination totalPage={totalPage} />
                </CardContent>
            </Card>
        </ContentLayout>
    )
}

export default Assignmetn
