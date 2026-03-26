import useApiPrivate from "./useApiPrivate";

const useChatApi = () => {
    const apiPrivate = useApiPrivate();

    const getInbox = () => apiPrivate.get('/chat/inbox');
    const getChatHistory = (chatId: string) => apiPrivate.get(`/chat/history/${chatId}`);
    const sendMessage = (receiverId: string, content: string) => apiPrivate.post('/chat/send', { receiverId, content });
    const markChatRead = (chatId: string) => apiPrivate.patch(`/chat/read/${chatId}`);


    const getUserDetails = (userId: string) => apiPrivate.get(`/profile/users/${userId}`);

    const getFriends = () => apiPrivate.get('/friends');
    const getFriendRequests = () => apiPrivate.get('/friends/requests');
    const acceptFriendRequest = (username: string) => apiPrivate.post(`/friends/request/${username}`);
    
    return {
        getInbox,
        getChatHistory,
        sendMessage,
        markChatRead,
        getUserDetails,
        getFriends,
        getFriendRequests,
        acceptFriendRequest
    };
}

export default useChatApi;