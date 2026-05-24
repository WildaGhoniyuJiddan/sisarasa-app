import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-accent-primary flex items-center justify-center">
                <span className="text-white font-black text-xl">S</span>
              </div>
              <span className="text-2xl font-black text-gray-900">SisaRasa</span>
            </div>

            {/* Menu */}
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-gray-900 font-semibold hover:text-accent-primary transition-colors">
                Home
              </Link>
              <Link href="#about" className="text-gray-600 hover:text-accent-primary transition-colors">
                Tentang Kami
              </Link>
              <Link href="#features" className="text-gray-600 hover:text-accent-primary transition-colors">
                Fitur
              </Link>
              <Link href="#impact" className="text-gray-600 hover:text-accent-primary transition-colors">
                Dampak
              </Link>
            </div>

            {/* CTA Button */}
            <Link
              href="/login"
              className="px-6 py-3 bg-accent-primary text-white font-bold rounded-full hover:brightness-110 transition-all"
            >
              Mulai Sekarang
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Text with Circle */}
            <div className="relative">
              {/* Large Green Circle */}
              <div className="absolute -left-32 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent-primary rounded-full -z-10 opacity-90" />

              <div className="relative z-10">
                <div className="inline-flex items-center gap-3 mb-6">
                  <h1 className="text-7xl lg:text-8xl font-black text-gray-900 leading-none">
                    Sisa
                    <br />
                    Rasa
                  </h1>
                  <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center">
                    <span className="text-3xl">🍽️</span>
                  </div>
                </div>

                <p className="text-xl text-gray-600 mb-8 max-w-md">
                  Platform AI yang Mengubah Surplus Makanan Menjadi Solusi Berkelanjutan
                </p>

                <Link
                  href="/login"
                  className="inline-block px-8 py-4 bg-gray-900 text-white font-bold rounded-full hover:bg-gray-800 transition-all"
                >
                  Jelajahi Platform
                </Link>
              </div>

              {/* Indonesian Text Vertical */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 text-accent-primary/20 font-black text-6xl writing-mode-vertical hidden lg:block">
                食品
              </div>
            </div>

            {/* Right Side - Food Images */}
            <div className="relative h-[600px] hidden lg:block">
              {/* Food Image 1 */}
              <div className="absolute top-0 right-0 w-64 h-48 bg-gradient-to-br from-accent-primary/10 to-accent-primary/5 rounded-3xl shadow-xl flex items-center justify-center transform rotate-3 hover:rotate-0 transition-transform">
                <span className="text-8xl">🍛</span>
              </div>

              {/* Food Image 2 */}
              <div className="absolute top-1/3 right-20 w-72 h-56 bg-gradient-to-br from-accent-primary/10 to-accent-primary/5 rounded-3xl shadow-xl flex items-center justify-center transform -rotate-2 hover:rotate-0 transition-transform">
                <span className="text-9xl">🍜</span>
              </div>

              {/* Food Image 3 */}
              <div className="absolute bottom-0 right-10 w-64 h-48 bg-gradient-to-br from-accent-primary/10 to-accent-primary/5 rounded-3xl shadow-xl flex items-center justify-center transform rotate-2 hover:rotate-0 transition-transform">
                <span className="text-8xl">🍲</span>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-1/4 left-0 w-3 h-3 bg-accent-primary rounded-full animate-pulse" />
              <div className="absolute bottom-1/4 right-0 w-2 h-2 bg-warning-mint rounded-full animate-pulse delay-100" />
            </div>
          </div>
        </div>
      </section>

      {/* Why SisaRasa Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <h2 className="text-5xl font-black text-center text-gray-900 mb-16">
            Mengapa SisaRasa?
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="w-48 h-48 mx-auto mb-6 rounded-full bg-gradient-to-br from-accent-primary to-accent-secondary shadow-xl flex items-center justify-center">
                <span className="text-7xl">🤖</span>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">
                Prediksi AI Cerdas
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Teknologi AI memprediksi surplus makanan sebelum terjadi, membantu warung UMKM mengoptimalkan produksi dan mengurangi limbah.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="w-48 h-48 mx-auto mb-6 rounded-full bg-gradient-to-br from-warning-mint to-yellow-400 shadow-xl flex items-center justify-center">
                <span className="text-7xl">💰</span>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">
                Harga Dinamis Otomatis
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Sistem harga dinamis otomatis memberikan diskon hingga 50% untuk makanan surplus, memastikan nilai ekonomi tetap terselamatkan.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="w-48 h-48 mx-auto mb-6 rounded-full bg-gradient-to-br from-fresh-mint to-accent-secondary shadow-xl flex items-center justify-center">
                <span className="text-7xl">🤝</span>
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">
                Donasi Transparan
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Platform donasi makanan yang aman dan akuntabel dengan sistem verifikasi identitas dan bukti penyerahan untuk mencegah fraud.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-6xl font-black text-accent-primary mb-2">48M</div>
              <div className="text-gray-600 font-semibold">Ton Limbah Makanan/Tahun di Indonesia</div>
            </div>
            <div>
              <div className="text-6xl font-black text-accent-primary mb-2">50%</div>
              <div className="text-gray-600 font-semibold">Diskon Maksimal untuk Surplus</div>
            </div>
            <div>
              <div className="text-6xl font-black text-accent-primary mb-2">100%</div>
              <div className="text-gray-600 font-semibold">Berbasis Kecerdasan Buatan</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-accent-primary to-accent-secondary">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-black text-white mb-6">
            Siap Mengurangi Limbah Makanan?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Bergabunglah dengan ribuan warung UMKM dan konsumen yang telah menyelamatkan makanan bersama SisaRasa
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="px-8 py-4 bg-white text-accent-primary font-bold rounded-full hover:bg-gray-100 transition-all"
            >
              Daftar Sebagai Penjual
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-gray-900 text-white font-bold rounded-full hover:bg-gray-800 transition-all"
            >
              Daftar Sebagai Konsumen
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-accent-primary flex items-center justify-center">
                <span className="text-white font-black text-xl">S</span>
              </div>
              <span className="text-2xl font-black">SisaRasa</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2026 SisaRasa. Menyelamatkan makanan, mengurangi limbah, membantu sesama.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
