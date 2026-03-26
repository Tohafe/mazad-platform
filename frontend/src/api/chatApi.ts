import { apiPrivate } from "./axios";

export const getInbox = () => apiPrivate.get('/chat/inbox');
export const markChatRead = (chatId: string) => apiPrivate.patch(`/chat/inbox/${chatId}`);
