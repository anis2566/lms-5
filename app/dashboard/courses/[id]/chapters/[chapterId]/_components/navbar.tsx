import { Assignment, AssignmentSubmission, Chapter, Course, UserProgress } from "@prisma/client";

import { ModeToggle } from "@/components/mode-toggle";
import { Logo } from "@/components/logo";
import { UserNav } from "@/app/dashboard/_components/navbar/user-nav";
import { CourseNavDrawer } from "./drawer";
import { Notification } from "@/components/notification";

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

export const CourseNavbar = ({ course, purchased }: Props) => {
  return (
    <header className="sticky top-0 z-10 w-full flex-1 bg-muted/40 shadow backdrop-blur supports-[backdrop-filter]:bg-muted/40 dark:shadow-secondary">
      <div className="mx-2 flex h-14 items-center justify-between sm:mx-8">
        <CourseNavDrawer course={course} purchased={purchased} />
        <div className="flex items-center space-x-4 lg:space-x-0">
          <Logo callbackUrl="/dashboard" />
        </div>
        <div className="flex items-center justify-end space-x-2">
          <ModeToggle />
          <Notification />
          <UserNav />
        </div>
      </div>
    </header>
  );
};
