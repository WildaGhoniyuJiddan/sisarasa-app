# SisaRasa 🌿 — Ekosistem Restorasi Sumber Daya Pangan

> **Mengubah Limbah Menjadi Berkah.** Platform PWA & AI terintegrasi yang memberdayakan UMKM kuliner untuk mengurangi kerugian surplus makanan melalui strategi harga dinamis (*Dynamic Pricing*) dan distribusi donasi sosial yang aman, transparan, dan akuntabel.

---

## 📖 Latar Belakang & Tujuan
Indonesia menyumbang limbah pangan terbesar ke-2 di dunia dengan total 48 juta ton makanan terbuang per tahun. **SisaRasa** hadir sebagai solusi proaktif berbasis AI untuk membantu pelaku UMKM (Warung Makan, Rumah Makan, Pasar Tradisional):
1. **Memitigasi Kerugian:** Mengurangi pembuangan makanan surplus melalui penetapan harga dinamis berbasis waktu operasional (*Exponential Decay*).
2. **Pencatatan Makanan Kilat:** Menyediakan pengisian data makanan otomatis (*Autofill*) instan bermodalkan foto fisik masakan menggunakan integrasi **Gemini 1.5 Flash Vision API**.
3. **Penyaluran Donasi Akuntabel:** Membuka fitur klaim donasi gratis bagi pihak membutuhkan/panti asuhan dengan validasi identitas terenkripsi, alur koordinasi WhatsApp, serta pembatasan sanksi pembekuan 24 jam demi mencegah kecurangan (*anti-fraud*).

---

## 🛠️ Arsitektur & Teknologi Stack

SisaRasa dirancang menggunakan arsitektur **Serverless** modern berkemampuan sinkronisasi *real-time*:

* **Frontend (PWA Next.js):**
  - Next.js (App Router)
  - Tailwind CSS (Premium Dark Theme, Glassmorphism, Tactile mechanical bounce animations)
  - Lucide Icons & Nunito Sans Typography
  - Web Camera Media API & OS Native Image Capture (`capture="environment"`)
* **Backend (FastAPI Python):**
  - Python FastAPI (Asynchronous execution & high concurrency support)
  - Firebase Admin SDK (Authentication, Firestore Database CRUD)
  - Google Gemini AI Engine SDK (Vision & Text NLP)
  - Uvicorn ASGI Server
* **Infrastruktur & Cloud:**
  - Google Cloud Run (Serverless hosting backend & frontend)
  - Firebase Firestore (NoSQL database untuk data *users*, *products*, dan *transactions*)
  - Google Cloud Storage (Media uploads & secure identities storage)

---

## 📂 Struktur Direktori Proyek

```
SisaRasa2/
│
├── sisarasa-app/             # Aplikasi Frontend Next.js (Progressive Web App)
│   ├── src/
│   │   ├── app/              # Next.js App Router (Seller Dashboard, Claim Stepper, Marketplace)
│   │   ├── components/       # Modular UI Components (FoodAnalysisForm, DashboardView, ProductCard)
│   │   ├── services/         # Client API Layer & Interceptors (api.ts)
│   │   └── lib/              # AuthContext & React state hooks
│   └── next.config.js        # Konfigurasi Next.js & unoptimized image bypass
│
├── sisarasa-backend/         # Layanan Backend FastAPI Python & Vision API
│   ├── app/
│   │   ├── api/v1/           # API Routers (auth, products, stores, transactions, vision)
│   │   ├── core/             # Konfigurasi Inti (firebase.py, auth.py)
│   │   └── main.py           # Inisialisasi Uvicorn & CORS Middleware
│   ├── requirements.txt      # Dependensi Python Backend
│   └── Dockerfile            # Konfigurasi kontainerisasi deployment Cloud Run
│
├── prd.md                    # Product Requirements Document (PRD) Lengkap
└── README.md                 # Dokumentasi ini
```

---

## 🚀 Panduan Memulai Secara Lokal (Local Setup)

### 1. Persiapan Backend (FastAPI Python)

1. Masuk ke direktori backend:
   ```bash
   cd sisarasa-backend
   ```
2. Buat & aktifkan virtual environment Python:
   ```bash
   # Windows PowerShell
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   
   # Linux/macOS
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Instal semua dependensi:
   ```bash
   pip install -r requirements.txt
   ```
4. Konfigurasikan Environment Variables (`.env`):
   Salin file `.env.example` menjadi `.env` dan lengkapi konfigurasi Firebase beserta kunci API Gemini Anda:
   ```env
   FIREBASE_CREDENTIALS_PATH=firebase-service-account.json
   GEMINI_API_KEY=AIzaSy...
   ```
5. Jalankan server lokal:
   ```bash
   python -m uvicorn app.main:app --port 8000 --reload
   ```
   *Backend lokal akan aktif pada alamat:* `http://localhost:8000`

---

### 2. Persiapan Frontend (Next.js PWA)

1. Masuk ke direktori frontend:
   ```bash
   cd sisarasa-app
   ```
2. Instal semua paket npm:
   ```bash
   npm install
   ```
3. Konfigurasikan Endpoint API:
   Secara default, client API di [**`api.ts`**](file:///d:/VScode/SisaRasa2/sisarasa-app/src/services/api.ts) secara otomatis mengarah langsung ke server produksi HTTPS Cloud Run agar aplikasi siap didemokan secara instan bahkan di jaringan seluler gawai Anda. Jika ingin beralih ke API lokal, Anda cukup mengubah variabel string di dalam file tersebut.
4. Jalankan aplikasi pengembangan:
   ```bash
   npm run dev
   ```
   *Frontend lokal akan aktif pada alamat:* `http://localhost:3000`

---

## ☁️ Panduan Deployment (Google Cloud Run)

Jika Anda ingin memperbarui atau meluncurkan ulang SisaRasa ke server produksi Google Cloud Run:

### Deploy Backend FastAPI
```bash
cd sisarasa-backend
gcloud run deploy sisarasa-backend --source . --region asia-southeast2 --allow-unauthenticated
```

### Deploy Frontend Next.js PWA
```bash
cd sisarasa-app
gcloud run deploy sisarasa-frontend --source . --region asia-southeast2 --allow-unauthenticated
```

---

## 🛡️ Aturan Keamanan & Pencegahan Penyalahgunaan (Anti-Fraud)
1. **Isolasi API Key Gemini:** Kunci API berada di sisi serverless backend Python FastAPI untuk mencegah pencurian token di repositori GitHub atau peretas client browser.
2. **Sanksi Keterlambatan 24 Jam:** Konsumen yang mengklaim donasi makanan surplus wajib mengunggah foto bukti serah terima di lokasi tujuan dalam 24 jam. Jika terlampaui, sistem secara otomatis membekukan hak klaim akun tersebut.
3. **HPP Protection Rule:** Algoritma *Dynamic Pricing* (Exponential Decay) mengunci batas penurunan harga maksimal di angka **50% dari harga normal** untuk melindungi pedagang dari kerugian total modal bahan baku mentah.

---

## 📝 Versi & Kontributor
* **Versi Projek:** 1.2 (Stabilized Production Release)
* **Status Aplikasi:** Live & Active serving 100% production traffic.
* **Lisensi:** Open-Source/Mitra UMKM Nusantara.
