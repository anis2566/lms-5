"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"

import { useQuestionAnswer } from "@/hooks/use-question-answer"
import { CREATE_ANSWER } from "../action"

const formSchema = z.object({
    answer: z.string().min(4, "required"),
})

export const AnswerModal = () => {
    const { open, onClose, questionId } = useQuestionAnswer()

    const { mutate: createAnswer, isPending } = useMutation({
        mutationFn: CREATE_ANSWER,
        onSuccess: (data) => {
            toast.success(data.success, {
                id: "answer-modal",
            })
            onClose()
        },
        onError: (error) => {
            toast.error(error.message, {
                id: "answer-modal",
            })
        }
    })

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            answer: "",
        },
    })

    const onSubmit = (values: z.infer<typeof formSchema>) => {
        toast.loading("Submitting answer...", {
            id: "answer-modal",
        })
        createAnswer({ id: questionId, answer: values.answer })
    }

    return (
        <Dialog open={open && !!questionId} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Answer</DialogTitle>
                    <DialogDescription>
                        Provide answer for this question
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="answer"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Answer</FormLabel>
                                    <FormControl>
                                        <Textarea rows={7} {...field} placeholder="Enter your answer here" disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isPending}>Submit Answer</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
