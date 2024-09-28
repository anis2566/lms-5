import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import { ContentLayout } from "@/app/admin/_components/content-layout";
import { EditCategoryForm } from "./_components/edit-category-form";
import { db } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "LMS | Category | Edit",
  description: "Next generatation learning platform.",
};

interface Props {
  params: {
    id: string;
  };
}

const EditCategory = async ({ params: { id } }: Props) => {
  const category = await db.category.findUnique({
    where: {
      id,
    },
  });

  if (!category) redirect("/admin");

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
            <BreadcrumbLink asChild>
              <Link href="/admin/category">Category</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Edit</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <EditCategoryForm category={category} />
    </ContentLayout>
  );
};

export default EditCategory;
