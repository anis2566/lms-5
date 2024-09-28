"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  InfiniteData,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

import { CREATE_QUESTION } from "../action";
import { QuestionPage } from "@/lib/types";

const formSchema = z.object({
  question: z.string().min(4),
});

interface Props {
  chapterId: string;
}

export const QuestionForm = ({ chapterId }: Props) => {
  const queryClient = useQueryClient();

  const { mutate: createQuestion, isPending } = useMutation({
    mutationFn: CREATE_QUESTION,
    onSuccess: async (newQuestion) => {
      const queryKey: QueryKey = ["questions", chapterId];

      await queryClient.cancelQueries({ queryKey });

      queryClient.setQueryData<InfiniteData<QuestionPage, string | null>>(
        queryKey,
        (oldData) => {
          const firstPage = oldData?.pages[0];
          if (firstPage) {
            return {
              pageParams: oldData.pageParams,
              pages: [
                {
                  previousCursor: firstPage.previousCursor,
                  questions: [...firstPage.questions, newQuestion],
                },
                ...oldData.pages.slice(1),
              ],
            };
          }
        },
      );

      queryClient.invalidateQueries({
        queryKey,
        predicate(query) {
          return !query.state.data;
        },
      });
      toast.success("Question created", {
        id: "create-question",
      });
    },
    onError: (error) => {
      toast.error(error.message, {
        id: "create-question",
      });
    },
    onSettled: () => {
      form.reset();
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    toast.loading("Creating question...", {
      id: "create-question",
    });
    createQuestion({
      chapterId,
      question: values.question,
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-end gap-x-3"
      >
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Textarea
                  placeholder="Type your question here..."
                  {...field}
                  className="flex-1"
                  disabled={isPending}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending}>
          Submit
        </Button>
      </form>
    </Form>
  );
};
