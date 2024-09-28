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

import { useAttachment } from "@/hooks/use-attachment";
import { DELETE_ATTACHMENT } from "../action";

export const DeleteAttachmentModal = () => {
  const { open, id, onClose } = useAttachment();

  const { mutate: deleteAttachment, isPending } = useMutation({
    mutationFn: DELETE_ATTACHMENT,
    onSuccess: (data) => {
      onClose();
      toast.success(data?.success, {
        id: "delete-attachment",
      });
    },
    onError: (error) => {
      toast.error(error.message, {
        id: "delete-attachment",
      });
    },
  });

  const handleDelete = () => {
    toast.loading("Attachment deleting...", {
      id: "delete-attachment",
    });
    deleteAttachment(id);
  };

  return (
    <AlertDialog open={open && !!id}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            attachment and remove the data from your servers.
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
