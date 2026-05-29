import { Product, SellerStats, Transaction } from '@/types'

// Mock Seller Statistics
export const mockSellerStats: SellerStats = {
  totalWasteSaved: 127.5, // kg
  totalPortionsSaved: 425,
  totalRevenue: 3250000, // Rp
  activeProducts: 8,
}

// Mock AI Predictions
export const mockAIPredictions = [
  {
    id: 'pred-1',
    menuName: 'Ayam Goreng Kalasan',
    predictedSurplus: 4,
    confidence: 0.87,
    recommendation: 'Menu Ayam Goreng berpotensi sisa 4 porsi malam ini. Pertimbangkan untuk menyiapkan promo diskon 20% mulai pukul 19:00.',
    basedOn: 'Analisis pola penjualan 30 hari terakhir',
  },
  {
    id: 'pred-2',
    menuName: 'Nasi Goreng Spesial',
    predictedSurplus: 2,
    confidence: 0.72,
    recommendation: 'Nasi Goreng Spesial cenderung habis terjual. Stok saat ini sudah optimal.',
    basedOn: 'Tren penjualan hari Sabtu',
  },
]

// Mock Products with Dynamic Pricing
export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    sellerId: 'seller-001',
    sellerName: 'Warung Bahagia',
    name: 'Ayam Goreng Kalasan',
    description: 'Ayam goreng dengan bumbu khas Kalasan, renyah di luar lembut di dalam. Disajikan dengan sambal dan lalapan segar.',
    photoUrl: 'https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=500&auto=format&fit=crop&q=60',
    normalPrice: 25000,
    currentPrice: 20000,
    cookedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    totalPortions: 10,
    availablePortions: 4,
    donationStatus: 'sale',
    status: 'active',
    distance: 850,
  },
  {
    id: 'prod-2',
    sellerId: 'seller-001',
    sellerName: 'Warung Bahagia',
    name: 'Nasi Goreng Spesial',
    description: 'Nasi goreng dengan telur, ayam suwir, and sayuran. Bumbu rahasia warung yang sudah terkenal sejak 1995.',
    photoUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&auto=format&fit=crop&q=60',
    normalPrice: 20000,
    currentPrice: 18000,
    cookedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    totalPortions: 8,
    availablePortions: 3,
    donationStatus: 'sale',
    status: 'active',
    distance: 850,
  },
  {
    id: 'prod-3',
    sellerId: 'seller-001',
    sellerName: 'Warung Bahagia',
    name: 'Soto Ayam Kampung',
    description: 'Soto ayam dengan kuah bening, ayam kampung asli, dan bumbu rempah tradisional. Dilengkapi dengan nasi putih hangat.',
    photoUrl: 'https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=500&auto=format&fit=crop&q=60',
    normalPrice: 22000,
    currentPrice: 16500,
    cookedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    totalPortions: 12,
    availablePortions: 5,
    donationStatus: 'sale',
    status: 'active',
    distance: 850,
  },
  {
    id: 'prod-4',
    sellerId: 'seller-001',
    sellerName: 'Warung Bahagia',
    name: 'Gado-Gado Jakarta',
    description: 'Sayuran segar dengan bumbu kacang kental, telur rebus, dan kerupuk. Resep turun temurun keluarga.',
    photoUrl: '/images/sayur2.jpg',
    normalPrice: 18000,
    currentPrice: 13500,
    cookedAt: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(), // 7 hours ago
    totalPortions: 6,
    availablePortions: 2,
    donationStatus: 'sale',
    status: 'active',
    distance: 850,
  },
  {
    id: 'prod-5',
    sellerId: 'seller-001',
    sellerName: 'Warung Bahagia',
    name: 'Pecel Lele Sambal Matah',
    description: 'Lele goreng crispy dengan sambal matah khas Bali. Cocok untuk pecinta pedas!',
    photoUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&auto=format&fit=crop&q=60',
    normalPrice: 23000,
    currentPrice: 11500,
    cookedAt: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(), // 9 hours ago
    totalPortions: 8,
    availablePortions: 3,
    donationStatus: 'donation',
    status: 'active',
    distance: 850,
  },
]

