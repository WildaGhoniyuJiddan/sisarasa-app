/**
 * SisaRasa Frontend — API Service Layer
 * ========================================
 * Modul service terpusat untuk berkomunikasi dengan backend FastAPI
 * di http://localhost:8000/api/v1 menggunakan native fetch.
 *
 * Semua fungsi mengembalikan data bersih (typed) jika sukses,
 * atau melempar Error dengan pesan deskriptif jika gagal.
 *
 * Penggunaan:
 *   import { getProducts, createProduct, analyzeFood } from '@/services/api'
 */

// ============================================================
// Base Configuration
// ============================================================

const BASE_URL: string =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// ============================================================
// TypeScript Interfaces
// ============================================================

/** Produk makanan surplus dari koleksi Firestore `products` (Frontend camelCase). */
export interface Product {
  id: string;
  name: string;
  normalPrice: number;   // Memetakan base_price dari backend
  currentPrice: number;  // Memetakan current_price dari backend
  hppFloor?: number;     // Memetakan hpp_floor dari backend
  sellerId: string;      // Memetakan store_id dari backend
  status: 'active' | 'deleted';
  cookedAt: string;      // Memetakan created_at dari backend
  photoUrl?: string;     // URL foto produk surplus
  portions?: number;
  availablePortions?: number;
}

/** Skema respons mentah dari API Backend (snake_case). */
export interface ApiProduct {
  id: string;
  name: string;
  base_price: number;
  current_price: number;
  hpp_floor: number;
  store_id: string;
  status: string;
  created_at: string | null;
  photo_url?: string | null;
  portions?: number;
  available_portions?: number;
}

/** Toko/merchant dari koleksi Firestore `stores`. */
export interface Store {
  id: string;
  store_name: string;
  latitude: number;
  longitude: number;
  address: string;
  created_at?: string | null;
}

/** Detail hasil Smart Visual Entry dari Gemini Vision. */
export interface SmartEntryResult {
  food_name: string;
  description: string;
  freshness_estimation: "Fresh" | "Good" | "Critical" | "Spoiled" | string;
  confidence_score: number;
  normal_price: number;
  portions: number;
  discount_percentage: number;
  suggested_selling_price: number;
  pricing_justification: string;
  photo_url?: string | null;
}

// ============================================================
// Backend Response Wrappers
// ============================================================

/** Response wrapper dari endpoint Products (detail). */
interface ProductDetailResponse {
  success: boolean;
  message: string;
  product: ApiProduct | null;
}

/** Response wrapper dari endpoint Products (list). */
interface ProductListResponse {
  success: boolean;
  count: number;
  products: ApiProduct[];
}

/** Response wrapper dari endpoint Stores. */
interface StoreDetailResponse {
  success: boolean;
  message: string;
  store: Store | null;
}

/** Response wrapper dari endpoint Vision analyze-food (Smart Entry). */
interface SmartEntryResponse {
  success: boolean;
  analysis: SmartEntryResult | null;
  raw_response: string | null;
  message: string;
}

// ============================================================
// Payload Types (Request Bodies)
// ============================================================

/** Data yang dibutuhkan untuk membuat produk baru (tanpa auto-generated fields). */
export type CreateProductPayload = Omit<Product, "id" | "cookedAt">;

/** Data yang dibutuhkan untuk membuat toko baru (tanpa auto-generated fields). */
export type CreateStorePayload = Omit<Store, "id" | "created_at">;

// ============================================================
// Data Transformer / Mappers
// ============================================================

/**
 * Mengubah data product snake_case dari API Backend menjadi camelCase untuk Frontend.
 */
export function mapToFrontendProduct(p: ApiProduct): Product {
  return {
    id: p.id,
    name: p.name,
    normalPrice: p.base_price,
    currentPrice: p.current_price,
    hppFloor: p.hpp_floor,
    sellerId: p.store_id || 'unknown',
    status: (p.status === 'deleted' ? 'deleted' : 'active') as 'active' | 'deleted',
    cookedAt: p.created_at || new Date().toISOString(),
    photoUrl: p.photo_url || undefined,
    portions: p.portions || 1,
    availablePortions: p.available_portions !== undefined ? p.available_portions : (p.portions || 1),
  };
}

/**
 * Mengubah data product camelCase dari Frontend menjadi snake_case untuk payload API Backend.
 */
