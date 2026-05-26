import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Sparkles,
  MapPin,
  Clock,
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  HeartHandshake
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#031800] text-[#bfcab8] relative overflow-hidden font-sans selection:bg-[#7cdc70]/30 selection:text-white">
      
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0a3200_1px,transparent_1px),linear-gradient(to_bottom,#0a3200_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none -z-20" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#031800]/80 backdrop-blur-md border-b border-[#7cdc70]/10 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Link href="/" className="relative h-10 w-36 block">
                <Image
                  src="/images/logo.png"
                  alt="SisaRasa Logo"
                  fill
                  sizes="144px"
                  priority
                  className="object-contain"
                />
              </Link>
            </div>

            {/* Menu */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/"
                className="text-white font-bold hover:text-[#7cdc70] transition-colors duration-200"
              >
                Home
              </Link>
              <Link
                href="#about"
                className="text-[#bfcab8] hover:text-[#7cdc70] transition-colors duration-200"
              >
                Tentang Kami
              </Link>
              <Link
                href="#features"
                className="text-[#bfcab8] hover:text-[#7cdc70] transition-colors duration-200"
              >
                Fitur
              </Link>
              <Link
                href="#impact"
                className="text-[#bfcab8] hover:text-[#7cdc70] transition-colors duration-200"
              >
                Dampak
              </Link>
            </div>

            {/* CTA Button */}
            <Link href="/login" passHref>
              <Button variant="brand" className="font-extrabold">
                Mulai Sekarang
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Side - Text with Gradient & CTA */}
            <div className="relative flex flex-col items-start text-left">
              {/* Floating AI Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0a3200]/90 border border-[#7cdc70]/30 text-[#7cdc70] text-xs font-semibold mb-8 uppercase tracking-widest animate-pulse">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI-Powered Food Restoration</span>
              </div>

              {/* Headline */}
              <h1 className="text-6xl lg:text-8xl font-black text-white tracking-tighter leading-[0.9] mb-6">
                Sisa
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#7cdc70] to-[#7CFFCB]">
                  Rasa
                </span>
              </h1>

              {/* Sub-text */}
              <p className="text-lg lg:text-xl text-[#bfcab8]/90 mb-10 max-w-lg leading-relaxed">
                Platform kecerdasan buatan revolusioner yang mengoptimalkan surplus makanan, menghentikan food waste, dan menghubungkan UMKM dengan aksi sosial berkelanjutan.
              </p>

              {/* CTA Action */}
              <Link href="/login" passHref>
                <Button variant="dark" size="lg" className="group flex items-center gap-2.5 font-bold">
                  <span>Jelajahi Platform</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

            {/* Right Side - Premium Overlapping Cards with Glow Orbs */}
            <div className="relative h-[600px] w-full flex items-center justify-center lg:block">
              {/* Blurred Glow Orbs */}
              <div className="absolute top-1/4 left-1/4 w-[320px] h-[320px] rounded-full bg-[#7cdc70]/10 blur-[100px] -z-10 animate-pulse-slow" />
              <div className="absolute bottom-1/4 right-1/4 w-[280px] h-[280px] rounded-full bg-[#10b981]/15 blur-[120px] -z-10" />

              {/* Staggered Card 1: Top-Left Card */}
              <Card className="absolute top-4 left-4 w-[280px] lg:w-[310px] rotate-[-4deg] border-[#7cdc70]/20 shadow-2xl hover:rotate-0 hover:scale-105 hover:z-30 hover:border-[#7cdc70]/40 transition-all duration-300 bg-[#062600]/80">
                <div className="relative h-40 w-full overflow-hidden rounded-t-xl">
                  <Image
                    src="/images/sayur.jpg"
                    alt="Surplus Makanan Terbantu"
                    fill
                    sizes="(max-width: 768px) 100vw, 310px"
                    className="object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <Badge variant="success" className="absolute top-3 right-3 font-extrabold shadow-md">
                    NEW / <Clock className="w-3 h-3 inline mr-0.5" /> 2 Jam
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center gap-1 text-[10px] font-black text-[#7cdc70] mb-1.5 tracking-wider uppercase">
                    <Sparkles className="w-3 h-3" />
                    <span>AI Surplus Predictor</span>
                  </div>
                  <h4 className="text-sm font-black text-white mb-2 line-clamp-1">Surplus Sayuran Organik</h4>
                  <div className="flex items-center text-xs text-[#bfcab8]/80 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 mr-1 shrink-0" />
                    <span className="truncate">Warung Bu Totok (1.2 km)</span>
                  </div>
                </CardContent>
              </Card>

              {/* Staggered Card 2: Center Card */}
              <Card className="absolute top-[32%] right-4 w-[290px] lg:w-[320px] rotate-[3deg] border-[#7cdc70]/30 shadow-2xl hover:rotate-0 hover:scale-105 hover:z-30 hover:border-[#7cdc70]/50 transition-all duration-300 z-10 bg-[#0A3200]/90">
                <div className="relative h-44 w-full overflow-hidden rounded-t-xl">
                  <Image
                    src="/images/sayur2.jpg"
                    alt="Penyelamatan Pangan"
                    fill
                    sizes="(max-width: 768px) 100vw, 320px"
                    className="object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <Badge variant="warning" className="absolute top-3 right-3 font-extrabold shadow-md">
                    <Clock className="w-3 h-3 inline mr-0.5" /> 5 Jam
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-[9px] bg-[#7cdc70]/20 text-[#7cdc70] border border-[#7cdc70]/30 px-1.5 py-0.5 rounded font-black tracking-wider uppercase">
                        Dynamic Price
                      </span>
                      <h4 className="text-sm font-black text-white mt-1.5 line-clamp-1">Sayur Masak Segar</h4>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] line-through text-[#bfcab8]/40 block">Rp 24k</span>
                      <span className="text-sm font-black text-[#7cdc70]">Rp 12k</span>
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-[#bfcab8]/80 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 mr-1 shrink-0" />
                    <span className="truncate">Soto Segar Berkah (800m)</span>
                  </div>
                </CardContent>
              </Card>

              {/* Staggered Card 3: Bottom Card */}
              <Card className="absolute bottom-4 left-12 w-[270px] lg:w-[300px] rotate-[-2deg] border-[#7cdc70]/20 shadow-2xl hover:rotate-0 hover:scale-105 hover:z-30 hover:border-[#7cdc70]/40 transition-all duration-300 z-20 bg-[#062600]/80">
                <div className="relative h-36 w-full overflow-hidden rounded-t-xl">
                  <Image
                    src="/images/sayur3.jpg"
                    alt="Donasi Terverifikasi"
                    fill
                    sizes="(max-width: 768px) 100vw, 300px"
                    className="object-cover transition-transform duration-500 hover:scale-110"
                  />
                  <Badge variant="default" className="absolute top-3 right-3 bg-emerald-600 border-none text-white font-extrabold shadow-md">
                    DONASI SOSIAL
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#7CFFCB] animate-pulse" />
                    <span className="text-xs font-black text-white">Diklaim Panti Asuhan Kasih</span>
                  </div>
                  <div className="flex items-center text-xs text-[#bfcab8]/80 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 mr-1 shrink-0" />
                    <span className="truncate">2.4 km dari lokasi Anda</span>
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </section>

      {/* Why SisaRasa Section */}
      <section id="features" className="py-24 bg-[#062600]/40 border-y border-[#7cdc70]/10 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-[#7cdc70] text-xs font-extrabold uppercase tracking-widest">
              Keunggulan Utama
            </span>
            <h2 className="text-4xl lg:text-5xl font-black text-white mt-3 tracking-tight">
              Mengapa SisaRasa?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="bg-[#062600]/80 border-[#7cdc70]/10 hover:border-[#7cdc70]/30 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#7cdc70]/10 border border-[#7cdc70]/20 flex items-center justify-center mb-6">
                  <Sparkles className="w-8 h-8 text-[#7cdc70]" />
                </div>
                <h3 className="text-xl font-black text-white mb-3">
                  Prediksi AI Cerdas
                </h3>
                <p className="text-sm text-[#bfcab8]/80 leading-relaxed">
                  Teknologi AI memprediksi surplus makanan sebelum terjadi, membantu warung UMKM mengoptimalkan produksi dan mengurangi limbah.
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="bg-[#062600]/80 border-[#7cdc70]/10 hover:border-[#7cdc70]/30 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#7cdc70]/10 border border-[#7cdc70]/20 flex items-center justify-center mb-6">
                  <TrendingDown className="w-8 h-8 text-[#7cdc70]" />
                </div>
                <h3 className="text-xl font-black text-white mb-3">
                  Harga Dinamis Otomatis
                </h3>
                <p className="text-sm text-[#bfcab8]/80 leading-relaxed">
                  Sistem harga dinamis otomatis memberikan diskon hingga 50% untuk makanan surplus, memastikan nilai ekonomi tetap terselamatkan.
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="bg-[#062600]/80 border-[#7cdc70]/10 hover:border-[#7cdc70]/30 transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#7cdc70]/10 border border-[#7cdc70]/20 flex items-center justify-center mb-6">
                  <HeartHandshake className="w-8 h-8 text-[#7cdc70]" />
                </div>
                <h3 className="text-xl font-black text-white mb-3">
                  Donasi Transparan
                </h3>
                <p className="text-sm text-[#bfcab8]/80 leading-relaxed">
                  Platform donasi makanan yang aman dan akuntabel dengan sistem verifikasi identitas dan bukti penyerahan untuk mencegah fraud.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="impact" className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-3 gap-12 text-center items-center">
            
            <div className="p-6 bg-[#062600]/30 rounded-2xl border border-[#7cdc70]/5">
              <div className="text-5xl lg:text-6xl font-black text-white mb-3 tracking-tighter bg-gradient-to-r from-[#7cdc70] to-[#7CFFCB] bg-clip-text text-transparent">
                48 Juta
              </div>
              <div className="text-xs text-[#bfcab8]/70 uppercase font-black tracking-widest mb-1">
                Limbah Pangan / Tahun
              </div>
              <p className="text-sm text-[#bfcab8]/90">Kerugian limbah pangan tahunan di Indonesia</p>
            </div>

            <div className="p-6 bg-[#062600]/30 rounded-2xl border border-[#7cdc70]/5">
              <div className="text-5xl lg:text-6xl font-black text-white mb-3 tracking-tighter bg-gradient-to-r from-[#7cdc70] to-[#7CFFCB] bg-clip-text text-transparent">
                Diskon 50%
              </div>
              <div className="text-xs text-[#bfcab8]/70 uppercase font-black tracking-widest mb-1">
                Maksimal Penyelamatan
              </div>
              <p className="text-sm text-[#bfcab8]/90">Proteksi HPP tetap aman bagi warung UMKM</p>
            </div>

            <div className="p-6 bg-[#062600]/30 rounded-2xl border border-[#7cdc70]/5">
              <div className="text-5xl lg:text-6xl font-black text-white mb-3 tracking-tighter bg-gradient-to-r from-[#7cdc70] to-[#7CFFCB] bg-clip-text text-transparent">
                100% Real-time
              </div>
              <div className="text-xs text-[#bfcab8]/70 uppercase font-black tracking-widest mb-1">
                Integrasi Ekosistem
              </div>
              <p className="text-sm text-[#bfcab8]/90">Berbasis AI Vision & Dynamic Pricing</p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#0A3200] via-[#031800] to-[#031800] border-t border-[#7cdc70]/10">
        
        {/* Glow behind CTA */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#7cdc70]/5 blur-[120px] -z-10" />

        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7cdc70]/10 border border-[#7cdc70]/20 text-[#7cdc70] text-xs font-semibold mb-6">
            <ShieldCheck className="w-4 h-4" />
            <span>Verifikasi & Aman Terpercaya</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-6 tracking-tight">
            Siap Mengurangi Limbah Makanan?
          </h2>
          <p className="text-lg text-[#bfcab8]/90 mb-10 max-w-xl mx-auto">
            Bergabunglah dengan ribuan warung UMKM dan konsumen yang menyelamatkan pangan, melestarikan alam, dan membantu sesama bersama SisaRasa.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login" passHref>
              <Button variant="brand" size="lg" className="w-full sm:w-auto font-black shadow-lg">
                Daftar Sebagai Penjual
              </Button>
            </Link>
            <Link href="/login" passHref>
              <Button variant="outline" size="lg" className="w-full sm:w-auto hover:bg-[#163d07]/40 border-[#7cdc70]/30 hover:border-[#7cdc70] text-white">
                Daftar Sebagai Konsumen
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-[#031800] border-t border-[#7cdc70]/10 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Link href="/" className="relative h-8 w-28 block">
                <Image
                  src="/images/logo.png"
                  alt="SisaRasa Logo"
                  fill
                  sizes="112px"
                  className="object-contain"
                />
              </Link>
            </div>
            
            <p className="text-[#bfcab8]/60 text-sm text-center md:text-right">
              © 2026 SisaRasa. Menyelamatkan makanan, mengurangi limbah, membantu sesama.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
