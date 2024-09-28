import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Chapter } from "@prisma/client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { buttonVariants } from "@/components/ui/button";

import { cn } from "@/lib/utils";

interface Props {
  chapters: Chapter[];
}

export const ChapterList = ({ chapters }: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableHead>#SL</TableHead>
        <TableHead>Title</TableHead>
        <TableHead>Action</TableHead>
      </TableHeader>
      <TableBody>
        {chapters.map((chapter, index) => (
          <TableRow key={chapter.id}>
            <TableCell>{chapter.position ?? 0 + 1}</TableCell>
            <TableCell>{chapter.title}</TableCell>
            <TableCell>
              <Link
                href={`/dashboard/assignment/${chapter.courseId}/${chapter.id}`}
                className={cn(buttonVariants({ variant: "default" }))}
              >
                <ArrowRight className="h-5 w-5" />
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
