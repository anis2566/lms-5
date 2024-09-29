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

import { useQuestion } from "@/hooks/use-question";
import { DELETE_QUESTION } from "../action";

export const DeleteQuestionModal = () => {
    const { open, id, onClose } = useQuestion();

    const { mutate: deleteCategory, isPending } = useMutation({
        mutationFn: DELETE_QUESTION,
        onSuccess: (data) => {
            onClose();
            toast.success(data?.success, {
                id: "delete-question",
            });
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "delete-question",
            });
        },
    });

    const handleDelete = () => {
        toast.loading("Question deleting...", {
            id: "delete-question",
        });
        deleteCategory(id);
    };

    return (
        <AlertDialog open={open && !!id}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete question
                        and remove the data from your servers.
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
