// ============================================
// API Response Types (Backend)
// ============================================

export interface ProductSpecs {
  batch: string;
  condition: string;
  origin: string;
  [key: string]: string; // Allow additional specs
}

export interface ApiProduct {
  id: number;
  categoryId: number;
  title: string;
  description: string;
  images: string[];
  specs: ProductSpecs;
  currentBid: number;
  startingPrice: number;
  startsAt: string;
  endsAt: string;
  createdAt: string;
  updatedAt: string;
  status: 'ACTIVE' | 'ENDED' | 'PENDING';
  sellerId: string;
  shippingInfo: string;
}

export interface ApiResponse<T> {
  data: T;
}

// ============================================
// Product Types
// ============================================

export interface ProductImage {
  src: string;
  alt: string;
}

export interface ProductDetail {
  label: string;
  value: string;
}

export interface Product {
  title: string;
  images: ProductImage[];
  description: string;
  sellerDescription: string;
  details: ProductDetail[];
  shippingInfo: string;
}

// ============================================
// Bid Types
// ============================================

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface Curator {
  name: string;
  image: string;
}

export interface ApiBid {
  id: number;
  auctionId: number;
  bidderId: string;
  amount: number;
  createdAt: string;
}

export interface BidEntry {
  pseudonym: string;
  timeAgo: string;
  amount: string;
}

export interface BidData {
  startsAt: string;
  endsAt: string;
  endTime: string;
  countdown: Countdown;
  timeProgress: number;
  currentBid: string;
  hasReservePrice?: boolean;
  curator: Curator;
  quickBidAmounts: string[];
  minBid: string;
  watchingCount: number;
  recentBids: BidEntry[];
  totalBids: number;
  buyerProtectionFee: string;
  shippingLocation: string;
  trustpilotRating: string;
  trustpilotReviews: string;
}

// ============================================
// Breadcrumb Types
// ============================================

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

// ============================================
// Payment Types
// ============================================

export type PaymentType = 'mastercard' | 'visa' | 'applepay' | 'gpay' | 'paypal' | 'buysafe';

export type SocialPlatform = 'facebook' | 'twitter' | 'pinterest';
