"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useCourse } from "@/hooks/use-course";
import { DELETE_COURSE } from "../action";

export const DeleteCourseModal = () => {
  const { open, id, onClose } = useCourse();
  const router = useRouter();

  const { mutate: deleteCategory, isPending } = useMutation({
    mutationFn: DELETE_COURSE,
    onSuccess: (data) => {
      router.push("/admin/course");
      onClose();
      toast.success(data?.success, {
        id: "delete-course",
      });
    },
    onError: (error) => {
      toast.error(error.message, {
        id: "delete-course",
      });
    },
  });

  const handleDelete = () => {
    toast.loading("Course deleting...", {
      id: "delete-course",
    });
    deleteCategory(id);
  };

  return (
    <AlertDialog open={open && !!id}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete course
            and remove the data from your servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-destructive hover:bg-destructive/80"
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
