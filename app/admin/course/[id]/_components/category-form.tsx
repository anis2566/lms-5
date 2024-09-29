"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState, useCallback } from "react";
import { Course } from "@prisma/client";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { cn } from "@/lib/utils";
import { GET_CATEGORIES, UPDATE_COURSE } from "../action";

interface CategoryFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  categoryId: z.string().min(1),
});

export const CategoryForm = ({ initialData, courseId }: CategoryFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = useCallback(() => {
    setIsEditing((current) => !current);
  }, []);

  const { data: categories } = useQuery({
    queryKey: ["get-categories-for-course"],
    queryFn: async () => {
      const res = await GET_CATEGORIES();
      return res.categories;
    },
    staleTime: 60 * 60 * 1000,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: initialData.categoryId || "",
    },
  });

  const { mutate: updateCourse, isPending } = useMutation({
    mutationFn: UPDATE_COURSE,
    onSuccess: (data) => {
      setIsEditing(false);
      toast.success(data?.success, {
        id: "update-course",
      });
    },
    onError: (error) => {
      toast.error(error.message, {
        id: "update-course",
      });
    },
  });

  const onSubmit = useCallback(async (values: z.infer<typeof formSchema>) => {
    toast.loading("Course updating...", {
      id: "update-course",
    });
    updateCourse({
      id: courseId,
      values: { ...initialData, categoryId: values.categoryId },
    });
  }, [updateCourse, courseId, initialData]);

  return (
    <div className="mt-6 rounded-md border bg-card p-4">
      <div className="flex items-center justify-between font-medium">
        Category
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p
          className={cn(
            "mt-2 text-sm",
            !initialData.categoryId && "italic text-slate-500",
          )}
        >
          {categories?.find(
            (category) => category.id === initialData.categoryId,
          )?.name || "No Category"}
        </p>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 space-y-4"
          >
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isPending}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories?.map((category, i) => (
                          <SelectItem value={category.id} key={i}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={isPending} type="submit">
                {isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
