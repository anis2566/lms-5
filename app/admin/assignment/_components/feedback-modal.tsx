"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useFeedbackSubmission } from "@/hooks/use-assignment-submission"
import { SubmissionStatus } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UPDATE_STATUS } from "../action"

const formSchema = z.object({
    feedback: z.string().min(4, "Feedback is required"),
    status: z
        .nativeEnum(SubmissionStatus)
        .refine((val) => Object.values(SubmissionStatus).includes(val), {
            message: "required",
        }),
})

export const FeedbackModal = () => {
    const { open, onClose, id } = useFeedbackSubmission()

    const { mutate: updateStatus, isPending } = useMutation({
        mutationFn: UPDATE_STATUS,
        onSuccess: (data) => {
            toast.success(data.success, {
                id: "feedback-modal",
            })
            onClose()
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "feedback-modal",
            })
        }
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            feedback: "",
            status: undefined,
        },
    })

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        toast.loading("Submitting feedback...", {
            id: "feedback-modal",
        })
        updateStatus({ id, status: values.status, feedback: values.feedback })
    }

    return (
        <Dialog open={open && !!id} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Feedback</DialogTitle>
                    <DialogDescription>
                        Provide feedback for this submission
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="feedback"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Feedback</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} placeholder="Enter your feedback here" disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isPending}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(SubmissionStatus).slice(1).map((status) => (
                                                <SelectItem key={status} value={status}>
                                                    {status}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isPending}>Submit Feedback</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
