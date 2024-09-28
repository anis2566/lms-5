"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import ReactTimeAgo from "react-time-ago";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import kyInstance from "@/lib/ky";
import { QuestionPage } from "@/lib/types";

TimeAgo.addDefaultLocale(en);

interface Props {
  chapterId: string;
}

export const Questions = ({ chapterId }: Props) => {
  const { data, fetchNextPage, hasNextPage, isFetching, status } =
    useInfiniteQuery({
      queryKey: ["questions", chapterId],
      queryFn: ({ pageParam }) =>
        kyInstance
          .get(
            `/api/question/${chapterId}`,
            pageParam ? { searchParams: { cursor: pageParam } } : {},
          )
          .json<QuestionPage>(),
      initialPageParam: null as string | null,
      getNextPageParam: (firstPage) => firstPage.previousCursor,
      select: (data) => ({
        pages: [...data.pages].reverse(),
        pageParams: [...data.pageParams].reverse(),
      }),
    });

  const questions = data?.pages.flatMap((page) => page.questions) || [];

  return (
    <Card>
      <CardContent className="p-4">
        <div>
          {hasNextPage && (
            <Button
              variant="link"
              className="mx-auto block"
              disabled={isFetching}
              onClick={() => fetchNextPage()}
            >
              Load previous
            </Button>
          )}
          {status === "pending" && <Loader2 className="mx-auto animate-spin" />}
          {status === "success" && !questions.length && (
            <p className="text-center text-muted-foreground">
              No questions yet.
            </p>
          )}
          {status === "error" && (
            <p className="text-center text-destructive">
              An error occurred while loading questions.
            </p>
          )}
          <div className="space-y-4">
            {questions.map((question) => (
              <div key={question.id} className="space-y-2">
                <div className="flex space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={question.user.image || ""}
                      alt={question.user.name || ""}
                    />
                    <AvatarFallback>
                      {question.user.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{question.user.name}</h3>
                      <ReactTimeAgo
                        date={question.createdAt}
                        locale="en-US"
                        className="text-xs"
                      />
                    </div>
                    <p className="text-sm text-gray-700">{question.question}</p>
                  </div>
                </div>
                {question.answers.map((answer) => (
                  <div className="ml-12 space-y-4" key={answer.id}>
                    <div className="flex space-x-4">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={answer.user.image || ""}
                          alt={answer.user.name || ""}
                        />
                        <AvatarFallback>
                          {answer.user.name?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{answer.user.name}</h4>
                          <span className="text-sm text-gray-500">
                            <ReactTimeAgo
                              date={answer.createdAt}
                              locale="en-US"
                              className="text-xs"
                            />
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">{answer.answer}</p>
                        <div className="flex items-center space-x-4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
