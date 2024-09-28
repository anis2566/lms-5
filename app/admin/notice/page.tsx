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

export const metadata: Metadata = {
    title: "LMS | Notice",
    description: "Next generatation learning platform.",
};

const Notice = async () => {

    const notices = await db.notice.findMany({
        orderBy: {
            createdAt: "desc",
        },
    });

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
                <CardContent>
                    <NoticeList notices={notices} />
                </CardContent>
            </Card>
        </ContentLayout>
    )
}

export default Notice