export function mapToBackendProduct(p: Partial<Product>): Partial<ApiProduct> {
  const backend: Partial<ApiProduct> = {};
  if (p.id !== undefined) backend.id = p.id;
  if (p.name !== undefined) backend.name = p.name;
  if (p.normalPrice !== undefined) backend.base_price = p.normalPrice;
  if (p.currentPrice !== undefined) backend.current_price = p.currentPrice;
  if (p.hppFloor !== undefined) backend.hpp_floor = p.hppFloor;
  if (p.sellerId !== undefined) backend.store_id = p.sellerId;
  if (p.status !== undefined) backend.status = p.status;
  if (p.cookedAt !== undefined) backend.created_at = p.cookedAt;
  if (p.photoUrl !== undefined) backend.photo_url = p.photoUrl;
  if (p.portions !== undefined) backend.portions = p.portions;
  if (p.availablePortions !== undefined) backend.available_portions = p.availablePortions;
  return backend;
}

// ============================================================
// Utilitas Internal
// ============================================================

/**
 * Wrapper fetch yang menangani error response secara konsisten.
 * Melempar Error dengan pesan dari backend jika status bukan 2xx.
 */
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  // Coba parse response body (bisa JSON atau plain text).
  let body: Record<string, unknown>;
  try {
    body = await response.json();
  } catch {
    throw new Error(
      `Server mengembalikan response tidak valid (HTTP ${response.status}).`,
    );
  }

  if (!response.ok) {
    // Backend FastAPI mengembalikan error dalam format { "detail": "..." }
    const detail =
      (body.detail as string) ||
      (body.message as string) ||
      `Request gagal dengan status ${response.status}`;
    throw new Error(detail);
  }

  return body as T;
}

/**
 * Membuat header Authorization dari Firebase ID Token.
 */
function authHeaders(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}

// ============================================================
// Gemini Vision — Smart Visual Entry API
// ============================================================

/**
 * Mengirim foto makanan beserta harga normal dan porsi ke Gemini Vision
 * untuk mendapatkan data autofill produk dan saran harga dinamis.
 *
 * @param file        - File gambar (JPEG/PNG/WebP).
 * @param normalPrice - Harga normal menu asli warung (Rupiah).
 * @param portions    - Jumlah porsi tersisa.
 * @returns Hasil Smart Entry terstruktur dari Gemini Vision.
 */
export async function analyzeFood(
  file: File,
  normalPrice: number,
  portions: number,
): Promise<SmartEntryResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("normal_price", normalPrice.toString());
  formData.append("portions", portions.toString());

  const url = `${BASE_URL}/vision/analyze-food`;

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  let body: SmartEntryResponse;
  try {
    body = await response.json();
  } catch {
    throw new Error(
      `Server mengembalikan response tidak valid (HTTP ${response.status}).`,
    );
  }

  if (!response.ok) {
    const detail =
      (body as unknown as { detail?: string }).detail ||
      body.message ||
      `Analisis gagal (HTTP ${response.status})`;
    throw new Error(detail);
  }

  if (!body.success || !body.analysis) {
    throw new Error(
      body.message ||
        "Gemini Vision gagal menganalisis gambar. Coba lagi dengan foto yang lebih jelas.",
    );
  }

  return body.analysis;
}

// ============================================================
// Products CRUD
// ============================================================

/**
 * Mengambil semua produk aktif (publik, tanpa auth).
 *
 * @returns Array produk dalam format camelCase.
 */
export async function getProducts(): Promise<Product[]> {
  const data = await apiFetch<ProductListResponse>("/products");
  return data.products.map(mapToFrontendProduct);
}

/**
 * Mengambil detail 1 produk berdasarkan ID.
 *
 * @param productId - ID dokumen Firestore.
 * @returns Data produk lengkap dalam format camelCase.
 * @throws Error 404 jika produk tidak ditemukan.
 */
export async function getProduct(productId: string): Promise<Product> {
  const data = await apiFetch<ProductDetailResponse>(`/products/${productId}`);

  if (!data.product) {
    throw new Error(`Produk dengan ID '${productId}' tidak ditemukan.`);
  }

  return mapToFrontendProduct(data.product);
}

/**
 * Membuat produk baru (memerlukan token merchant).
 *
 * @param payload - Data produk (name, normalPrice, sellerId, status).
 * @param token   - Firebase ID Token dari user yang sudah login.
 * @returns Data produk yang baru dibuat dalam format camelCase.
 * @throws Error 401 jika token tidak valid, 403 jika bukan merchant.
 */
export async function createProduct(
  payload: CreateProductPayload,
  token: string,
): Promise<Product> {
  const backendPayload = mapToBackendProduct(payload as unknown as Partial<Product>);

  const data = await apiFetch<ProductDetailResponse>("/products", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(backendPayload),
  });

  if (!data.product) {
    throw new Error("Server tidak mengembalikan data produk.");
  }

  return mapToFrontendProduct(data.product);
}

/**
 * Memperbarui data produk (memerlukan token merchant).
 *
 * @param productId - ID dokumen Firestore produk.
 * @param payload   - Field yang ingin diupdate (partial camelCase).
 * @param token     - Firebase ID Token.
 * @returns Data produk setelah di-update dalam format camelCase.
 */
