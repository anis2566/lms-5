"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Pencil } from "lucide-react";
import { useState, useCallback } from "react";
import { Course } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { cn, formatPrice } from "@/lib/utils";
import { UPDATE_COURSE } from "../action";

interface PriceFormProps {
  initialData: Course;
  courseId: string;
}

const formSchema = z.object({
  price: z.coerce.number().min(0, "Price must be a positive number"),
});

export const PriceForm = ({ initialData, courseId }: PriceFormProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const toggleEdit = useCallback(() => setIsEditing((current) => !current), []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: initialData?.price || undefined,
    },
  });

  const { mutate: updateCourse, isPending: isUpdating } = useMutation({
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

  const onSubmit = useCallback(
    (values: z.infer<typeof formSchema>) => {
      toast.loading("Updating course...", {
        id: "update-course",
      });
      updateCourse({
        id: courseId,
        values: { ...initialData, price: values.price },
      });
    },
    [updateCourse, courseId, initialData]
  );

  return (
    <div className="mt-6 rounded-md border bg-card p-4">
      <div className="flex items-center justify-between font-medium">
        Price
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? "Cancel" : <><Pencil className="mr-2 h-4 w-4" /> Edit</>}
        </Button>
      </div>

      {!isEditing && (
        <p className={cn("mt-2 text-sm", !initialData.price && "italic text-slate-500")}>
          {initialData.price ? formatPrice(initialData.price) : "No price"}
        </p>
      )}

      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      disabled={isUpdating}
                      placeholder="Set a price for your course"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={isUpdating} type="submit">
                {isUpdating ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