// Mock Transactions
export const mockTransactions: Transaction[] = [
  {
    id: 'trans-1',
    productId: 'prod-1',
    consumerId: 'consumer-001',
    transactionType: 'purchase',
    liabilityAgreement: true,
    claimedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    status: 'completed',
  },
  {
    id: 'trans-2',
    productId: 'prod-5',
    consumerId: 'consumer-002',
    transactionType: 'claim',
    liabilityAgreement: true,
    idProofUrl: '/uploads/id-proof-002.jpg',
    claimedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
  },
]

// Mock Consumer Products (for marketplace)
export const mockMarketplaceProducts: Product[] = [
  ...mockProducts,
  {
    id: 'prod-6',
    sellerId: 'seller-002',
    sellerName: 'Warung Sederhana',
    name: 'Rendang Sapi Padang',
    description: 'Rendang sapi empuk dengan bumbu rempah khas Padang. Dimasak selama 4 jam untuk cita rasa terbaik.',
    photoUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&auto=format&fit=crop&q=60',
    normalPrice: 35000,
    currentPrice: 28000,
    cookedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    totalPortions: 15,
    availablePortions: 6,
    donationStatus: 'sale',
    status: 'active',
    distance: 1200,
  },
  {
    id: 'prod-7',
    sellerId: 'seller-002',
    sellerName: 'Warung Sederhana',
    name: 'Bakso Malang Jumbo',
    description: 'Bakso sapi asli ukuran jumbo dengan kuah kaldu sapi segar. Dilengkapi mie, tahu, dan pangsit goreng.',
    photoUrl: 'https://images.unsplash.com/photo-1547928576-a4a33237ecd3?w=500&auto=format&fit=crop&q=60',
    normalPrice: 25000,
    currentPrice: 22500,
    cookedAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
    totalPortions: 20,
    availablePortions: 8,
    donationStatus: 'sale',
    status: 'active',
    distance: 1200,
  },
  {
    id: 'prod-8',
    sellerId: 'seller-003',
    sellerName: 'Dapur Ibu Siti',
    name: 'Nasi Uduk Betawi',
    description: 'Nasi uduk dengan lauk lengkap: ayam goreng, telur balado, tempe orek, dan kerupuk. Porsi kenyang!',
    photoUrl: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=60',
    normalPrice: 20000,
    currentPrice: 15000,
    cookedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    totalPortions: 12,
    availablePortions: 4,
    donationStatus: 'sale',
    status: 'active',
    distance: 650,
  },
  {
    id: 'prod-9',
    sellerId: 'seller-003',
    sellerName: 'Dapur Ibu Siti',
    name: 'Sayur Asem Jakarta',
    description: 'Sayur asem segar dengan jagung manis, kacang panjang, labu siam, dan melinjo. Kuah asam segar yang menyegarkan.',
    photoUrl: '/images/sayur3.jpg',
    normalPrice: 15000,
    currentPrice: 7500,
    cookedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    totalPortions: 10,
    availablePortions: 5,
    donationStatus: 'donation',
    status: 'active',
    distance: 650,
  },
]

// Helper function to get products by seller
export function getProductsBySeller(sellerId: string): Product[] {
  return mockProducts.filter((product) => product.sellerId === sellerId)
}

// Helper function to get active products count
export function getActiveProductsCount(sellerId: string): number {
  return mockProducts.filter(
    (product) => product.sellerId === sellerId && product.status === 'active'
  ).length
}

// Helper function to simulate dynamic price updates
export function updateProductPrice(product: Product): Product {
  const hoursSinceCooked = (Date.now() - new Date(product.cookedAt).getTime()) / (1000 * 60 * 60)
  const maxHours = 12
  const decayRate = 0.5 // 50% maximum discount
  const progress = Math.min(hoursSinceCooked / maxHours, 1)
  const discount = decayRate * progress
  const newPrice = product.normalPrice * (1 - discount)

  // Ensure minimum 50% of original price
  const finalPrice = Math.max(newPrice, product.normalPrice * 0.5)

  return {
    ...product,
    currentPrice: Math.round(finalPrice),
  }
}
