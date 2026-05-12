export type UserRole = 'seller' | 'consumer';

export type FreshnessStatus = 'fresh' | 'warn' | 'critical';

export type ProductStatus = 'available' | 'discounted' | 'donation' | 'sold';

export type DonationStatus = 'pending' | 'confirmed' | 'completed' | 'expired';

export type TransactionType = 'purchase' | 'donation_claim';

export type TransactionStatus =
  | 'waiting_pickup'
  | 'waiting_proof'
  | 'proof_submitted'
  | 'completed'
  | 'cancelled';

export type BadgeTier = 'none' | 'bronze' | 'silver' | 'gold' | 'platinum';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  phone: string;
  address: string;
  stallName?: string;      // seller only
  pantiName?: string;      // consumer/recipient only
  badgeStatus: BadgeTier;
  totalDonations: number;
  stockAccuracy: number;   // 0–100
  joinedAt: Date;
}

export interface Warung {
  id: string;
  name: string;
  address: string;
  distanceKm: number;
  phone: string;
  imageEmoji: string;
  rating: number;
  totalMenus: number;
}

export interface Product {
  id: string;
  stallId: string;
  stallName: string;
  name: string;
  category: string;
  normalPrice: number;
  currentPrice: number;
  qty: number;
  cookedAt: Date;
  status: ProductStatus;
  imageEmoji: string;
  imageUrl?: string;       // actual camera photo URL
  isDonation?: boolean;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  productId: string;
  productName: string;
  productEmoji: string;
  stallName: string;
  stallAddress: string;
  stallPhone: string;
  qty: number;
  totalPrice: number;
  status: TransactionStatus;
  proofPhotoUrl?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DonationLog {
  id: string;
  productId: string;
  productName: string;
  productEmoji: string;
  stallName: string;
  stallAddress: string;
  stallPhone: string;
  receiverId: string;
  receiverName: string;
  proofPhotoUrl?: string;
  status: DonationStatus;
  createdAt: Date;
  expiredAt: Date;
  qty: number;
}

export interface AIInsight {
  id: string;
  type: 'surplus_warning' | 'pricing_suggestion' | 'donation_prompt' | 'stock_optimum';
  title: string;
  body: string;
  actionLabel: string;
  urgency: 'low' | 'medium' | 'high';
  relatedProductId?: string;
}
