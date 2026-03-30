import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthProvider";
import { useWebSocket } from "../context/WebSocketContext";
import useChatApi from "./useChatApi";
import type { Chat } from "../types/chat.ts";

function useChatInbox(activeChatId: string | null){

    const { user } = useAuth();
    
    
    const { getInbox, getUserDetails, markChatRead } = useChatApi();
    // FETCH CHATS FRON /INBOX ENDPOIT
    const fetchUserDetails = async (userId: string) => {
        try {

            const response = await getUserDetails(userId);
            const userData = response.data;
            
            setChats(prev => prev.map( c => 
                            c.id === userId 
                            ? { ...c, name: userData.username, avatar: userData.avatarUrl} 
                            : c
                            
            ));
        } catch(err) {
            console.error(`could not fetch info for user ${userId}`, err);
        }
        
    }

    const [chats, setChats] = useState<Chat[]>([]);
    useEffect(()=>{
        const fetchInbox = async () => {
            try{
                
                const response = await getInbox();
                const rawChats = response.data.content;
                const formattedChats = rawChats.map((dto:any) => ({
                    id: dto.otherUserId,
                    name: `User ${dto.otherUserId.substring(0, 4)}..`,
                    lastMessage: dto.lastMessage,
                    hasUnreadMessages: dto.hasUnreadMessages
                }));
                console.log("message:", formattedChats);
                setChats(formattedChats);
                
                formattedChats.forEach( (chat: Chat) => {
                    fetchUserDetails(chat.id);
                })
            }catch(error){
                console.error("Failed to fetch inbox:", error);
            }
        }
        if (user?.id)
        {
            fetchInbox();
        }
    }, [user?.id]);

    // MARK AS READ AFTER SELECTING A CHAT
    const handleSelectChat = async (chatId: string) => {
        // need to set read boolean
        const selectedChat = chats.find(c => c.id === chatId);
        if (selectedChat?.hasUnreadMessages) {
            setChats(prevChats => prevChats.map(c => 
                    (c.id === chatId) ? {...c, hasUnreadMessages: false} : c 
            ));

            try{
                await markChatRead(chatId);
            }catch(e){
                console.error("Failed to mark chat as read:", e);
            }
        }
        }
    // SUBSCRIBING TO THE WEBSOCKET LISTENING TO MESSAGES TOPIC
    const { stompClient, isConnected } = useWebSocket();
    useEffect(() => {
            console.log("status check", {
                hasStompClient: !!stompClient,
                userId: user?.id,
                isConnected: isConnected,
                fullUserObject: user
            });
            if (!stompClient || !isConnected || !user?.id){
                if (stompClient && !isConnected){
                    
                    console.log("waiting for websocket connection...");
                }
                return ;
            } 
            console.log("Subscribing to real-time chat updates...");
            const subscription = stompClient.subscribe('/user/queue/messages', (message) => {
                const incomingMsg = JSON.parse(message.body);
                const conversationPartnerId = 
                    incomingMsg.senderId.toLowerCase() === (user?.id || "").toLowerCase()
                        ? incomingMsg.receiverId
                        : incomingMsg.senderId;
                const isCurrentlyOpen = activeChatId?.toLowerCase() === conversationPartnerId.toLowerCase();
                const didISendThis = incomingMsg.senderId.toLowerCase() === (user?.id || "").toLowerCase();
                if (isCurrentlyOpen && !didISendThis) {
                    markChatRead(conversationPartnerId).catch(e => console.error("Failed to mark read:", e));
                }
                setChats((prevChats) => {
        
                    const existingChatIndex = prevChats.findIndex(c => c.id.toLowerCase() === conversationPartnerId.toLowerCase());
                            
                    let updatedChats = [...prevChats];
                    if (existingChatIndex >= 0) {
                        const existingChat = updatedChats[existingChatIndex];
                        updatedChats.splice(existingChatIndex,  1);
                        updatedChats.unshift({
                            ...existingChat,
                            lastMessage: incomingMsg.content,
                            hasUnreadMessages: !didISendThis && !isCurrentlyOpen
                        });
                    }
                    else {
                        updatedChats.unshift({
                            id: conversationPartnerId,
                            name: `User ${conversationPartnerId.substring(0,4)}..`,
                            lastMessage: incomingMsg.content,
                            hasUnreadMessages: !didISendThis && !isCurrentlyOpen
                        });
                        fetchUserDetails(conversationPartnerId);
                    }
                    return updatedChats;
                });
            });
            return (() => {
                if (stompClient && stompClient.connected && subscription) {
                    console.log("Unsubscribing from chat updates");
                    subscription.unsubscribe();
                }
            });
        }, [stompClient, isConnected, activeChatId, user?.id]
    );

    // a hook for send button to move chat to top
    const moveChatToTop = (chatId: string, lastMessage: string) => {
        setChats((prevChats) => {
            const updatedChats = [...prevChats];
            const index = updatedChats.findIndex(c => c.id.toLowerCase() === chatId.toLowerCase());

            if (index === -1) {
                updatedChats.unshift({
                    id: chatId,
                    name: "Loading ...",
                    lastMessage: lastMessage,
                    hasUnreadMessages: false
                });
                fetchUserDetails(chatId);
            }else {
                const targetChat = updatedChats[index]; 
                updatedChats.splice(index, 1);
                updatedChats.unshift({
                    ...targetChat, 
                    lastMessage: lastMessage,
                    hasUnreadMessages: false
                }); 
            }

            return updatedChats;
        });
    }

    return {
        chats,
        handleSelectChat,
        moveChatToTop
    };
}

export default useChatInbox;