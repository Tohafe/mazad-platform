import axios from 'axios';
import type { ApiBid } from '../types';

// TODO: Replace with dynamic auth token from auth context
const AUTH_TOKEN = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJ1c2VySWQiOiJiODFmOTRhNi04OTNhLTRmZGQtOGMzYS1jZDlhMzcyY2RjNzMiLCJ1c2VybmFtZSI6Im5vb25vIiwiZW1haWwiOiJub25vQGdtYWlsLmNvbSIsImlhdCI6MTc3MjQ1OTM5NywiZXhwIjoxNzcyNDYwMjk3fQ.YmalAZwWvYjJ2jY5eg1BG0KytaWtIydlWG_A6m3CXk5hk9Kwsu-QUWeqFGFaU67tGUUJbtrHkENoYIjMLKmzww';

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
