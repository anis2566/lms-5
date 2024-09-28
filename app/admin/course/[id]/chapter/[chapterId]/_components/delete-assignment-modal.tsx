"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

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
import { useAssignment } from "@/hooks/use-assignment";
import { DELETE_ASSIGNMENT } from "../action";

export const DeleteAssignmentModal = () => {
  const { open, id, onClose } = useAssignment();

  const { mutate: deleteAssignment, isPending } = useMutation({
    mutationFn: DELETE_ASSIGNMENT,
    onSuccess: (data) => {
      onClose();
      toast.success(data?.success, {
        id: "delete-assignment",
      });
    },
    onError: (error) => {
      toast.error(error.message, {
        id: "delete-assignment",
      });
    },
  });

  const handleDelete = () => {
    toast.loading("Assignment deleting...", {
      id: "delete-assignment",
    });
    deleteAssignment(id);
  };

  return (
    <AlertDialog open={open && !!id}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            assignment and remove the data from your servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={isPending}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} disabled={isPending}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
