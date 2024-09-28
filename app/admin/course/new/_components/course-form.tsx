"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
  FormItem,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { CREATE_COURSE } from "../action";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "required",
  }),
});

export const CourseForm = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });

  const { mutate: createCourse, isPending } = useMutation({
    mutationFn: CREATE_COURSE,
    onSuccess: (data) => {
      form.reset();
      toast.success(data?.success, {
        id: "create-course",
      });
      router.push(`/admin/course/${data?.id}`);
    },
    onError: (error) => {
      toast.error(error.message, {
        id: "create-course",
      });
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    toast.loading("Course creating...", {
      id: "create-course",
    });
    createCourse(values.title);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Name your course</CardTitle>
        <CardDescription>
          What would you like to name your course? Don&apos;t worry, you can
          change this later.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course title</FormLabel>
                  <FormControl>
                    <Input disabled={isPending} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button type="submit" disabled={isPending}>
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
