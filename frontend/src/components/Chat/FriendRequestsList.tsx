import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useChatApi from "../../hooks/useChatApi"
import { useAuth } from "../../context/AuthProvider";

import type { FriendRequest } from "../../types/chat";

// const FAKE_REQUESTS: FriendRequest[] = [
//     {
//         username: "abde1",
//         // userId: "39ee7942-e7d5-4426-b27e-ddbaecd1c81c",
//         thumbnail: "",
//         status: 'PENDING'
//     },
//     {
//         username: "gamil1",
//         // userId: "39ee7942-e7d5-4426-b27e-ddbaecd1c81c",
//         thumbnail: "",
//         status: "PENDING"
//     }
   
// ];

function FriendRequestsList() {
    const [requests, setRequests] = useState<FriendRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);

    const { getFriendRequests, acceptFriendRequest } = useChatApi();
    const { user } = useAuth();
    // FETCH REQUESTS 
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await getFriendRequests();
                setRequests(response.data);
                
                // setRequests([
                //     { username: "abde1", thumbnail: "", status: "PENDING" },
                //     { username: "abde1", thumbnail: "", status: "PENDING" },
                //     { username: "abde1", thumbnail: "", status: "PENDING" },
                //     { username: "abde1", thumbnail: "", status: "PENDING" },
                //     { username: "abde1", thumbnail: "", status: "PENDING" },
                //     { username: "abde1", thumbnail: "", status: "PENDING" },
                //     { username: "abde1", thumbnail: "", status: "PENDING" },
                //     { username: "abde1", thumbnail: "", status: "PENDING" },
                //     { username: "abde1", thumbnail: "", status: "PENDING" },
                //     { username: "abde1", thumbnail: "", status: "PENDING" },
                //     { username: "abde1", thumbnail: "", status: "PENDING" },
                //     { username: "abde1", thumbnail: "", status: "PENDING" },
                //     { username: "abde1", thumbnail: "", status: "PENDING" },
                //     { username: "abde1", thumbnail: "", status: "PENDING" },
                //     { username: "abde1", thumbnail: "", status: "PENDING" },
                //     { username: "abde1", thumbnail: "", status: "PENDING" },
                //     { username: "abde1", thumbnail: "", status: "PENDING" },
                //     { username: "abde1", thumbnail: "", status: "PENDING" },
                //     { username: "abde1", thumbnail: "", status: "PENDING" },
                //     { username: "abde1", thumbnail: "", status: "PENDING" },
                //     { username: "abde1", thumbnail: "", status: "PENDING" },
                //     { username: "abde1", thumbnail: "", status: "PENDING" },
                //     { username: "abde1", thumbnail: "", status: "PENDING" },
                //     { username: "abde1", thumbnail: "", status: "PENDING" },
                //     { username: "abde1", thumbnail: "", status: "PENDING" },
                //     { username: "vintage_seller", thumbnail: "https://i.pravatar.cc/150?img=32", status: "PENDING" }
                // ]);
            
            } catch (error) {
                console.error("Failed to fetch friend requests", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRequests();
    }, [user?.id]);

    const handleAccept = async (username: string) => {
        setProcessingId(username);
        try {
            await acceptFriendRequest(username);
            setRequests(prev => prev.filter(r => r.username !== username));
        } catch (error) {
            console.error(`Failed to accept request from ${username}`, error);
        } finally {
            setProcessingId(null);
        }
    };

    if (isLoading) {
        return <div className="p-4 text-center text-gray-500">Loading requests...</div>;
    }

if (!requests || requests.length === 0) {
        return (
            <div className="flex flex-1 flex-col items-center justify-center text-gray-500 gap-3">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <line x1="19" y1="8" x2="19" y2="14" />
                        <line x1="22" y1="11" x2="16" y2="11" />
                    </svg>
                </div>
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-800">No pending requests</h3>
                    <p className="text-sm text-gray-500 mt-1">You're all caught up!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 overflow-y-auto
            [scrollbar-width:thin]
            [scrollbar-color:#E5E7EB_transparent]
            hover:[scrollbar-color:#9CA3AF_transparent]"
            >
            {requests.map((request) => (
                <div
                    key={request.username}
                    className="w-full flex items-center justify-between p-4 border-b border-gray-100 bg-white hover:bg-gray-50 transition-colors"
                >
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-12 h-12 bg-gray-200 flex items-center justify-center rounded-full font-bold text-gray-600 text-lg shrink-0 overflow-hidden">
                            {request.thumbnail && request.thumbnail !== "default_thumbnail_url" ? (
                                <img src={request.thumbnail} alt={request.username} className="w-full h-full object-cover" />
                            ) : (
                                <span>{request.username.charAt(0).toUpperCase()}</span>
                            )}
                        </div>
                        <div className="flex-1 overflow-hidden min-w-0">
                            <Link to={`/profile/${request.username}`}>
                                <h3 className="font-semibold text-gray-800 truncate">{request.username}</h3>
                            </Link>
                            <p className="text-xs text-gray-500">Wants to connect</p>
                        </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2 shrink-0">
                        <button
                            onClick={() => handleAccept(request.username)}
                            disabled={processingId === request.username}
                            className="px-3 py-1 bg-blue-500 text-white text-sm font-medium rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-wait"
                        >
                            Accept
                        </button>
  
                    </div>
                </div>
            ))}
        </div>
    );
}

export default FriendRequestsList;