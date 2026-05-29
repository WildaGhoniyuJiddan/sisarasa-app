// User and Authentication Types
export type UserRole = 'seller' | 'consumer'

export type AccountStatus = 'active' | 'suspended' | 'pending'

export interface User {
  id: string
  username: string
  email: string
  role: UserRole
  accountStatus: AccountStatus
  locationGeo?: {
    latitude: number
    longitude: number
  }
  createdAt: string
  updatedAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

// Product Types
export type DonationStatus = 'sale' | 'donation'

export type ProductStatus = 'active' | 'claimed' | 'completed' | 'expired' | 'sold_out'

export interface Product {
  id: string
  sellerId: string
  sellerName: string
  name: string
  description: string
  photoUrl: string
  normalPrice: number
  currentPrice: number
  cookedAt: string
  totalPortions: number
  availablePortions: number
  donationStatus: DonationStatus
  status: ProductStatus
  distance?: number // in meters
}

// Transaction Types
export type TransactionType = 'purchase' | 'claim'

export type TransactionStatus = 'pending' | 'completed' | 'cancelled'

export interface Transaction {
  id: string
  productId: string
  consumerId: string
  transactionType: TransactionType
  liabilityAgreement: boolean
  idProofUrl?: string
  receiptProofUrl?: string
  claimedAt: string
  completedAt?: string
  status: TransactionStatus
}

// Form Types
export interface LoginFormData {
  emailOrUsername: string
  password: string
  role: UserRole
}

export interface RegisterFormData {
  username: string
  email: string
  password: string
  confirmPassword: string
  role: UserRole
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// AI Analysis Types
export interface FoodAnalysisResult {
  name: string
  description: string
  nutrition: string
  timestamp: string
}

// Stats Types
export interface SellerStats {
  totalWasteSaved: number // in kg
  totalPortionsSaved: number
  totalRevenue: number
  activeProducts: number
}

export interface ConsumerStats {
  totalClaims: number
  totalPurchases: number
  totalSavings: number
}
