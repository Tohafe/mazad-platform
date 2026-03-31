import { useEffect, useState } from "react";
import useApiPrivate from "../../hooks/useApiPrivate";
import { Link } from "react-router-dom";
import PLACEHOLDER from "./../../assets/avatar.jpg";
import toast from "react-hot-toast";
import { HiOutlineChatBubbleLeftEllipsis, HiOutlineUsers } from "react-icons/hi2";

export interface Friend {
    username: string;
    userId: string;
    thumbnail: string;
    onlineStatus: boolean;
}

interface FriendListProps {
    onMessageFriend: (username: string) => void; 
}

function FriendList({ onMessageFriend }: FriendListProps) {
    const apiPrivate = useApiPrivate();
    const [friends, setFriends] = useState<Friend[]>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await apiPrivate.get("/friends");
                setFriends(response.data);
            } catch  {
                toast.error("An unexpected error getting friends list");
            } finally {
                setIsLoading(false);
            }
        };

        fetchFriends();
    }, [apiPrivate]);

    if (isLoading) {
        return <div className="p-4 text-center text-gray-500">Loading friends...</div>;
    }



    if (friends?.length === 0) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center text-gray-500 text-center p-6 gap-4">
                <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <HiOutlineUsers 
                    className="w-10 h-10"
                    />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">No friends yet</h3>
                <p className="text-sm text-gray-500 mt-1">Accept requests to see friends here.</p>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto
            [scrollbar-width:thin]
            [scrollbar-color:#E5E7EB_transparent]
            hover:[scrollbar-color:#9CA3AF_transparent]
            "
            >
            {friends?.map((friend) => (
                <div
                    key={friend.username}
                    className="w-full flex items-center justify-between p-4 border-b border-gray-100 bg-white hover:bg-gray-50 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-12 h-12 bg-gray-200 flex items-center justify-center rounded-full font-bold text-gray-600 text-lg shrink-0 overflow-hidden">
                                {friend.thumbnail ? ( 
                                    <img src={friend.thumbnail}
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

                            <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${friend.onlineStatus ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <Link to={`/profile/${friend.username}`}>
                                <h3 className="font-semibold text-gray-800">{friend.username}</h3>
                            </Link>
                            <p className="text-xs text-gray-500">{friend.onlineStatus ? 'Online' : 'Offline'}</p>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => onMessageFriend(friend.username)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                        title="Send Message"
                    >
                       
                       <HiOutlineChatBubbleLeftEllipsis 
                       className="w-6 h-6"/>

                    </button>
                </div>
            ))}
        </div>
    );
}

export default FriendList;