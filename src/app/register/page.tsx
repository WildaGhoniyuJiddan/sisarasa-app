'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Store, ShoppingBag, Mail, Lock, User as UserIcon } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { UserRole } from '@/types'
import RoleCard from '@/components/ui/RoleCard'
import GlassPanel from '@/components/ui/GlassPanel'
import InputField from '@/components/ui/InputField'
import TactileButton from '@/components/ui/TactileButton'

export default function RegisterPage() {
  const router = useRouter()
  const { register, isLoading } = useAuth()

  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    general: '',
  })

  const validateForm = (): boolean => {
    const newErrors = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: '',
      general: '',
    }

    if (!selectedRole) {
      newErrors.role = 'Silakan pilih peran Anda'
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username wajib diisi'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username minimal 3 karakter'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Format email tidak valid'
    }

    if (!formData.password) {
      newErrors.password = 'Kata sandi wajib diisi'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Kata sandi minimal 6 karakter'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi kata sandi tidak cocok'
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some((error) => error !== '')
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm() || !selectedRole) {
      return
    }

    try {
      await register(formData.username, formData.email, formData.password, selectedRole)

      // Redirect based on role
      if (selectedRole === 'seller') {
        router.push('/seller/dashboard')
      } else {
        router.push('/consumer/marketplace')
      }
    } catch (error: any) {
      setErrors((prev) => ({
        ...prev,
        general: error.message || 'Registrasi gagal. Silakan coba lagi.',
      }))
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 safe-top safe-bottom bg-slate-50/50">
      <div className="max-w-md w-full space-y-6 my-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-[#10B981] tracking-tight">SisaRasa</h1>
          <p className="text-sm text-[#899483] font-medium">
            Daftar sekarang untuk menyelamatkan surplus makanan lezat & higienis
          </p>
        </div>

        {/* Role Selection */}
        <div className="space-y-3">
          <h2 className="text-sm font-extrabold text-[#4A5568] uppercase tracking-wider text-center">
            Pilih Peran Akun Anda
          </h2>
          
          <div className="grid grid-cols-2 gap-4">
            <RoleCard
              icon={Store}
              title="Penjual"
              description="Mitra Warung UMKM"
              isActive={selectedRole === 'seller'}
              onSelect={() => {
                setSelectedRole('seller')
                setErrors((prev) => ({ ...prev, role: '' }))
              }}
            />
            
            <RoleCard
              icon={ShoppingBag}
              title="Konsumen"
              description="Pembeli & Penerima"
              isActive={selectedRole === 'consumer'}
              onSelect={() => {
                setSelectedRole('consumer')
                setErrors((prev) => ({ ...prev, role: '' }))
              }}
            />
          </div>
          
          {errors.role && (
            <p className="text-xs text-rose-600 text-center font-semibold" role="alert">
              {errors.role}
            </p>
          )}
        </div>

        {/* Register Form */}
        <GlassPanel>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3.5">
              
              <InputField
                label="Username"
                type="text"
                placeholder="Masukkan username baru"
                value={formData.username}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    username: e.target.value,
                  }))
                }
                error={errors.username}
                leftIcon={<UserIcon size={18} className="text-[#899483]" />}
                required
                autoComplete="username"
              />

              <InputField
                label="Email"
                type="email"
                placeholder="Masukkan alamat email aktif"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                error={errors.email}
                leftIcon={<Mail size={18} className="text-[#899483]" />}
                required
                autoComplete="email"
              />

              <InputField
                label="Kata Sandi"
                type="password"
                placeholder="Masukkan kata sandi baru"
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                error={errors.password}
                leftIcon={<Lock size={18} className="text-[#899483]" />}
                required
                autoComplete="new-password"
              />

              <InputField
                label="Konfirmasi Kata Sandi"
                type="password"
                placeholder="Masukkan kembali kata sandi"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                error={errors.confirmPassword}
                leftIcon={<Lock size={18} className="text-[#899483]" />}
                required
                autoComplete="new-password"
              />
            </div>

            {errors.general && (
              <div
                className="p-3 rounded-xl bg-rose-50 border border-rose-100"
                role="alert"
              >
                <p className="text-xs font-semibold text-rose-600">{errors.general}</p>
              </div>
            )}

            <TactileButton
              type="submit"
              fullWidth
              isLoading={isLoading}
              disabled={!selectedRole}
              className="mt-2 bg-[#10B981] hover:bg-[#0D9488] text-white"
            >
              Daftar & Masuk Dashboard
            </TactileButton>
          </form>
        </GlassPanel>

        {/* Footer Links */}
        <div className="text-center space-y-2">
          <p className="text-sm text-[#899483]">
            Sudah memiliki akun?{' '}
            <Link
              href="/login"
              className="text-[#10B981] font-bold hover:underline focus-visible-ring"
            >
              Masuk Sekarang
            </Link>
          </p>
          
          <p className="text-[10px] text-[#899483]/80 leading-relaxed px-4">
            Dengan mendaftar, Anda menyetujui{' '}
            <button
              type="button"
              className="text-[#10B981] font-semibold hover:underline"
              onClick={() => alert('Syarat & Ketentuan Layanan SisaRasa')}
            >
              Syarat & Ketentuan
            </button>{' '}
            serta kebijakan privasi kami.
          </p>
        </div>

      </div>
    </main>
  )
}
