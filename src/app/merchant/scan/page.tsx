'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Sparkles, AlertCircle } from 'lucide-react'
import FoodAnalysisForm from '@/components/FoodAnalysisForm'

export default function MerchantScanPage() {
  return (
    <div className="min-h-screen bg-[#031800] text-slate-100 relative overflow-hidden flex flex-col justify-between">
      
      {/* Background Decorative Glowing Radial Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[160px] pointer-events-none translate-y-1/2"></div>

      {/* Main Container */}
      <main className="max-w-4xl w-full mx-auto py-12 px-4 sm:px-6 lg:px-8 relative z-10 flex-1">
        
        {/* Navigation & Header Section */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 border-b border-emerald-950/40 pb-6">
          <div className="space-y-2">
            
            {/* Back Button with Hover Micro-interaction */}
            <Link 
              href="/merchant/dashboard" 
              className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400/90 hover:text-emerald-300 transition-all duration-200 group mb-2"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
              Kembali ke Dashboard
            </Link>

            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent">
                AI Food Safety Scanner
              </h1>
              <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse hidden md:block" />
            </div>

            <p className="text-xs md:text-sm text-slate-400/90 max-w-xl">
              Gunakan kamera perangkat Anda untuk memindai kondisi visual makanan surplus sebelum ditawarkan kepada konsumen.
            </p>
          </div>

          {/* Quick Informational Notice */}
          <div className="shrink-0 flex items-center gap-2.5 px-4 py-2.5 bg-emerald-950/20 border border-emerald-900/30 rounded-2xl text-xs text-emerald-400 font-medium max-w-xs sm:max-w-none">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Mendukung upload foto langsung via kamera HP</span>
          </div>
        </div>

        {/* Central Component */}
        <div className="animate-fade-in">
          <FoodAnalysisForm />
        </div>

      </main>

      {/* Footer Branding */}
      <footer className="w-full text-center py-6 border-t border-emerald-950/20 z-10 text-[10px] md:text-xs text-slate-500/80 font-medium tracking-wide">
        SisaRasa AI Restoring Engine © 2026 • Powered by Google Gemini 1.5 Flash
      </footer>
    </div>
  )
}
