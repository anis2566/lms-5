import { Metadata } from "next";

import { ContentLayout } from "../_components/content-layout";
import { ChatPage } from "./_components/chat-page";

export const metadata: Metadata = {
    title: "LMS | Chat",
    description: "Basic Education Care",
};


const Chat = () => {
    return (
        <ContentLayout title="Chat">
            <ChatPage />
        </ContentLayout>
    )
}

export default Chat
