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

import { useChapter } from "@/hooks/use-chapter";
import { DELETE_CHAPTER } from "../action";

export const DeleteChapterModal = () => {
  const { open, id, onClose, courseId } = useChapter();
  const router = useRouter();

  const { mutate: deleteCategory, isPending } = useMutation({
    mutationFn: DELETE_CHAPTER,
    onSuccess: (data) => {
      router.push(`/admin/course/${courseId}`);
      onClose();
      toast.success(data?.success, {
        id: "delete-chapter",
      });
    },
    onError: (error) => {
      toast.error(error.message, {
        id: "delete-chapter",
      });
    },
  });

  const handleDelete = () => {
    toast.loading("Chapter deleting...", {
      id: "delete-chapter",
    });
    deleteCategory(id);
  };

  return (
    <AlertDialog open={open && !!id}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete chapter
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
