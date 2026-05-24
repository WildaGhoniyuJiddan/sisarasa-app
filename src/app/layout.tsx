import type { Metadata, Viewport } from 'next'
import { Nunito_Sans } from 'next/font/google'
import '@/styles/globals.css'
import { AuthProvider } from '@/lib/auth-context'

const nunitoSans = Nunito_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
  variable: '--font-nunito-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'SisaRasa - Ekosistem Restorasi Sumber Daya Pangan',
  description: 'Platform inovatif berbasis AI yang mengubah pendekatan pengelolaan sisa makanan dari reaktif menjadi proaktif untuk UMKM Indonesia.',
  keywords: ['food waste', 'UMKM', 'AI', 'sustainability', 'Indonesia', 'warung', 'donation'],
  authors: [{ name: 'SisaRasa Team' }],
  creator: 'SisaRasa',
  publisher: 'SisaRasa',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'SisaRasa',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#FFFFFF',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={nunitoSans.variable}>
      <body className="min-h-screen antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
