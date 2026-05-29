'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { ArrowLeft, Sparkles, HelpCircle, ChevronDown, ShieldAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface FAQItem {
  question: string
  answer: string
}

export default function HelpAndGuidePage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()
  
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  // Auth Protection redirect
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'consumer')) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, user, router])

  const faqs: FAQItem[] = [
    {
      question: 'Bagaimana cara mengklaim makanan surplus?',
      answer: 'Cari makanan surplus di beranda, klik tombol "Klaim Donasi" atau "Beli Porsi", selesaikan proses klaim di aplikasi, kemudian tunjukkan bukti kode klaim/order Anda di halaman pesanan kepada kasir kasir mitra warung saat pengambilan.'
    },
    {
      question: 'Berapa batas waktu pengambilan makanan (Timeout)?',
      answer: 'Makanan surplus yang sudah diklaim wajib diambil sebelum jam batas pengambilan toko berakhir hari ini. Jika melewati batas operasional ambil, klaim Anda otomatis hangus agar menjaga higienitas kelayakan pangan.'
    },
    {
      question: 'Apakah kualitas makanan surplus terjamin aman?',
      answer: 'Sangat aman. Seluruh mitra warung SisaRasa telah melalui kurasi standar kebersihan tinggi dan kelayakan konsumsi secara ketat sebelum makanan dipublikasikan di platform kami.'
    },
    {
      question: 'Pernyataan Penafian Keamanan Pangan (Food Safety Disclaimer)',
      answer: 'Mitra warung bertanggung jawab penuh atas kesegaran hidangan yang diserahkan. Konsumen disarankan memeriksa kondisi fisik makanan saat serah terima. SisaRasa tidak bertanggung jawab atas efek samping jika makanan dikonsumsi melebihi 4 jam setelah pengambilan.'
    }
  ]

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-[#10B981] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-[#899483]">Memuat panduan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-700 font-sans pb-12">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/consumer/marketplace')}
            className="rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-base font-black text-slate-800 tracking-tight">Bantuan & Panduan</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Petunjuk lengkap ekosistem penyelamatan</p>
          </div>
        </div>
      </div>

      <main className="max-w-md mx-auto px-4 pt-8 space-y-6">
        {/* FAQ Card */}
        <Card className="p-5 border border-slate-100 bg-white shadow-sm rounded-2xl">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-50">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-800 text-sm">Pertanyaan Umum (FAQ)</h2>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Panduan & Tata Tertib Platform</p>
            </div>
          </div>

          {/* Interactive Accordion */}
          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index
              return (
                <div 
                  key={index}
                  className="border border-slate-100 rounded-xl overflow-hidden transition-all duration-200 bg-slate-50/20"
                >
                  <button
                    type="button"
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between p-4 text-left font-extrabold text-slate-800 text-xs hover:bg-slate-50 transition-colors"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${isOpen ? 'rotate-180 text-emerald-600' : ''}`} />
                  </button>

                  <div 
                    className={`transition-all duration-300 overflow-hidden ${
                      isOpen ? 'max-h-40 border-t border-slate-50' : 'max-h-0'
                    }`}
                  >
                    <div className="p-4 text-slate-500 text-xs font-semibold leading-relaxed">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* Disclaimer Safety Card */}
        <Card className="p-4 border border-rose-100 bg-rose-50/20 rounded-2xl flex gap-3 text-xs leading-relaxed font-semibold text-rose-800">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-extrabold mb-0.5 uppercase tracking-wide text-[10px]">Pemberitahuan Higienitas Pangan</h4>
            <p className="text-[11px] text-slate-500 font-medium">
              Demi keamanan kesehatan bersama, selalu pastikan makanan surplus dikonsumsi dalam keadaan segar atau dihangatkan kembali sebelum dihidangkan.
            </p>
          </div>
        </Card>
      </main>
    </div>
  )
}
