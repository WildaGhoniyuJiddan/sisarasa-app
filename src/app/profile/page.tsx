'use client';

import { useApp } from '@/context/AppContext';
import BottomNav from '@/components/layout/BottomNav';
import RoleBadge from '@/components/layout/RoleBadge';
import { BadgeTier } from '@/types';

const BADGE_TIERS: { tier: BadgeTier; emoji: string; name: string; req: string; color: string }[] = [
  { tier: 'bronze',   emoji: '🥉', name: 'Pahlawan Perunggu', req: '5+ donasi',   color: '#cd7f32' },
  { tier: 'silver',   emoji: '🥈', name: 'Pahlawan Perak',    req: '20+ donasi',  color: '#c0c0c0' },
  { tier: 'gold',     emoji: '🥇', name: 'Pahlawan Emas',     req: '50+ donasi',  color: '#ffd700' },
  { tier: 'platinum', emoji: '💎', name: 'Pahlawan Platinum', req: '100+ donasi', color: '#e5e4e2' },
];

const TIER_ORDER: BadgeTier[] = ['none', 'bronze', 'silver', 'gold', 'platinum'];

export default function ProfilePage() {
  const { currentUser, userRole } = useApp();

  const currentTierIndex = TIER_ORDER.indexOf(currentUser.badgeStatus);
  const progressToNext =
    currentUser.totalDonations < 5  ? currentUser.totalDonations / 5 :
    currentUser.totalDonations < 20 ? (currentUser.totalDonations - 5) / 15 :
    currentUser.totalDonations < 50 ? (currentUser.totalDonations - 20) / 30 :
    currentUser.totalDonations < 100 ? (currentUser.totalDonations - 50) / 50 : 1;

  const activeBadge = BADGE_TIERS.find((b) => b.tier === currentUser.badgeStatus);

  return (
    <>
      <div className="page-container">
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--smoke)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Akun</div>
              <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--cream)', marginTop: 1 }}>Profil</h1>
            </div>
            <RoleBadge />
          </div>
        </div>

        {/* Profile hero */}
        <div className="card fade-up" style={{ padding: 20, marginBottom: 16, background: 'linear-gradient(135deg, var(--ink-soft) 0%, rgba(249,115,22,0.04) 100%)', border: '1px solid var(--ash)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--ink-muted)', border: '2px solid var(--amber)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>
              {userRole === 'seller' ? '🏪' : '🏠'}
            </div>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--cream)', marginBottom: 2 }}>
                {userRole === 'seller' ? currentUser.stallName : currentUser.pantiName}
              </h2>
              <div style={{ fontSize: 12, color: 'var(--smoke)' }}>{currentUser.name}</div>
              <div style={{ fontSize: 11, color: 'var(--smoke)', marginTop: 4 }}>📍 {currentUser.address}</div>
            </div>
          </div>
          {userRole === 'seller' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {[
                { value: currentUser.totalDonations, label: 'Donasi', color: 'var(--amber)', suffix: '' },
                { value: currentUser.stockAccuracy, label: 'Akurasi', color: 'var(--fresh)', suffix: '%' },
                { value: '4.8', label: 'Rating', color: 'var(--warning)', suffix: '★' },
              ].map(({ value, label, color, suffix }) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div className="data-text" style={{ fontSize: 20, fontWeight: 700, color }}>{value}{suffix}</div>
                  <div style={{ fontSize: 10, color: 'var(--smoke)', marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Badge system (seller only) */}
        {userRole === 'seller' && (
          <div style={{ marginBottom: 16 }}>
            <div className="label" style={{ marginBottom: 12 }}>🏆 Pahlawan Pangan</div>
            {activeBadge && (
              <div className="card fade-up-1" style={{ padding: 16, marginBottom: 12, background: `${activeBadge.color}08`, border: `1px solid ${activeBadge.color}44`, display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ fontSize: 48 }}>{activeBadge.emoji}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--cream)' }}>{activeBadge.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--smoke)', marginTop: 3 }}>Badge aktif saat ini</div>
                </div>
              </div>
            )}
            {currentTierIndex < BADGE_TIERS.length && (
              <div className="card fade-up-2" style={{ padding: 14, marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div style={{ fontSize: 12, color: 'var(--silver)' }}>Progress ke {BADGE_TIERS[currentTierIndex]?.name}</div>
                  <div className="data-text" style={{ fontSize: 12, color: 'var(--amber)' }}>{currentUser.totalDonations} / {BADGE_TIERS[currentTierIndex]?.req}</div>
                </div>
                <div style={{ height: 6, background: 'var(--ink-muted)', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.min(progressToNext * 100, 100)}%`, background: 'linear-gradient(90deg, var(--amber), var(--amber-soft))', borderRadius: 3, boxShadow: '0 0 8px var(--amber-glow)', transition: 'width 0.6s ease' }} />
                </div>
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
              {BADGE_TIERS.map((b, i) => {
                const unlocked = TIER_ORDER.indexOf(currentUser.badgeStatus) >= TIER_ORDER.indexOf(b.tier);
                return (
                  <div key={b.tier} className="card fade-up" style={{ animationDelay: `${i * 0.07}s`, padding: 14, opacity: unlocked ? 1 : 0.4, borderColor: unlocked ? `${b.color}44` : 'var(--ink-muted)', background: unlocked ? `${b.color}08` : 'var(--ink-soft)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 28, filter: unlocked ? 'none' : 'grayscale(1)' }}>{b.emoji}</span>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: unlocked ? 'var(--cream)' : 'var(--smoke)' }}>{b.name}</div>
                        <div style={{ fontSize: 10, color: 'var(--smoke)', marginTop: 1 }}>{b.req}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Sanction notice (recipient) */}
        {userRole === 'recipient' && (
          <div className="card fade-up-1" style={{ padding: 16, marginBottom: 16, background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--critical)', marginBottom: 8 }}>⚠ Sistem Sanksi</div>
            <p style={{ fontSize: 12, color: 'var(--silver)', lineHeight: 1.7 }}>
              Akun dibekukan otomatis jika tidak mengunggah bukti foto dalam <strong style={{ color: 'var(--cream)' }}>24 jam</strong> setelah konfirmasi donasi.
            </p>
          </div>
        )}

        {/* Settings */}
        <div style={{ marginBottom: 16 }}>
          <div className="label" style={{ marginBottom: 10 }}>Pengaturan</div>
          {[
            { icon: '🔔', label: 'Notifikasi', sub: 'Aktif' },
            { icon: '📍', label: 'Lokasi', sub: 'Pasar Minggu' },
            { icon: '🔒', label: 'Privasi & Keamanan', sub: '' },
            { icon: '❓', label: 'Bantuan', sub: '' },
          ].map(({ icon, label, sub }) => (
            <button key={label} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px', background: 'var(--ink-soft)', border: '1px solid var(--ink-muted)', borderRadius: 8, cursor: 'pointer', fontFamily: 'var(--font-mono)', color: 'var(--cream)', marginBottom: 6 }}>
              <span style={{ fontSize: 18 }}>{icon}</span>
              <span style={{ flex: 1, textAlign: 'left', fontSize: 13 }}>{label}</span>
              {sub && <span style={{ fontSize: 11, color: 'var(--smoke)' }}>{sub}</span>}
              <span style={{ color: 'var(--smoke)' }}>›</span>
            </button>
          ))}
        </div>

        <button className="btn-danger" style={{ width: '100%' }} onClick={() => window.location.href = '/'}>
          Keluar dari Akun
        </button>
      </div>
      <BottomNav />
    </>
  );
}