export async function updateProduct(
  productId: string,
  payload: Partial<Omit<Product, "id" | "cookedAt">>,
  token: string,
): Promise<Product> {
  const backendPayload = mapToBackendProduct(payload as Partial<Product>);

  const data = await apiFetch<ProductDetailResponse>(`/products/${productId}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(backendPayload),
  });

  if (!data.product) {
    throw new Error("Server tidak mengembalikan data produk.");
  }

  return mapToFrontendProduct(data.product);
}

/**
 * Soft-delete produk (memerlukan token merchant).
 *
 * @param productId - ID dokumen Firestore produk.
 * @param token     - Firebase ID Token.
 * @returns Data produk setelah status diubah menjadi "deleted".
 */
export async function deleteProduct(
  productId: string,
  token: string,
): Promise<Product> {
  const data = await apiFetch<ProductDetailResponse>(`/products/${productId}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });

  if (!data.product) {
    throw new Error("Server tidak mengembalikan data produk.");
  }

  return mapToFrontendProduct(data.product);
}

// ============================================================
// Stores CRUD
// ============================================================

/**
 * Mendaftarkan toko/merchant baru (memerlukan token merchant).
 *
 * @param payload - Data toko (store_name, latitude, longitude, address).
 * @param token   - Firebase ID Token dari user yang sudah login.
 * @returns Data toko yang baru didaftarkan.
 */
export async function createStore(
  payload: CreateStorePayload,
  token: string,
): Promise<Store> {
  const data = await apiFetch<StoreDetailResponse>("/stores", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });

  if (!data.store) {
    throw new Error("Server tidak mengembalikan data toko.");
  }

  return data.store;
}

/**
 * Mengambil detail toko berdasarkan ID (publik, tanpa auth).
 *
 * @param storeId - ID dokumen Firestore toko.
 * @returns Data toko lengkap.
 * @throws Error 404 jika toko tidak ditemukan.
 */
export async function getStoreDetail(storeId: string): Promise<Store> {
  const data = await apiFetch<StoreDetailResponse>(`/stores/${storeId}`);

  if (!data.store) {
    throw new Error(`Toko dengan ID '${storeId}' tidak ditemukan.`);
  }

  return data.store;
}

/**
 * Memperbarui informasi toko (memerlukan token merchant).
 *
 * @param storeId - ID dokumen Firestore toko.
 * @param payload - Field yang ingin diupdate (partial).
 * @param token   - Firebase ID Token.
 * @returns Data toko setelah di-update.
 */
export async function updateStore(
  storeId: string,
  payload: Partial<Omit<Store, "id" | "created_at">>,
  token: string,
): Promise<Store> {
  const data = await apiFetch<StoreDetailResponse>(`/stores/${storeId}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });

  if (!data.store) {
    throw new Error("Server tidak mengembalikan data toko.");
  }

  return data.store;
}

// ============================================================
// Transactions API (Claim & Complete)
// ============================================================

export interface ClaimDonationResponse {
  success: boolean;
  transaction_id: string;
  claim_code: string;
  whatsapp_link: string;
  message: string;
}

export interface CompleteTransactionResponse {
  success: boolean;
  message: string;
}

/**
 * Klaim donasi makanan gratis (memerlukan token customer/consumer).
 */
export async function claimDonation(
  productId: string,
  liabilityAgreement: boolean,
  idProofUrl: string | undefined,
  token: string,
): Promise<ClaimDonationResponse> {
  return await apiFetch<ClaimDonationResponse>("/transactions/claim", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({
      product_id: productId,
      liability_agreement: liabilityAgreement,
      id_proof_url: idProofUrl,
    }),
  });
}

/**
 * Selesaikan transaksi donasi dengan mengunggah bukti serah terima (memerlukan token customer/consumer).
 */
export async function completeTransaction(
  transactionId: string,
  receiptProofUrl: string,
  token: string,
): Promise<CompleteTransactionResponse> {
  return await apiFetch<CompleteTransactionResponse>("/transactions/complete", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({
      transaction_id: transactionId,
      receipt_proof_url: receiptProofUrl,
    }),
  });
}

export interface PurchaseResponse {
  success: boolean;
  transaction_id: string;
  order_code: string;
  whatsapp_link: string;
  message: string;
}

/**
 * Beli porsi produk surplus (memerlukan token customer/consumer).
 */
export async function buyProduct(
  productId: string,
  quantity: number,
  paymentMethod: string,
  token: string,
): Promise<PurchaseResponse> {
  return await apiFetch<PurchaseResponse>("/transactions/purchase", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({
      product_id: productId,
      quantity,
      payment_method: paymentMethod,
    }),
  });
}
