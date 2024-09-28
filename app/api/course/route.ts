import { db } from "@/lib/prisma";
import { CoursePage, getCourseDataInclude } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor") || undefined;
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sort = searchParams.get("sort");
    const userId = searchParams.get("userId");

    const pageSize = 8;

    // Fetch courses based on filters and pagination
    const posts = await db.course.findMany({
      where: {
        ...(search && {
          title: { contains: search, mode: "insensitive" },
        }),
        ...(category && {
          category: {
            name: category,
          },
        }),
        ...(userId && {
          purchases: {
            some: {
              userId,
            },
          },
        }),
        isPublished: true,
      },
      include: getCourseDataInclude(),
      orderBy: {
        createdAt: sort === "asc" ? "asc" : "desc",
      },
      take: pageSize + 1, // Fetch one extra to determine if there's a next page
      cursor: cursor ? { id: cursor } : undefined,
    });

    const nextCursor = posts.length > pageSize ? posts[pageSize].id : null;

    // Calculate progress for each course
    const coursesWithProgress = await Promise.all(
      posts.slice(0, pageSize).map(async (course) => {
        if (userId) {
          const chapters = await db.chapter.findMany({
            where: { courseId: course.id },
            select: { id: true },
          });

          const chapterIds = chapters.map((chapter) => chapter.id);

          const userProgress = await db.userProgress.findMany({
            where: {
              userId: userId,
              chapterId: { in: chapterIds },
            },
            select: {
              chapterId: true,
              isCompleted: true,
            },
          });

          const completedChapters = userProgress.filter(
            (progress) => progress.isCompleted,
          ).length;
          const totalChapters = chapters.length;
          const progress =
            totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;

          return { ...course, progress };
        }
        return { ...course, progress: 0 };
      }),
    );

    const data: CoursePage = {
      courses: coursesWithProgress,
      nextCursor,
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
