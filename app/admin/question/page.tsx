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

export const metadata: Metadata = {
    title: "LMS | Questions",
    description: "Next generatation learning platform.",
};

const Questions = async () => {
    const questions = await db.question.findMany({
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
            createdAt: "desc"
        }
    })

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
                <CardContent>
                    <QuestionList questions={questions} />
                </CardContent>
            </Card>
        </ContentLayout>
    )
}

export default Questions
