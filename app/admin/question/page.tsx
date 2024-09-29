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
import { QuestionList } from "./_components/question-list";
import { Header } from "../category/_components/header";
import { CustomPagination } from "@/components/custom-pagination";

export const metadata: Metadata = {
    title: "LMS | Questions",
    description: "Next generatation learning platform.",
};

interface Props {
    searchParams: {
        page: string;
        perPage: string;
        sort?: string;
        name?: string;
    }
}

const Questions = async ({ searchParams }: Props) => {
    const { page = "1", perPage = "5", sort, name } = searchParams;
    const itemsPerPage = parseInt(perPage, 10);
    const currentPage = parseInt(page, 10);


    const [questions, totalQuestions] = await Promise.all([
        db.question.findMany({
            where: {
                ...(name && {
                    user: {
                        name: {
                            contains: name,
                            mode: "insensitive"
                        }
                    }
                })
            },
            include: {
                user: true,
                chapter: {
                    include: {
                        course: true
                    }
                },
                answers: true
            },
            orderBy: {
                createdAt: sort === "asc" ? "asc" : "desc"
            },
            skip: (currentPage - 1) * itemsPerPage,
            take: itemsPerPage
        }),
        db.question.count({
            where: {
                ...(name && {
                    user: {
                        name: {
                            contains: name,
                            mode: "insensitive"
                        }
                    }
                })
            }
        })
    ])

    const totalPages = Math.ceil(totalQuestions / itemsPerPage);

    return (
        <ContentLayout title="Questions">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/admin">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Questions</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Card>
                <CardHeader>
                    <CardTitle>Questions</CardTitle>
                    <CardDescription>List of questions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Header />
                    <QuestionList questions={questions} />
                    <CustomPagination totalPage={totalPages} />
                </CardContent>
            </Card>
        </ContentLayout>
    )
}

export default Questions
