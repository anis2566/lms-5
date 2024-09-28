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
import { StudentList } from "./_components/student-list";
import { CustomPagination } from "@/components/custom-pagination";
import { Header } from "../category/_components/header";

export const metadata: Metadata = {
    title: "LMS | Students",
    description: "Next generatation learning platform.",
};

interface Props {
    searchParams: {
        name?: string;
        sort?: string;
        page: string;
        perPage: string;
    };
}

const Students = async ({ searchParams }: Props) => {
    const { name, sort, page = "1", perPage = "5" } = searchParams;
    const itemsPerPage = parseInt(perPage, 10);
    const currentPage = parseInt(page, 10);


    const [students, totalStudent] = await Promise.all([
        db.user.findMany({
            where: {
                ...(name && {
                    name: {
                        contains: name,
                        mode: "insensitive"
                    }
                }),
                purchases: {
                    some: {}
                }
            },
            include: {
                purchases: {
                    select: {
                        id: true,
                    }
                }
            },
            orderBy: {
                ...(sort === "asc" ? { name: "asc" } : { name: "desc" }),
            },
            skip: (currentPage - 1) * itemsPerPage,
            take: itemsPerPage
        }),
        db.user.count({
            where: {
                purchases: {
                    some: {}
                }
            },
        }),
    ]);

    const totalPage = Math.ceil(totalStudent / itemsPerPage);

    return (
        <ContentLayout title="Students">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/admin">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Students</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Card>
                <CardHeader>
                    <CardTitle>Students</CardTitle>
                    <CardDescription>List of students</CardDescription>
                </CardHeader>
                <CardContent>
                    <Header />
                    <StudentList students={students} />
                    <CustomPagination totalPage={totalPage} />
                </CardContent>
            </Card>
        </ContentLayout>
    )
}

export default Students
