import type { Metadata, Viewport } from "next";
import { Geist_Mono, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SisaRasa Warung — Kurangi Sisa, Tambah Rasa",
  description:
    "Platform AI untuk mengelola sisa makanan UMKM secara proaktif. Prediksi surplus, dynamic pricing otomatis, dan donasi ke panti asuhan yang terverifikasi.",
  keywords: ["food waste", "sisa makanan", "UMKM", "warung", "donasi pangan", "Indonesia", "SisaRasa"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SisaRasa",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#EFE3CA",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${geistMono.variable} ${jetbrainsMono.variable} h-full`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
      </head>
      <body className="min-h-dvh flex flex-col">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
