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
import { Textarea } from "@/components/ui/textarea";
import { MultiSelect } from "@/components/ui/multi-select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { CategorySchema } from "../../schema";
import { CATEGORY_TAG_LIST } from "@/constant";
import { CREATE_CATEGORY } from "../action";

export const CategoryForm = () => {
  const router = useRouter();

  const form = useForm<z.infer<typeof CategorySchema>>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
      tags: [],
    },
  });

  const { mutate: createCategory, isPending } = useMutation({
    mutationFn: CREATE_CATEGORY,
    onSuccess: (data) => {
      form.reset();
      toast.success(data?.success, {
        id: "create-category",
      });
      router.push("/admin/category");
    },
    onError: (error) => {
      toast.error(error.message, {
        id: "create-category",
      });
    },
  });

  const onSubmit = async (values: z.infer<typeof CategorySchema>) => {
    toast.loading("Category creating...", {
      id: "create-category",
    });
    createCategory(values);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Category</CardTitle>
        <CardDescription>
          Add a new category to organize your content.
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
                      <div className="relative mt-2">
                        <Image
                          alt="Upload"
                          width={120}
                          height={120}
                          className="mx-auto rounded-md object-contain"
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
              {isPending ? "Submitting..." : "Submit"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
