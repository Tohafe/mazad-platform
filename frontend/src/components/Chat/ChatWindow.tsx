import {  useEffect, useRef, useState } from "react";
import useApiPrivate from "../../hooks/useApiPrivate";
import { useAuth } from "../../context/AuthProvider"



function ChatWindow({ chatId } : Readonly<{chatId:string}>){

    const apiPrivate = useApiPrivate();

    const [messages, setMessages]  = useState<any[]>([]);
    
    const [inputText, setInputText] = useState("");

    const scrollContainerRef = useRef<HTMLDivElement>(null);


    const scrollToBottom = () => {
        setTimeout(() => {
            if (scrollContainerRef.current){
                scrollContainerRef.current.scrollTo({
                    top: scrollContainerRef.current.scrollHeight,
                    behavior: "instant"
                    }
                )
            }
            
        }, 10);
    }
    // SCROLLING TO THE BOTTOM WHEN CHANGE THE CHAT AND NEW MESSAGE
    useEffect(() => scrollToBottom(), [messages, chatId])
    
    const handleSend = async () => {
        if (inputText.trim() === "")
            return ;
        const newMessage = {
            id: crypto.randomUUID(),
            text: inputText,
            sender: "me"
        };
        setMessages([...messages, newMessage]);
        setInputText("");
        try {
            await apiPrivate.post(`/chat/send`, {
                receiverId: chatId,
                content: newMessage.text
            });
        } catch (error){
            console.error("Failed to send message: ",  error);
            // doing some disign for failed send
        }
    };


    const { user } = useAuth();
    useEffect(() => {
        console.log(user);  
        setInputText("");
        setMessages([]);
        // TODO: TRIGGER AXIOS FETCH INBOX FOR THE NEW CHATID
        const fetchHistory = async () => {
            try {
                const response = await apiPrivate.get(`/chat/history/${chatId}`);
                const rawMessages = response.data.content;

                const formattedMessages = rawMessages.map((dto:any) => ({

                    id: dto.id,
                    text: dto.content,
                    sender: dto.senderId.toLowerCase() === user?.id ? "me" : "them"
                }));
                setMessages(formattedMessages.reverse());
            } catch (error){
                console.error("Failed to fetch chat history;", error);
            }
        }
        fetchHistory();
    }
    , [chatId, user?.id, apiPrivate]);

console.log('haha');

    return (
        <div className="flex flex-col w-full h-full bg-white">
            {/* // HEADER */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-white">
                {/* AVATAR */}
                <div className="w-10 h-10 bg-blue-100 flex items-center justify-center rounded-full font-bold text-blue-600">
                    ?
                </div>
                <div>
                    <h3 className="font-semibold text-gray-800">User {chatId}</h3>
                    <p className="text-xs text-green-500"> Online{/*  || Offline TODO: get status somehow*/}</p>
                </div>
            </div>

            {/* // MESSAGE FEED  */}
            <div ref={scrollContainerRef} className="flex-1 overflow-auto p-4 flex flex-col gap-4 bg-gray-50
            [scrollbar-width:thin]
            [scrollbar-color:#E5E7EB_transparent]
            hover:[scrollbar-color:#9CA3AF_transparent]
            "
            >
                {messages?.map((msg) => (
                    <div 
                    key={msg.id}
                    className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[70%] px-4 py-2 rounded-2xl
                            ${
                                msg.sender === 'me'
                                    ? 'bg-blue-600 text-white rounded-br-none ' 
                                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                            }`
                            }
                        >
                            <p className="text-sm wrap-anywhere">{msg.text}</p>
                        </div>
                    </div>
                )
                )}
            </div>
            {/* INPUT AREA */}
            <div className="p-4 bg-white border-t border-gray-200 shrink-0">
                <div className="flex items-center gap-2">
                    {/* TODO: CHANGE IT TO TEXT AREA FOR MULTIPLE PARAGRAPH SUPPORT */}
                    <input 
                        type="text"
                        placeholder="Type amessage..."
                        value={inputText}
                        onChange={(e)=>setInputText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        className="flex-1 px-4 py-2 bg-gray-100 border-transparent rounded-full  focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform"
                    />
                    <button className="bg-blue-500 rounded-full px-4 py-2 text-white font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center"
                            onClick={handleSend}>
                        Send
                    </button>

                </div>
            </div>
        </div>
    )

}

export default ChatWindow;


