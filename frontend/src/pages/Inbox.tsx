import { act, useEffect, useState } from "react";
import ConversationList from "../components/Chat/ConversationList";
import type { Chat } from "../components/Chat/ConversationList";
import ChatWindow from "../components/Chat/ChatWindow";
import { apiPrivate } from "../api/axios";
import { useWebSocket } from "../context/WebSocketContext";
import { useAuth } from "../context/AuthProvider";


function Inbox(){

    const [activeChatId, setActiveChatId] = useState<string | null>(null);

    const fakeChats : Chat[]=
    [
        {
            id: '014604f7-1668-4b45-8f44-a42096d7da26', name: "Hamzam", lastMessage: "",
            hasUnreadMessages: true
        },
        {
            id: "014604f7-1668-4b45-8f44-a42096d7da28", name: "Hamza", lastMessage: "Can i get the full history of the Item ?",
            hasUnreadMessages: false
        },
        {
            id: "014604f7-1668-4b45-8f44-a42096d7da29", name: "Hamza", lastMessage: "Can i get the full history of the Item ?",
            hasUnreadMessages: false
        }

    ];
    // FETCH REAL CHATS FRON /INBOX ENDPOIT
    const [chats, setChats] = useState<Chat[]>([]);
    useEffect(()=>{
        const fetchInbox = async () => {
            try{

                const response = await apiPrivate.get(`/chat/inbox`);
                const rawChats = response.data.content;
                const formattedChats = rawChats.map((dto:any) => ({
                    id: dto.otherUserId,
                    name: `User ${dto.otherUserId.substring(0, 4)}..`,
                    lastMessage: dto.lastMessage,
                    hasUnreadMessages: dto.hasUnreadMessages
                }));
                setChats(formattedChats);
            }catch(error){
                console.error("Failed to fetch inbox:", error);
            }
        }
        fetchInbox();
    }, [apiPrivate]);

    // MARK AS READ AFTER SELECTING A CHAT
    const handleSelectChat = async (chatId: string) => {
        setActiveChatId(chatId);
        // need to set read boolean
        const selectedChat = chats.find(c => c.id === chatId);
        if (selectedChat?.hasUnreadMessages) {
            setChats(prevChats => prevChats.map(c => 
                    (c.id === chatId) ? {...c, hasUnreadMessages: false} : c 
            ));

            try{
                await apiPrivate.patch(`/chat/read/${chatId}`);
            }catch(e){
                console.error("Failed to mark chat as read:", e);
            }
        }
    }
    // SUBSCRIBING TO THE WEBSOCKET LISTENING TO MESSAGES TOPIC
    const { stompClient, isConnected } = useWebSocket();
    const { user } = useAuth();
    useEffect(() => {
            if (!stompClient || isConnected || user?.id) return ;
            console.log("Subscribing to real-time chat updates...");
            const subscription = stompClient.subscribe('/user/queue/messages', (message) => {
                const incomingMsg = JSON.parse(message.body);
                setChats((prevChats) => {
                    const existingChatIndex = prevChats.findIndex(c => c.id === incomingMsg.senderId);
                    const isCurrentlyOpen = activeChatId === incomingMsg.senderId;
                    let updatedChats = [...prevChats];
                    if (existingChatIndex >= 0) {
                        const existingChat = updatedChats[existingChatIndex];
                        updatedChats.splice(existingChatIndex,  1);
                        updatedChats.unshift({
                            ...existingChat,
                            lastMessage: incomingMsg.content,
                            hasUnreadMessages: !isCurrentlyOpen
                        });
                    }
                    else {
                        updatedChats.unshift({
                            id: incomingMsg.id,
                            name: `User ${incomingMsg.senderId.substring(0,4)}..`,
                            lastMessage: incomingMsg.content,
                            hasUnreadMessages: !isCurrentlyOpen
                        });
                    }
                    return updatedChats;
                });
            });
            return (() => {
                console.log("Unsubscribing from chat updates");
                subscription.unsubscribe();
            });
        }, [stompClient, isConnected, user?.id, activeChatId]
    );

    return (
        // PAGE WRAPPER 
        <div className="flex justify-center items-start pt-6 h-[calc(100vh-180px)] w-full  font-sans px-4">
            {/* MAIN INBOX CONTAINER */}
            <div className="flex w-full max-w-7xl h-[calc(100vh-220px)] min-h-150 bg-white border  border-gray-300  overflow-y-hidden ">
                {/* Left panel */}
                <div className="w-96  flex flex-col border-r border-gray-300">
                    {/* header area for the left panel */}
                    <div className=" p-6 border-b border-gray-300">
                        <h2 className="text-2xl font-bold">Messages</h2>
                    </div>
                    
                    {/* CONVERSTAION LIST */}
                    <ConversationList 
                        chats={chats}
                        activeChatId={activeChatId}
                        onSelectChat={handleSelectChat}
                    />


                </div>
                {/* Right Panel */}
                <div className="flex-1 flex flex-col bg-white">
                    {(activeChatId) ? (
                        <ChatWindow chatId={activeChatId}/>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 gap-4">
                            <div className="w-24 h-24 rounded-full mb-2  bg-blue-50 flex items-center justify-center text-blue-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800">Start a conversation</h3>
                            <p className="text-sm">Select a chat on the left to see your messages here.</p>
                        </div>
                    )}



                </div>

            </div>
        </div>
    );
}


export default Inbox;

