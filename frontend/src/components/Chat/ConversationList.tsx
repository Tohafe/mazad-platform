// import { Link } from "react-router-dom";

export interface Chat {
    id: string;
    name: string;
    avatar?: string;
    lastMessage: string;
    hasUnreadMessages: boolean;
}

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
                                // add the mark asread request
                                onClick={() => onSelectChat(chat.id) }
                                className={`w-full text-left flex  items-center gap-3 p-4 border-b border-gray-100 cursor-pointer transition-colors
                                 ${activeChatId === chat.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'bg-white hover:bg-gray-50 border-l-4 border-l-transparent'
                                }`}
                                >
                                    <div className="w-12 h-12 bg-gray-200 flex items-center justify-center rounded-full font-bold text-gray-600 text-lg shrink-0 ">
                                    { (chat.avatar)
                                        ? <img src={chat.avatar} className="rounded-full"></img>
                                        : <> {chat.name ? chat.name.charAt(0).toUpperCase(): '?'} </>
                                    }

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
                                <div className="w-20 h-20 rounded-full bg-gray-100 flex  items-center justify-center text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-10 w-10">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                                    </svg>
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