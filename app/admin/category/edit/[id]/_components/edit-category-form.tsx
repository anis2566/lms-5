"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { UploadButton } from "@/lib/uploadthing";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { Trash } from "lucide-react";
import { Category } from "@prisma/client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { CATEGORY_TAG_LIST } from "@/constant";
import { CategorySchema } from "../../../schema";
import { EDIT_CATEGORY } from "../action";

interface Props {
  category: Category;
}

export const EditCategoryForm = ({ category }: Props) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof CategorySchema>>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: category.name || "",
      description: category.description || "",
      imageUrl: category.imageUrl || "",
      tags: category.tags || [],
    },
  });

  const { mutate: editCategory, isPending } = useMutation({
    mutationFn: EDIT_CATEGORY,
    onSuccess: (data) => {
      router.push("/admin/category");
      toast.success(data?.success, {
        id: "eidt-category",
      });
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message, {
        id: "eidt-category",
      });
    },
  });

  const onSubmit = async (values: z.infer<typeof CategorySchema>) => {
    toast.loading("Category updating...", {
      id: "eidt-category",
    });
    editCategory({ values, id: category.id });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Category</CardTitle>
        <CardDescription>
          Update the details of the existing category
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="grid flex-1 items-start gap-4 md:gap-8"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter category name"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell about category"
                      className="resize-none"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Image</FormLabel>
                  <FormControl>
                    {form.getValues("imageUrl") ? (
                      <div className="relative mt-2 w-[120px]">
                        <Image
                          alt="Upload"
                          width={120}
                          height={120}
                          className="rounded-md object-contain"
                          src={form.getValues("imageUrl")}
                        />
                        <TooltipProvider delayDuration={0}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                className="absolute right-0 top-0"
                                variant="ghost"
                                size="icon"
                                onClick={() => form.setValue("imageUrl", "")}
                                disabled={isPending}
                                type="button"
                              >
                                <Trash className="text-rose-500" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Remove Image</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    ) : (
                      <UploadButton
                        endpoint="imageUploader"
                        onClientUploadComplete={(res) => {
                          field.onChange(res[0].url);
                          toast.success("Image uploaded");
                        }}
                        onUploadError={(error: Error) => {
                          toast.error("Image upload failed");
                        }}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <MultiSelect
                      options={CATEGORY_TAG_LIST}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      placeholder="Select options"
                      variant="inverted"
                      animation={2}
                      maxCount={3}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isPending}
              className="w-full max-w-[130px]"
            >
              {isPending ? "Updating..." : "Update"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
