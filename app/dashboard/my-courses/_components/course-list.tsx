"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";

import kyInstance from "@/lib/ky";
import InfiniteScrollContainer from "@/components/infinite-scroll-container";
import { CoursePage } from "@/lib/types";
import { CourseCard, CourseCardSkeleton } from "@/components/course-card";
import { EmptyData } from "@/components/empty-data";
import { SearchFilter } from "../../courses/_components/search-filter";

interface Props {
  userId: string;
}

export const CourseList = ({ userId }: Props) => {
  const searchParams = useSearchParams();

  const search = searchParams.get("search");
  const sort = searchParams.get("sort");
  const {data:session} = useSession();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["get-course-for-me", search, sort, userId],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get("/api/course", {
          searchParams: {
            ...(pageParam && { cursor: pageParam }),
            ...(search && { search }),
            ...(sort && { sort }),
            userId,
          },
        })
        .json<CoursePage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    refetchOnWindowFocus: false,
  });

  const courses = data?.pages.flatMap((page) => page.courses) || [];

  return (
    <div className="space-y-6">
      <SearchFilter />
      {status === "success" && !courses.length && !hasNextPage ? (
        <EmptyData title="No Course Found!" />
      ) : null}
      {status === "pending" ? (
        <CourseCardSkeleton />
      ) : (
        <InfiniteScrollContainer
          className="grid gap-4 md:grid-cols-4"
          onBottomReached={() => hasNextPage && !isFetching && fetchNextPage()}
        >
          {courses.map((course, i) => (
            <CourseCard
              key={i}
              course={course}
              purchased={true}
              isReviewed={!!course.reviews.find(review => review.userId === session?.userId)}
              totalReviews={course.reviews.length}
            />
          ))}
          {isFetchingNextPage && (
            <div className="flex justify-center">
              <Loader2 className="mx-auto my-3 animate-spin" />
            </div>
          )}
        </InfiniteScrollContainer>
      )}
    </div>
  );
};
