import { redirect } from "next/navigation";

import { db } from "@/lib/prisma";
import { GET_USER } from "@/services/user.service";
import { GET_PROGRESS } from "./action";
import { CourseSidebar } from "./_components/sidebar";
import { CourseNavbar } from "./_components/navbar";

interface Props {
  params: {
    id: string;
    chapterId: string;
  };
  children: React.ReactNode;
}

const ChapterLayout = async ({
  children,
  params: { id, chapterId },
}: Props) => {
  const { userId } = await GET_USER();

  const course = await db.course.findUnique({
    where: {
      id,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          userProgress: {
            where: {
              userId,
            },
          },
          assignments: true,
          submissions: true
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) redirect("/dashboard");

  const purchased = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: id,
      },
    },
  });

  const progressCount = await GET_PROGRESS(userId, course.id);

  return (
    <div className="flex">
      <CourseSidebar
        course={course}
        progressCount={progressCount}
        purchased={!!purchased}
      />
      <div className="flex-1">
        <CourseNavbar course={course} purchased={!!purchased} />
        {children}
      </div>
    </div>
  );
};

export default ChapterLayout;
