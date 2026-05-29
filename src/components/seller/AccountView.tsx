'use client'

import { User, ShieldCheck, MapPin, Sparkles, LogOut, ChevronRight, Store } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

import { useRouter } from 'next/navigation'

interface AccountViewProps {
  user: any
  onLogout: () => void
}

export default function AccountView({ user, onLogout }: AccountViewProps) {
  const router = useRouter()
  const menuItems = [
    { id: 'store', label: 'Detail Warung & Lokasi', icon: Store, desc: 'Kelola alamat presisi Maps dan foto warung', path: '/seller/dashboard/account/details' },
    { id: 'hours', label: 'Jam Operasional Ambil', icon: Sparkles, desc: 'Atur batas jam pengambilan porsi sisa', path: '/seller/dashboard/account/hours' },
    { id: 'verification', label: 'Sertifikasi Kehalalan Pangan', icon: ShieldCheck, desc: 'Status verifikasi kelayakan produk UMKM', path: '/seller/dashboard/account/halal-verification' },
    { id: 'wallet', label: 'Informasi Dompet & Pencairan', icon: User, desc: 'Kelola rekening bank hasil penjualan surplus', path: '/seller/dashboard/account/wallet' },
  ]

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div>
        <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">Akun Warung</h2>
        <p className="text-xs md:text-sm text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Pengaturan profil mitra & operasional</p>
      </div>

      {/* Profile Card */}
      <Card className="p-5 border border-slate-100 bg-white shadow-sm rounded-2xl flex items-center gap-4">
        <Avatar size="lg" className="w-16 h-16 border-2 border-emerald-100 shadow-sm">
          <AvatarFallback className="bg-emerald-50 text-emerald-700 font-extrabold uppercase text-lg">
            {user.username.slice(0, 2)}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-black text-slate-800 truncate tracking-tight">{user.username}</h3>
          <p className="text-xs text-slate-400 font-medium mb-2">{user.email || 'warung@sisarasa.id'}</p>
          
          <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100/50 rounded-full font-bold text-[9px] px-2 py-0.5 tracking-wider">
            MITRA WARUNG PREMIUM
          </Badge>
        </div>
      </Card>

      {/* Menu Settings List */}
      <div className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => router.push(item.path)}
              className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-50 hover:border-emerald-100 bg-white hover:bg-slate-50/50 transition-all duration-200 text-left active:scale-[0.99]"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                  <Icon className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="min-w-0">
                  <span className="text-sm font-extrabold text-slate-800 block">{item.label}</span>
                  <span className="text-xs text-slate-400 font-medium truncate block">{item.desc}</span>
                </div>
              </div>
              
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </button>
          )
        })}
      </div>

      {/* Action Button: Logout */}
      <div className="pt-4">
        <Button
          onClick={onLogout}
          variant="outline"
          className="w-full justify-center gap-2 border-red-100 text-[#FF4D4D] hover:bg-red-50 hover:text-[#FF4D4D] font-extrabold py-5 rounded-2xl transition-all flex items-center"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span>Keluar dari Aplikasi</span>
        </Button>
      </div>
    </div>
  )
}
