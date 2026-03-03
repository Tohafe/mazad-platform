import axios from 'axios';
import type { ApiBid } from '../types';

// TODO: Replace with dynamic auth token from auth context
const AUTH_TOKEN = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJ1c2VySWQiOiJiZjQ5MmMyZi0wZDFjLTRlNzItODlkZS0zOGMxN2I5MTVmYWYiLCJ1c2VybmFtZSI6Im5ub29vIiwiZW1haWwiOiJub25vb0BnbWFpbC5jb20iLCJpYXQiOjE3NzI0OTg2MDAsImV4cCI6MTc3MjQ5OTUwMH0.2C53lzOxNIUZEj-m8mpcojgmlIQ6Vexg-59rg4RZZO1ZoFV5KLBnSsUZzkh0zy0hw0Z7N_2XT7oyw8Bh-71Riw';

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
