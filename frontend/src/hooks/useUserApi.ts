import { useCallback } from 'react';
import useApiPrivate from './useApiPrivate';

export interface PublicUserProfile {
  username: string;
  bio: string | null;
  avatarUrl: string | null;
  thumbnail: string | null;
  country: string | null;
}

/** Hook that provides user API methods using authenticated axios instance */
export function useUserApi() {
  const api = useApiPrivate();

  /** Get public profile by user ID */
  const getPublicProfile = useCallback(async (userId: string): Promise<PublicUserProfile> => {
    const response = await api.get<PublicUserProfile>(`/profile/users/${userId}`);
    return response.data;
  }, [api]);

  return { getPublicProfile };
}

export default useUserApi;
