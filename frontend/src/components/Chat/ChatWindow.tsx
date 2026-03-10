import {  useEffect, useRef, useState } from "react";
import useApiPrivate from "../../hooks/useApiPrivate";
import { useAuth } from "../../context/AuthProvider"
import { useWebSocket } from "../../context/WebSocketContext";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid'



function ChatWindow({ chatId , onMessageSent} : Readonly<{chatId:string, onMessageSent: (msg: string) => void }>, ){

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
            id: uuidv4(),
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
            // MOVE THE CHAT TO THE TOP
            onMessageSent(newMessage.text);
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
    // SUBSCRIBING TO THE WEBSOCKET 
    const {stompClient, isConnected } = useWebSocket();
    useEffect(() => {
        if (!stompClient || !isConnected || !chatId) {
            if (stompClient && !isConnected){
                console.log("waiting for websocket connection in chatWindow...");
            }
            return ;
        }
        console.log("Subscribing to real-time chat updates in chatWindow...");

        const subscription = stompClient.subscribe('/user/queue/messages', (message) => {
            const incomingMsg = JSON.parse(message.body);

            const isRelevent  = incomingMsg.senderId.toLowerCase() === chatId.toLowerCase() || incomingMsg.receiverId.toLowerCase() === chatId.toLowerCase();
            if (isRelevent){
                setMessages((prev) => {
                    return [...prev, {
                        id: incomingMsg.id,
                        text: incomingMsg.content,
                        sender: incomingMsg.senderId === user?.id ? "me" : "them"
                    }];
                });
            }
        });
        return (() =>{
            if (stompClient && stompClient.connected && subscription){
                subscription.unsubscribe();
                console.log("Unsubscribing from chat updates");
            }
        });
    }, [stompClient, isConnected]);


    const [otherUser, setOtherUser] = useState<{username:string, avatar?:string} | null>(null);
    useEffect(() => {
        const getOtherUserInfo = async () => {
            try{
                const response = await apiPrivate.get(`/profile/users/${chatId}`);
                setOtherUser({
                    username: response.data.username,
                    avatar: response.data.avatarUrl
                });
            } catch(error){
                setOtherUser({ username: `User ${chatId.substring(0,4)}` });
            }
        };
        getOtherUserInfo();
    }, [chatId])
console.log('haha');

    return (
        <div className="flex flex-col w-full h-full bg-white">
            {/* // HEADER */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-white">
                {/* AVATAR */}
                <div className="w-10 h-10 bg-blue-100 flex items-center justify-center rounded-full font-bold text-blue-600">
                    {otherUser?.avatar ? (
                        <img
                        src={otherUser.avatar}
                        alt={otherUser.username.charAt(0).toUpperCase()}
                        className="w-full h-full object-cover rounded-full"
                        />
                    ): (
                        <span>{otherUser?.username.charAt(0).toUpperCase()}</span>
                    )}
                </div>
                <div>
                    <Link to={`/profile/${otherUser?.username}`}>
                        <h3 className="font-semibold text-gray-800"> {otherUser ? otherUser.username : "Loading.." }</h3>
                    </Link>
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


