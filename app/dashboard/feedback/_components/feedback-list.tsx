import { AssignmentSubmission, Chapter } from "@prisma/client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import { EmptyData } from "@/components/empty-data";

interface FeedbackWithChapter extends AssignmentSubmission {
    chapter: Chapter
}

interface Props {
    feedbacks: FeedbackWithChapter[]
}

export const FeedbackList = ({ feedbacks }: Props) => {

    if (feedbacks.length === 0) {
        return <EmptyData title="No feedback found" />
    }
    
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Chapter</TableHead>
                    <TableHead>Feedback</TableHead>
                    <TableHead>Status</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {feedbacks.map((feedback) => (
                    <TableRow key={feedback.id}>
                        <TableCell>{feedback.chapter.title}</TableCell>
                        <TableCell>{feedback.feedback}</TableCell>
                        <TableCell>
                            <Badge>{feedback.status}</Badge>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}