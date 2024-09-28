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

import { CategoryList } from "./_components/category-list";
import { ContentLayout } from "../_components/content-layout";
import { db } from "@/lib/prisma";
import { Header } from "./_components/header";
import { CustomPagination } from "@/components/custom-pagination";

export const metadata: Metadata = {
  title: "LMS | Category",
  description: "Next generatation learning platform.",
};

interface Props {
  searchParams: {
    name?: string;
    sort?: string;
    page?: string;
    perPage?: string;
  };
}

const Category = async ({ searchParams }: Props) => {
  const { name, sort, page = "1", perPage = "5" } = searchParams;

  const itemsPerPage = parseInt(perPage, 10);
  const currentPage = parseInt(page, 10);

  const [categories, totalCategory] = await Promise.all([
    await db.category.findMany({
      where: {
        ...(name && { name: { contains: name, mode: "insensitive" } }),
      },
      orderBy: {
        createdAt: sort === "asc" ? "asc" : "desc",
      },
      skip: (currentPage - 1) * itemsPerPage,
      take: itemsPerPage,
    }),
    await db.category.count({
      where: {
        ...(name && { name: { contains: name, mode: "insensitive" } }),
      },
    }),
  ]);

  const totalPage = Math.ceil(totalCategory / itemsPerPage);

  return (
    <ContentLayout title="Category">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/admin">Dashboard</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Category</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>
            Manage and organize your learning content by categories
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Header />
          <CategoryList categories={categories} />
          <CustomPagination totalPage={totalPage} />
        </CardContent>
      </Card>
    </ContentLayout>
  );
};

export default Category;
