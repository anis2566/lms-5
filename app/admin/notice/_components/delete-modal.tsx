"use client"

import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

import { useNoticeDelete } from "@/hooks/use-notice";
import { AlertDialog, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel, AlertDialogContent } from "@/components/ui/alert-dialog";

import { DELETE_NOTICE } from "../action";

export const DeleteNoticeModal = () => {
    const { open, id, onClose } = useNoticeDelete();

    const { mutate: deleteNotice, isPending } = useMutation({
        mutationFn: DELETE_NOTICE,
        onSuccess: (data) => {
            toast.success(data.success, {
                id: "notice-delete",
            });
            onClose();
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "notice-delete",
            });
        },
    });

    const handleDelete = () => {
        toast.loading("Deleting...", {
            id: "notice-delete",
        });
        deleteNotice(id);
    }

    return (
        <AlertDialog open={open && !!id}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>This action cannot be undone. This will permanently delete this notice and remove your data from our servers.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} disabled={isPending}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}