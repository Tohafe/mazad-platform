import axios from 'axios';
import type { ApiBid } from '../types';

// TODO: Replace with dynamic auth token from auth context
const AUTH_TOKEN = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJ1c2VySWQiOiJkOGExNTQxNC0yYTMxLTQyY2EtOTY4NC1mMWFiZWQ0YzYxNmMiLCJ1c2VyTmFtZSI6ImpqamoiLCJlbWFpbCI6ImhtemphYWFAZ21haWwuY29tIiwiaWF0IjoxNzcyMjgzMDQyLCJleHAiOjE3NzIyODM5NDJ9.CycftDc7a8C32RymhOG8ZvhENb1zW_5bSxx61ZMun1VX6UNFQh89G-qPDvHdQh5Vn74py0tK8Kqeg_8pviAUZQ';

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface PlaceBidRequest {
  auctionId: number;
  amount: number;
}

export const bidApi = {
  /** Fetch all bids for an auction, newest first */
  getBids: async (auctionId: number): Promise<ApiBid[]> => {
    const response = await api.get(`/api/v1/bids/${auctionId}`, {
      headers: { Authorization: AUTH_TOKEN },
    });
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
  },

  placeBid: async ({ auctionId, amount }: PlaceBidRequest): Promise<void> => {
    await api.post(`/api/v1/bids/${auctionId}`, { amount }, {
      headers: { Authorization: AUTH_TOKEN },
    });
  },
};
