import ConversationList from "../components/Chat/ConversationList";
import ChatWindow from "../components/Chat/ChatWindow";
import FriendList  from "../components/Chat/FriendList"
import FriendRequestsList from "../components/Chat/FriendRequestsList";
import useUserApi from "../hooks/useUserApi";
import useChatInbox from "../hooks/useChatInbox";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
type ViewType = 'messages' | 'friends' | 'requests';

function Inbox(){

    const { userId } = useParams<string>();
    const navigate = useNavigate();
    
    const [ActiveView, setActiveView] = useState<ViewType>('messages');
    const [activeChatId, setActiveChatId] = useState<string | null>(userId || null);

    const { chats, handleSelectChat, moveChatToTop } = useChatInbox(activeChatId);
    
    useEffect(()=> {
        if (userId){
            setActiveChatId(userId);
            setActiveView('messages');
            handleSelectChat(userId);
        } else {
            setActiveChatId(null);
        }
    }, [userId]);


    // HANDLE OPENING NEW CHAT WITH A FRIEND (FROM FRIEND LIST)
    const   { getPublicProfile } = useUserApi();
    const handleMessageFriend = async (friendUsername: string) => {
        getPublicProfile(friendUsername)
            .then((response) => {
                const   friendId = response.userId;
                if (friendId){
                    setActiveChatId(friendId);
                    setActiveView('messages');
                    navigate(`/inbox/${friendId}`);
                } 
            })
            .catch (() => {
            }) 
    }
    
    const onChatClick = (chatId: string) => {
        navigate(`/inbox/${chatId}`);
    }

    return (
        // PAGE WRAPPER 
        <div className="flex justify-center items-start pt-6  w-full  font-sans px-4">
            {/* MAIN INBOX CONTAINER */}
            <div className="flex w-full max-w-7xl  min-h-150 bg-white border h-[75vh]  border-gray-300  overflow-hidden ">
                {/* Left panel */}
                <div className={`${activeChatId ? 'hidden md:flex' : 'flex'} w-full md:w-1/3 md:max-w-87.5 md:min-w-80 flex-col border-r border-gray-300 shrink-0 min-h-0`}>
                    {/* header area for the left panel */}
                    <div className=" p-6 border-b border-gray-300">
                        <h2 className="text-2xl font-bold mb-4">Messages</h2>
                        <div className="flex gap-2">
                            <button
                                onClick={() => {setActiveView('messages'); navigate('/inbox');}}
                                className={`flex-1 px-3 py-2  font-medium text-sm transition-colors ${
                                    ActiveView === 'messages' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                >
                                    Chats
                                </button>
                            <button
                                onClick={() => { setActiveView('friends'); navigate('/inbox');}}
                                className={`flex-1 px-3 py-2 font-medium text-sm transition-colors ${
                                    ActiveView === 'friends' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                >
                                    Connections
                                </button>
                            <button
                                onClick={() => {setActiveView('requests'); navigate('/inbox');}}
                                className={`flex-1 px-3 py-2 font-medium text-sm transition-colors ${
                                    ActiveView === 'requests' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                >
                                    Requests
                                </button>
                        </div>
                    </div>
                    
                    {/* CONVERSTAION LIST */}
                    {ActiveView === 'messages' && (
                        <ConversationList 
                        chats={chats}
                        activeChatId={activeChatId}
                        onSelectChat={onChatClick}
                        />
                    )}
                    {/* FRIEND LIST */}
                    {ActiveView === 'friends' && (
                        <FriendList 
                        onMessageFriend={handleMessageFriend}
                        />
                    )}
                    {ActiveView === 'requests' && (
                        <FriendRequestsList
                        />
                    )}
                </div>
                {/* Right Panel */}
                <div className={`${!activeChatId ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-white w-full min-w-0 min-h-0`}>
                    {(activeChatId) ? (
                        <ChatWindow 
                        chatId={activeChatId}
                        onMessageSent={(msg) => moveChatToTop(activeChatId, msg)}       
                        onBack={() => navigate('/inbox')}    
                         />
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

