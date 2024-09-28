"use client"

import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"

import { useNoticeCreate } from "@/hooks/use-notice"

export const NewButton = () => {
    const { onOpen } = useNoticeCreate()
    return (
        <Button onClick={onOpen}>
            <PlusCircle className="w-5 h-5 mr-2" />
            New
        </Button>
    )
}