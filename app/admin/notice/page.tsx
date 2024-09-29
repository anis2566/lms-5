import { Metadata } from "next";
import Link from "next/link";

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
import { NewButton } from "./_components/new-button";
import { db } from "@/lib/prisma";
import { NoticeList } from "./_components/notice-list";
import { Header } from "./_components/header";
import { CustomPagination } from "@/components/custom-pagination";

export const metadata: Metadata = {
    title: "LMS | Notice",
    description: "Next generatation learning platform.",
};

interface Props {
    searchParams: {
        page: string;
        perPage: string;
        sort: string;
    }
}

const Notice = async ({ searchParams }: Props) => {
    const { page = "1", perPage = "5", sort = "desc" } = searchParams;
    const itemsPerPage = parseInt(perPage, 10);
    const currentPage = parseInt(page, 10);

    const [notices, totalNotices] = await Promise.all([
        db.notice.findMany({
            orderBy: {
                ...(sort === "asc" ? { createdAt: "asc" } : { createdAt: "desc" }),
            },
            skip: (currentPage - 1) * itemsPerPage,
            take: itemsPerPage,
        }),
        db.notice.count(),
    ]);

    const totalPage = Math.ceil(totalNotices / itemsPerPage);

    return (
        <ContentLayout title="Notice">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/admin">Dashboard</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Notice</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <NewButton />

            <Card>
                <CardHeader>
                    <CardTitle>Notice</CardTitle>
                    <CardDescription>Manage your notice here.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Header />
                    <NoticeList notices={notices} />
                    <CustomPagination totalPage={totalPage} />
                </CardContent>
            </Card>
        </ContentLayout>
    )
}

export default Notice
