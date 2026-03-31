import {  useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthProvider"
import { useWebSocket } from "../../context/WebSocketContext";
import { Link, useNavigate } from "react-router-dom";
import useChatApi from "../../hooks/useChatApi";
import  { toast } from "react-hot-toast";
import PLACEHOLDER from "./../../assets/avatar.jpg";
import { IoChevronBackSharp } from "react-icons/io5";




function ChatWindow({ chatId , onMessageSent, onBack} : Readonly<{chatId:string, onMessageSent: (msg: string) => void, onBack: () => void }>, ){
    
    const navigate = useNavigate();

    const [messages, setMessages]  = useState<any[]>([]);
    
    const [inputText, setInputText] = useState("");

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const { sendMessage, getChatHistory, getUserDetails } = useChatApi();

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

    useEffect(() => scrollToBottom(), [messages, chatId])
    
    const handleSend = async () => {
        const trimmedInput = inputText.trim();
        if (trimmedInput === "")
            return ;
        if (trimmedInput.length > 500) {
            toast.error(`Message is too long! (${trimmedInput.length}/500)`);
            return ;
        }
        setInputText("");
        try {
            const response = await sendMessage(chatId, trimmedInput);            
            const realMessage = response.data;
            setMessages(prev => {
                if (prev.some(msg => msg.id === realMessage.id)) return prev;
                return [...prev, {
                    id: realMessage.id,
                    text: realMessage.content || trimmedInput,
                    sender: "me"
                }];
            });
            onMessageSent(trimmedInput);
        } catch (error: any){
            setInputText(trimmedInput);
            const errorMessage = error.response?.data?.message || error.response?.data?.detail || "";
            if (error.response?.status == 429)
                toast.error("Sending too many requests");
            else
                toast.error(`An unexpected error during send, ${errorMessage}`);
        }
    };

    const { user } = useAuth();
    useEffect(() => {
        setInputText("");
        setMessages([]);
        const fetchHistory = async () => {
            try {
                const response = await getChatHistory(chatId);
                const rawMessages = response.data.content;

                const formattedMessages = rawMessages.map((dto:any) => ({

                    id: dto.id,
                    text: dto.content,
                    sender: dto.senderId.toLowerCase() === user?.id ? "me" : "them"
                }));
                setMessages(formattedMessages.reverse());
            } catch (error : any) {
                const errorMessage = error.response?.data?.message || error.response?.data?.detail || "";
                toast.error(`An unexpected error while getting chat history, ${errorMessage}`);
            }
        }
        fetchHistory();
    }
    , [chatId, user?.id]);



    const {stompClient, isConnected } = useWebSocket();
    useEffect(() => {
        if (!stompClient || !isConnected || !chatId) {
            return ;
        }
        const subscription = stompClient.subscribe('/user/queue/messages', (message) => {
            const incomingMsg = JSON.parse(message.body);
            const isRelevent  = incomingMsg.senderId.toLowerCase() === chatId.toLowerCase() || incomingMsg.receiverId.toLowerCase() === chatId.toLowerCase();
            if (isRelevent){

                setMessages((prev) => {
                    if (prev.some(msg => msg.id === incomingMsg.id))
                         return prev;
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
            }
        });
    }, [stompClient, isConnected, chatId, user?.id]);


    const [otherUser, setOtherUser] = useState<{username:string, avatar?:string} | null>(null);
    useEffect(() => {
        const getOtherUserInfo = async () => {
            try{
                const response = await getUserDetails(chatId);
                setOtherUser({
                    username: response.data.username,
                    avatar: response.data.avatarUrl
                });
            } catch{
                setOtherUser({ username: `User ${chatId.substring(0,4)}` });
                toast.error("This user does not exist"); 
                navigate('/inbox');
            }
        };
        getOtherUserInfo();
    }, [chatId]);

    const [imageFailed, setImageFailed] = useState(false);
    useEffect (()=> {
        setImageFailed(false);
    }, [chatId]);

    useEffect(() => {
            const adjustHeight = () => {
                if (textareaRef.current){
                    textareaRef.current.style.height = 'auto';
                    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
                }
            }
            
            adjustHeight();
            window.addEventListener('resize', adjustHeight);
            return (() => window.removeEventListener('resize', adjustHeight));
    }
    , [inputText])
    return (
        <div className="flex flex-col w-full h-full bg-white">

            <div className="flex items-center gap-3 p-4 border-b border-gray-200 bg-white">
                <button
                    onClick={onBack}
                    className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    title="Back to messages"
                >
                    <IoChevronBackSharp 
                    className="w-6 h-6"/>
                </button>

                <div className="w-10 h-10 bg-blue-100 flex items-center justify-center rounded-full font-bold text-blue-600">
                    {otherUser?.avatar && !imageFailed ? (
                        <img
                        src={otherUser?.avatar}
                        alt={`${otherUser?.username}'s avatar`}
                        className="w-full h-full object-cover rounded-full"
                        onError={() => setImageFailed(true)}
                        />
                    ): (
                        <img 
                        src={PLACEHOLDER}
                        className="w-full h-full object-cover rounded-full"
                        />
                    )}
                </div>
                <div>
                    <Link to={`/profile/${otherUser?.username}`}>
                        <h3 className="font-semibold text-gray-800"> {otherUser ? otherUser.username : "Loading.." }</h3>
                    </Link>
                </div>
            </div>


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
                            <p className="text-lg   wrap-break-word whitespace-pre-wrap">{msg.text}</p>
                        </div>
                    </div>
                )
                )}
            </div>

            <div className="p-4 bg-white border-t border-gray-200 shrink-0">
                <div className="flex items-center gap-2">
                    <textarea 
                        ref={textareaRef}
                        placeholder="Type amessage..."
                        value={inputText}
                        onChange={(e)=>setInputText(e.target.value)}
                        onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey){
                                    e.preventDefault();
                                    handleSend();
                                }
                            }
                        }
                        rows={1}
                        className="flex-1 px-4 py-2.5 bg-gray-100 border-transparent rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none overflow-y-auto max-h-32 min-h-11
                        [scrollbar-width:thin] [scrollbar-color:#E5E7EB_transparent] hover:[scrollbar-color:#9CA3AF_transparent]"
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



