export default interface User{
    id: string | null;
    username: string | null;
    email: string | null;
    firstName: string | null;
    lastName: string | null;
    bio: string | null;
    avatarUrl: string | null;
    avatarThumbnailUrl: string | null;
    avatarImageId: string | null;
    phoneNumber: string | null;
    address: string | null;
    city: string | null;
    country: string | null;
    isComplete: boolean;
}