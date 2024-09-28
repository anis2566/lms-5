import { Course } from "@prisma/client";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { cn } from "@/lib/utils";

interface CourseWithChapters extends Course {
  chapters: { id: string }[];
}

interface Props {
  courses: CourseWithChapters[];
}

export const CourseList = ({ courses }: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableHead>#SL</TableHead>
        <TableHead>Title</TableHead>
        <TableHead>Chapters</TableHead>
        <TableHead>Action</TableHead>
      </TableHeader>
      <TableBody>
        {courses.map((course, index) => (
          <TableRow key={course.id}>
            <TableCell className="py-3">{index + 1}</TableCell>
            <TableCell className="py-3">{course.title}</TableCell>
            <TableCell className="py-3">{course.chapters.length}</TableCell>
            <TableCell className="py-3">
              <Link
                href={`/dashboard/assignment/${course.id}`}
                className={cn(buttonVariants({ variant: "default" }))}
              >
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
