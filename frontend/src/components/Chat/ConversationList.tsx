import type { Chat } from "../../types/chat.ts";
import PLACEHOLDER from "./../../assets/avatar.jpg";
import { HiOutlineInboxArrowDown } from "react-icons/hi2";


interface ConversationListProps {
    chats: Chat[] ;
    activeChatId: string | null;
    onSelectChat: (id: string) => void;
}


function ConversationList( {chats, activeChatId, onSelectChat}: ConversationListProps ) {
    return (
        chats?.length > 0 ?
                        (
                        <div className=" flex-1 overflow-y-auto">
                            {chats.map((chat) => (
                                <button 
                                key={chat.id}
                                onClick={() => onSelectChat(chat.id) }
                                className={`w-full text-left flex  items-center gap-3 p-4 border-b border-gray-100 cursor-pointer transition-colors
                                 ${activeChatId === chat.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'bg-white hover:bg-gray-50 border-l-4 border-l-transparent'
                                }`}
                                >
                                    <div className="w-12 h-12 bg-gray-200 flex items-center justify-center rounded-full font-bold text-gray-600 text-lg shrink-0 ">
                                    
                                    {chat.avatar ? (
                                            <img 
                                                src={chat.avatar} 
                                                className="w-full h-full object-cover rounded-full"
                                                onError={(e) => {
                                                    e.currentTarget.src = PLACEHOLDER;
                                                }}
                                            />
                                        ) : (
                                            <img 
                                                src={PLACEHOLDER}
                                                className="rounded-full w-full h-full object-cover"
                                            />
                                        )}

                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <h3 className=" font-semibold text-gray-800 ">{chat.name || 'Unknown User'}</h3>
                                        <p className="text-sm text-gray-500 truncate">{chat.lastMessage || 'No messages yet...'}</p>
                                    </div>
                                    {chat.hasUnreadMessages && (
                                            <div className=" flex items-center w-3 h-3 bg-blue-500 rounded-full shrink-0"></div>
                                    )}

                                </button>
                            ))}

                        </div>
                        ):(
                            <div className="flex flex-1 flex-col items-center justify-center text-gray-500 text-center p-6 gap-4">
                                <div className="w-20 h-20 rounded-full bg-blue-50 flex  items-center justify-center text-blue-500">
                                    <HiOutlineInboxArrowDown  
                                    className="w-10 h-10"/>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800" >No chats available </h3>
                                <p className="text-sm text-gray-500 mt-1 max-w-96">
                                    When you contact a seller on Mazad, your messages will appear here.
                                </p>
                            </div>
                        )
                
    );
}

export default ConversationList;