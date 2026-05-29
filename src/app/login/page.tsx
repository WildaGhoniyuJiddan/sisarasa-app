'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Store, ShoppingBag, Mail, Lock } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { UserRole } from '@/types'
import RoleCard from '@/components/ui/RoleCard'
import GlassPanel from '@/components/ui/GlassPanel'
import InputField from '@/components/ui/InputField'
import TactileButton from '@/components/ui/TactileButton'

export default function LoginPage() {
  const router = useRouter()
  const { login, isLoading } = useAuth()

  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: '',
  })
  const [errors, setErrors] = useState({
    emailOrUsername: '',
    password: '',
    role: '',
    general: '',
  })

  const validateForm = (): boolean => {
    const newErrors = {
      emailOrUsername: '',
      password: '',
      role: '',
      general: '',
    }

    if (!selectedRole) {
      newErrors.role = 'Silakan pilih peran Anda'
    }

    if (!formData.emailOrUsername.trim()) {
      newErrors.emailOrUsername = 'Email atau username wajib diisi'
    }

    if (!formData.password) {
      newErrors.password = 'Kata sandi wajib diisi'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Kata sandi minimal 6 karakter'
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
      await login({
        emailOrUsername: formData.emailOrUsername,
        password: formData.password,
        role: selectedRole,
      })

      // Redirect based on role
      if (selectedRole === 'seller') {
        router.push('/seller/dashboard')
      } else {
        router.push('/consumer/marketplace')
      }
    } catch (error: any) {
      setErrors((prev) => ({
        ...prev,
        general: error.message || 'Login gagal. Silakan coba lagi.',
      }))
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6 safe-top safe-bottom">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-accent-primary">SisaRasa</h1>
          <p className="text-sm text-outline">
            Masuk untuk mengelola surplus makanan atau menemukan makanan terjangkau
          </p>
        </div>

        {/* Role Selection */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-on-surface-variant text-center">
            Pilih Peran Anda
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
            <p className="text-sm text-critical-red text-center" role="alert">
              {errors.role}
            </p>
          )}
        </div>

        {/* Login Form */}
        <GlassPanel>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <InputField
                label="Email atau Username"
                type="text"
                placeholder="Masukkan email atau username"
                value={formData.emailOrUsername}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    emailOrUsername: e.target.value,
                  }))
                }
                error={errors.emailOrUsername}
                leftIcon={<Mail size={20} />}
                required
                autoComplete="username"
              />

              <InputField
                label="Kata Sandi"
                type="password"
                placeholder="Masukkan kata sandi"
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                error={errors.password}
                leftIcon={<Lock size={20} />}
                required
                autoComplete="current-password"
              />
            </div>

            {errors.general && (
              <div
                className="p-4 rounded-xl bg-critical-red/10 border border-critical-red/30"
                role="alert"
              >
                <p className="text-sm text-critical-red">{errors.general}</p>
              </div>
            )}

            <TactileButton
              type="submit"
              fullWidth
              isLoading={isLoading}
              disabled={!selectedRole}
            >
              Masuk ke Dashboard
            </TactileButton>
          </form>
        </GlassPanel>

        {/* Footer Links */}
        <div className="text-center space-y-2">
          <p className="text-sm text-outline">
            Belum punya akun?{' '}
            <Link
              href="/register"
              className="text-accent-primary font-semibold hover:underline focus-visible-ring"
            >
              Daftar Sekarang
            </Link>
          </p>
          <p className="text-xs text-outline">
            Dengan masuk, Anda menyetujui{' '}
            <button
              type="button"
              className="text-accent-primary hover:underline"
              onClick={() => alert('Syarat & Ketentuan')}
            >
              Syarat & Ketentuan
            </button>{' '}
            kami
          </p>
        </div>

        {/* Demo Credentials */}
        <GlassPanel padding="sm">
          <div className="text-xs text-outline space-y-1">
            <p className="font-semibold text-on-surface-variant">Demo Mode:</p>
            <p>Pilih peran apapun dan masukkan kredensial apa saja untuk login</p>
          </div>
        </GlassPanel>
      </div>
    </main>
  )
}
