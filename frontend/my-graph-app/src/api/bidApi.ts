import axios from 'axios';
import type { ApiBid } from '../types';

// TODO: Replace with dynamic auth token from auth context
const AUTH_TOKEN = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJ1c2VySWQiOiI3MzM3OWFiNy0xM2VlLTQxOGQtYmQ5MC1hNjdhNjA1NmI0MGEiLCJ1c2VybmFtZSI6Im5vb25vbyIsImVtYWlsIjoibm9ub29vQGdtYWlsLmNvbSIsImlhdCI6MTc3MjMyODE3MCwiZXhwIjoxNzcyMzI5MDcwfQ.WmAiPT3Lkhb46lOfqBRfShdN2QIu8aMWwYMuBKZ_wfIZr4KYyewDYvv1Ca-kpnR_ahX_QDSNdMicnV6SLWKuhw';

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
