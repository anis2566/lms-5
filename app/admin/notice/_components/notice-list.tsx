"use client"

import { Notice } from "@prisma/client";
import { Trash2 } from "lucide-react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

import { useNoticeDelete } from "@/hooks/use-notice";

interface NoticeListProps {
    notices: Notice[];
}

export const NoticeList = ({ notices }: NoticeListProps) => {
    const { onOpen } = useNoticeDelete();
    return (
        <Table>
            <TableHeader>
                <TableHead>Title</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Actions</TableHead>
            </TableHeader>
            <TableBody>
                {notices.map((notice) => (
                    <TableRow key={notice.id}>
                        <TableCell>{notice.title}</TableCell>
                        <TableCell>{notice.content}</TableCell>
                        <TableCell>
                            <TooltipProvider delayDuration={0}>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Button variant="ghost" size="icon" onClick={() => onOpen(notice.id)}>
                                            <Trash2 className="h-5 w-5 text-rose-500" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Delete
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}