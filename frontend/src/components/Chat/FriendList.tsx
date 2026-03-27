import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useChatApi  from  "../../hooks/useChatApi"
import { useAuth } from "../../context/AuthProvider";
import type { Friend } from "../../types/chat";

interface FriendListProps {
    onMessageFriend: (username: string) => void; 
}

// const FAKE_FRIENDS: Friend[] = [
//     {
//         username: "abde1",
//         userId: "39ee7942-e7d5-4426-b27e-ddbaecd1c81c",
//         thumbnail: "",
//         isOnline: true
//     },
//     {
//         username: "gamil1",
//         userId: "39ee7942-e7d5-4426-b27e-ddbaecd1c81c",
//         thumbnail: "",
//         isOnline: true
//     },
//     {
//         username: "abde1",
//         userId: "39ee7942-e7d5-4426-b27e-ddbaecd1c81c",
//         thumbnail: "",
//         isOnline: true
//     },
//     {
//         username: "gamil1",
//         userId: "39ee7942-e7d5-4426-b27e-ddbaecd1c81c",
//         thumbnail: "",
//         isOnline: true
//     },
//     {
//         username: "abde1",
//         userId: "39ee7942-e7d5-4426-b27e-ddbaecd1c81c",
//         thumbnail: "",
//         isOnline: true
//     },
//     {
//         username: "gamil1",
//         userId: "39ee7942-e7d5-4426-b27e-ddbaecd1c81c",
//         thumbnail: "",
//         isOnline: true
//     },
//     {
//         username: "abde1",
//         userId: "39ee7942-e7d5-4426-b27e-ddbaecd1c81c",
//         thumbnail: "",
//         isOnline: true
//     },
//     {
//         username: "gamil1",
//         userId: "39ee7942-e7d5-4426-b27e-ddbaecd1c81c",
//         thumbnail: "",
//         isOnline: true
//     },
//     {
//         username: "abde1",
//         userId: "39ee7942-e7d5-4426-b27e-ddbaecd1c81c",
//         thumbnail: "",
//         isOnline: true
//     },
//     {
//         username: "gamil1",
//         userId: "39ee7942-e7d5-4426-b27e-ddbaecd1c81c",
//         thumbnail: "",
//         isOnline: true
//     },
//     {
//         username: "abde1",
//         userId: "39ee7942-e7d5-4426-b27e-ddbaecd1c81c",
//         thumbnail: "",
//         isOnline: true
//     },
//     {
//         username: "gamil1",
//         userId: "39ee7942-e7d5-4426-b27e-ddbaecd1c81c",
//         thumbnail: "",
//         isOnline: true
//     },
//     {
//         username: "abde1",
//         userId: "39ee7942-e7d5-4426-b27e-ddbaecd1c81c",
//         thumbnail: "",
//         isOnline: true
//     },
//     {
//         username: "gamil1",
//         userId: "39ee7942-e7d5-4426-b27e-ddbaecd1c81c",
//         thumbnail: "",
//         isOnline: true
//     },
   
// ];

function FriendList({ onMessageFriend }: FriendListProps) {
    const [friends, setFriends] = useState<Friend[]>();
    const [isLoading, setIsLoading] = useState(true);
    const { getFriends } = useChatApi();
    const { user } = useAuth();
    useEffect(() => {
        const fetchFriends = async () => {
            try {
                const response = await getFriends();
                setFriends(response.data);
                console.log(response.data);
                // setFriends(FAKE_FRIENDS);
            } catch (error) {
                console.error("Failed to fetch friends list", error);
            } finally {
                setIsLoading(false);
            }
        };
        if (user?.id){
            fetchFriends();
        }
    }, [user?.id]);

    if (isLoading) {
        return <div className="p-4 text-center text-gray-500">Loading friends...</div>;
    }



    if (friends?.length === 0) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center text-gray-500 text-center p-6 gap-4">
                <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentcolor" className="w-10 h-10">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                    </svg>
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
                                    <img src={friend.thumbnail} alt={friend.username} className="w-full h-full object-cover" />
                                ) : (
                                    <span>{friend.username.charAt(0).toUpperCase()}</span>
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
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                        </svg>
                    </button>
                </div>
            ))}
        </div>
    );
}

export default FriendList;