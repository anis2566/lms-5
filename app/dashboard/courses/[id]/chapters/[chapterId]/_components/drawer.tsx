import { Assignment, AssignmentSubmission, Chapter, Course, SubmissionStatus, UserProgress } from "@prisma/client";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { CourseSidebarItem } from "./sidebar-item";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChapterWithProgress extends Chapter {
  userProgress: UserProgress[];
  submissions: AssignmentSubmission[];
  assignments: Assignment | null;
}

interface CourseWithCahpter extends Course {
  chapters: ChapterWithProgress[];
}

interface Props {
  course: CourseWithCahpter;
  purchased: boolean;
}

export const CourseNavDrawer = ({ course, purchased }: Props) => {
  return (
    <Sheet>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle className="-mt-3 truncate">{course.title.length > 20 ? course.title.substring(0, 20) + "..." : course.title}</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-full mt-6 p-2">
          <div className="flex w-full flex-col gap-y-2">
            {course.chapters.map((chapter, index) => {
              let isPreviousChapterCompleted = false;

              if (index === 0) {
                isPreviousChapterCompleted = true;
              } else {
                const previousChapter = course.chapters[index - 1];
                if (previousChapter.assignments) {
                  isPreviousChapterCompleted = previousChapter.submissions.some(
                    (item) => item.status === SubmissionStatus.Accepted
                  );
                } else {
                  isPreviousChapterCompleted = true;
                }
              }

              return (
                <SheetClose key={chapter.id} asChild>
                  <CourseSidebarItem
                    key={chapter.id}
                    id={chapter.id}
                    label={chapter.title}
                    isCompleted={!!chapter?.userProgress?.[0]?.isCompleted}
                    courseId={course.id}
                    isLocked={!chapter.isFree && !purchased}
                    isPreviousChapterCompleted={isPreviousChapterCompleted}
                    purchased={purchased}
                  />
                </SheetClose>
              );
            })}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
