export interface Chat {
    id: string;
    name: string;
    avatar?: string;
    lastMessage: string;
    hasUnreadMessages: boolean;
}

export interface Friend {
    username: string;
    userId: string;
    thumbnail: string;
    onlineStatus: boolean;
}

export interface FriendRequest {
    username: string;
    thumbnail: string;
    status: string;
}