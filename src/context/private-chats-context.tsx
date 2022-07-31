import React from "react";

interface ChatContext {
    allChats: any[];
    populateAllChats(chat: any): void;
    updateChats(message: any): void;
}

export const privateChatsContext = React.createContext<ChatContext>({
    allChats: [],
    populateAllChats: (chats) => {},
    updateChats: (message) => {},
})