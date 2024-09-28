"use client";

import { redirect } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { GET_COURSE } from "./action";

interface Props {
  params: {
    id: string;
  };
}

const CourseDetails = ({ params: { id } }: Props) => {
  const {
    data: course,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["get-course", id],
    queryFn: async () => {
      const res = await GET_COURSE(id);
      return res.course;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  if (isError || !course || !course.chapters || course.chapters.length === 0) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Error loading course or no chapters available.</p>
      </div>
    );
  }

  return redirect(
    `/dashboard/courses/${course.id}/chapters/${course.chapters[0].id}`,
  );
};

export default CourseDetails;
