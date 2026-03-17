export default interface FriendRequestEvent {
    targetId    :string;
    username    : string;
    status      : "PENDDING" | "ACCEPTED" | "DELETED";
}