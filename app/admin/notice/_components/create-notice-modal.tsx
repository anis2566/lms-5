"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

import { useNoticeCreate } from "@/hooks/use-notice";
import { NoticeSchema } from "../schema";
import { CREATE_NOTICE } from "../action";

export const CreateNoticeModal = () => {
    const { open, onClose } = useNoticeCreate();

    const { mutate: createNotice, isPending } = useMutation({
        mutationFn: CREATE_NOTICE,
        onSuccess: (data) => {
            toast(data.success, {
                id: "notice-create",
            })
            onClose();
        },
        onError: (error) => {
            toast(error.message, {
                id: "notice-create",
            })
        },
    })

    const form = useForm<z.infer<typeof NoticeSchema>>({
        resolver: zodResolver(NoticeSchema),
        defaultValues: {
            title: "",
            content: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof NoticeSchema>) => {
        toast.loading("Creating notice...", {
            id: "notice-create",
        });
        createNotice(values);
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Notice</DialogTitle>
                    <DialogDescription>
                        Create a new notice to inform users about important information.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Notice title" {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Content</FormLabel>
                                    <FormControl>
                                        <Textarea rows={5} placeholder="Notice content" {...field} disabled={isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={isPending}>Submit</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
