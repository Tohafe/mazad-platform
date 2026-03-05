import { useCallback } from 'react';
import useApiPrivate from './useApiPrivate';
import type { ApiBid } from '../types';

export interface PlaceBidRequest {
  auctionId: number;
  amount: number;
}

/** Hook that provides bid API methods using authenticated axios instance */
export function useBidApi() {
  const api = useApiPrivate();

  /** Fetch all bids for an auction, newest first */
  const getBids = useCallback(async (auctionId: number): Promise<ApiBid[]> => {
    const response = await api.get(`/bids/${auctionId}`);
    const result = response.data;
    if (!result) return [];
    // Handle { json: [...] }, { data: [...] }, or direct array formats
    const rawBids = Array.isArray(result)
      ? result
      : (typeof result === 'object' && 'json' in result)
        ? result.json
        : (typeof result === 'object' && 'data' in result)
          ? result.data
          : [];
    // Normalize API fields to match ApiBid type
    const bids: ApiBid[] = rawBids.map((b: any) => ({
      id: b.id,
      auctionId: b.auctionId,
      bidderId: b.bidderId,
      amount: b.amount,
      createdAt: b.createdAt,
    }));
    return bids;
  }, [api]);

  const placeBid = useCallback(async ({ auctionId, amount }: PlaceBidRequest): Promise<void> => {
    await api.post(`/bids/${auctionId}`, { amount });
  }, [api]);

  return { getBids, placeBid };
}

export default useBidApi;
