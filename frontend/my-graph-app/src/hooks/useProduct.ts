import { useQuery } from '@tanstack/react-query';
import { productApi } from '../api';
import type { ApiProduct, ProductImage, ProductDetail, BidData, Countdown } from '../types';

// Transform API images to component format
function transformImages(images: string[]): ProductImage[] {
  return (images ?? []).map((src, index) => ({
    src,
    alt: `Product image ${index + 1}`,
  }));
}

// Transform API specs to details format
function transformSpecs(specs: Record<string, string>): ProductDetail[] {
  const labelMap: Record<string, string> = {
    batch: 'Batch',
    condition: 'Condition',
    origin: 'Origin',
  };

  return Object.entries(specs ?? {}).map(([key, value]) => ({
    label: labelMap[key] || key.charAt(0).toUpperCase() + key.slice(1),
    value,
  }));
}

// Calculate countdown from endsAt date
function calculateCountdown(endsAt: string): Countdown {
  const endDate = new Date(endsAt);
  const now = new Date();
  const diff = endDate.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
}

// Calculate time progress (0-100)
function calculateTimeProgress(startsAt: string, endsAt: string): number {
  const startDate = new Date(startsAt);
  const endDate = new Date(endsAt);
  const now = new Date();

  const totalDuration = endDate.getTime() - startDate.getTime();
  const elapsed = now.getTime() - startDate.getTime();

  if (elapsed <= 0) return 0;
  if (elapsed >= totalDuration) return 100;

  return Math.round((elapsed / totalDuration) * 100);
}

// Format end time for display
function formatEndTime(endsAt: string): string {
  const endDate = new Date(endsAt);
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const isToday = endDate.toDateString() === now.toDateString();
  const isTomorrow = endDate.toDateString() === tomorrow.toDateString();

  const timeStr = endDate.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });

  if (isToday) return `Today ${timeStr}`;
  if (isTomorrow) return `Tomorrow ${timeStr}`;
  
  return endDate.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}

// Format currency
function formatCurrency(amount: number): string {
  return `¤ ${amount.toFixed(2)}`;
}

// Generate quick bid amounts
function generateQuickBidAmounts(currentBid: number): string[] {
  const increment = 10;
  return [
    formatCurrency(currentBid + increment),
    formatCurrency(currentBid + increment * 2),
    formatCurrency(currentBid + increment * 3),
  ];
}

// Transform API product to BidData format
function transformToBidData(product: ApiProduct): BidData {
  const endsAt = product.endsAt ?? new Date().toISOString();
  const startsAt = product.startsAt ?? new Date().toISOString();
  const currentBid = product.currentBid ?? 0;

  const countdown = calculateCountdown(endsAt);
  const timeProgress = calculateTimeProgress(startsAt, endsAt);
  
  // Generate estimate range based on starting price (mock data)
  const startingPrice = product.startingPrice ?? currentBid;
  const estimateRange = {
    min: formatCurrency(startingPrice * 1.5),
    max: formatCurrency(startingPrice * 2.5),
  };
  
  return {
    startsAt,
    endsAt,
    endTime: formatEndTime(endsAt),
    countdown,
    timeProgress,
    currentBid: formatCurrency(currentBid),
    hasReservePrice: false, // Not in API, defaulting to false
    curator: {
      name: 'Ger van Oers', // Mock curator name
      image: 'https://placehold.co/40x40/4f46e5/ffffff?text=GO',
    },
    quickBidAmounts: generateQuickBidAmounts(currentBid),
    minBid: `${formatCurrency(currentBid + 10)} or up`,
    watchingCount: 0, // Not in API - placeholder
    recentBids: [], // Not in API - placeholder
    totalBids: 6, // Mock total bids
    buyerProtectionFee: '8% + ¤ 3',
    shippingLocation: 'Morocco', // Could be derived from user location
    trustpilotRating: '4.4',
    trustpilotReviews: '127239',
  };
}

// Main hook to fetch product data
export function useProduct(productId: number) {
  return useQuery({
    queryKey: ['product', productId],
    queryFn: async () => {
      const data = await productApi.getProduct(productId);
      if (!data) {
        throw new Error('No product data received');
      }
      return data;
    },
    select: (data) => ({
      // Raw API data
      raw: data,
      
      // Transformed for MainContent component
      product: {
        title: data.title ?? 'Untitled Product',
        images: transformImages(data.images),
        description: data.description ?? '',
        sellerDescription: data.description ?? '',
        details: transformSpecs(data.specs),
        shippingInfo: data.shippingInfo ?? 'No shipping information available',
      },
      
      // Transformed for BidSidebar component
      bidData: transformToBidData(data),
    }),
  });
}

// Export utility functions for reuse
export {
  transformImages,
  transformSpecs,
  calculateCountdown,
  calculateTimeProgress,
  formatEndTime,
  formatCurrency,
  generateQuickBidAmounts,
  transformToBidData,
};
