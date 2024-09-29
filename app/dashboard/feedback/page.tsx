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
import { GET_USER } from "@/services/user.service";
import { db } from "@/lib/prisma";
import { FeedbackList } from "./_components/feedback-list";
import { SubmissionStatus } from "@prisma/client";
import { CustomPagination } from "@/components/custom-pagination";
import { Header } from "./_components/header";

export const metadata: Metadata = {
    title: "LMS | Feedback",
    description: "Next generatation learning platform.",
};

interface Props {
    searchParams: {
        status?: SubmissionStatus;
        sort?: "desc" | "asc";
        page?: string;
        perPage?: string;
    }
}

const Feedback = async ({ searchParams }: Props) => {

    const { userId } = await GET_USER()

    const { status, sort, page = "1", perPage = "10" } = searchParams
    const itemsPerPage = parseInt(perPage, 10)
    const currentPage = parseInt(page, 10)

    const [feedbacks, totalFeedbacks] = await Promise.all([
        db.assignmentSubmission.findMany({
            where: {
                userId,
                feedback: {
                    not: null
                },
                ...(status && { status }),
            },
            include: {
                chapter: true,
            },
            orderBy: {
                createdAt: sort
            },
            skip: (currentPage - 1) * itemsPerPage,
            take: itemsPerPage,
        }),
        db.assignmentSubmission.count({
            where: {
                userId,
                feedback: {
                    not: null
                },
                ...(status && { status }),
            }
        })
    ])

    const totalPages = Math.ceil(totalFeedbacks / itemsPerPage)

    return (
        <ContentLayout title="Feedback">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Feedback</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Card>
                <CardHeader>
                    <CardTitle>Feedback</CardTitle>
                    <CardDescription>You can see all your feedback here.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Header />
                    <FeedbackList feedbacks={feedbacks} />
                    <CustomPagination totalPage={totalPages} />
                </CardContent>
            </Card>
        </ContentLayout>
    )
}

export default Feedback
