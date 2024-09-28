"use client"

import { Chapter, Course, Question, QuestionAnswer, User } from "@prisma/client"
import { BookOpen, Check, FileQuestion } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { IconBadge } from "@/components/icon-badge"
import { Badge } from "@/components/ui/badge"

import { useQuestionAnswer } from "@/hooks/use-question-answer"


interface ChapterWithCourse extends Chapter {
    course: Course
}

interface QuestionWithUser extends Question {
    user: User
    chapter: ChapterWithCourse;
    answers: QuestionAnswer[]
}

interface Props {
    questions: QuestionWithUser[]
}

export const QuestionList = ({ questions }: Props) => {
    const { onOpen } = useQuestionAnswer();

    return (
        <div className="space-y-5">
            {
                questions.map((question) => (
                    <div key={question.id} className="border p-2 rounded-md space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-x-2">
                                <Avatar>
                                    <AvatarImage src={question.user.image ?? ""} />
                                    <AvatarFallback>
                                        {question.user.name?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <h1 className="text-md font-semibold">{question.user.name}</h1>
                                    <p className="text-sm text-muted-foreground">
                                        {question.createdAt.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            <Button size="sm" onClick={() => onOpen(question.id)}>
                                Reply
                            </Button>
                        </div>
                        <div className="space-y-2 border p-2 rounded-md">
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={BookOpen} variant="default" size="sm" />
                                <p>Course & Chapter</p>
                            </div>
                            <p className="text-md">{question.chapter.course.title}</p>
                            <div className="flex items-center gap-x-2">
                                <Badge variant="outline">{(question.chapter?.position ?? -1) + 1}</Badge>
                                <p className="text-sm text-muted-foreground">
                                    {question.chapter?.title}
                                </p>
                            </div>
                        </div>
                        <div className="space-y-2 border p-2 rounded-md">
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={FileQuestion} variant="default" size="sm" />
                                <p>Question</p>
                            </div>
                            <div>
                                <p className="text-md">{question.question}</p>
                            </div>
                        </div>
                        <div className="space-y-2 border p-2 rounded-md">
                            <div className="flex items-center gap-x-2">
                                <IconBadge icon={Check} variant="default" size="sm" />
                                <p>Answer</p>
                            </div>
                            <div className="space-y-2">
                                {
                                    question.answers.map((answer) => (
                                        <p key={answer.id} className="text-sm text-muted-foreground">{answer.answer}</p>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}