import { useQuery } from '@tanstack/react-query';
import { useUserApi, type PublicUserProfile } from './useShouldRemove';

export interface Seller {
  name: string;
  image: string;
}

/** Hook to fetch seller public profile by userId */
export function useSeller(sellerId: string | undefined) {
  const { getPublicProfile } = useUserApi();

  return useQuery({
    queryKey: ['seller', sellerId],
    queryFn: () => getPublicProfile(sellerId!),
    enabled: !!sellerId,
    select: (data: PublicUserProfile): Seller => ({
      name: data.username ?? 'Unknown Seller',
      image: data.avatarUrl ?? data.thumbnail ?? '',
    }),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
}

export default useSeller;
