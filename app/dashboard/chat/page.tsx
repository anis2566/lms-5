import { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

import { ContentLayout } from "../_components/content-layout";
import { ChatPage } from "./_components/chat-page";

export const metadata: Metadata = {
    title: "LMS | Chat",
    description: "Basic Education Care",
};


const Chat = () => {
    return (
        <ContentLayout title="Chat">
            <Suspense fallback={<Loader2 className="mx-auto my-3 animate-spin" />}>
                <ChatPage />
            </Suspense>
        </ContentLayout>
    )
}

export default Chat
