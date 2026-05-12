'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import FoodCard from '@/components/FoodCard';
import { Product } from '@/types';
import { mockWarungs } from '@/data/mock';

type FilterType = 'all' | 'discounted' | 'donation';

const FILTER_OPTIONS: { key: FilterType; label: string; icon: string }[] = [
  { key: 'all',        label: 'Semua',   icon: '🗂️' },
  { key: 'discounted', label: 'Diskon',  icon: '🏷️' },
  { key: 'donation',   label: 'Gratis',  icon: '🤝' },
];

export default function ConsumerHomePage() {
  const { products } = useApp();
  const [filter, setFilter] = useState<FilterType>('all');
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [claimedProduct, setClaimedProduct] = useState<Product | null>(null);
  const [boughtProduct, setBoughtProduct] = useState<Product | null>(null);

  const filtered = products
    .filter((p) => p.status !== 'sold')
    .filter((p) => {
      if (filter === 'discounted') return p.status === 'discounted';
      if (filter === 'donation')   return p.status === 'donation' || p.isDonation;
      return true;
    })
    .filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.stallName.toLowerCase().includes(search.toLowerCase())
    );

  const donationCount    = products.filter((p) => p.status === 'donation' || p.isDonation).length;
  const discountedCount  = products.filter((p) => p.status === 'discounted').length;

  return (
    <div className="page-container">
      {/* ── Header */}
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}>
              Pasar Digital
            </div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginTop: 2 }}>
              Marketplace
            </h1>
          </div>
          <div className="badge badge-cyan">🛒 Konsumen</div>
        </div>

        {/* Search bar */}
        <div style={{ position: 'relative', marginBottom: 10 }}>
          <span style={{
            position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)',
            color: 'var(--text-muted)', fontSize: 15, pointerEvents: 'none',
          }}>🔍</span>
          <input
            id="marketplace-search"
            className="input"
            placeholder="Cari menu atau nama warung…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: 38 }}
          />
        </div>

        {/* Filter pills */}
        <div style={{ display: 'flex', gap: 7, overflowX: 'auto', paddingBottom: 2 }}>
          {FILTER_OPTIONS.map(({ key, label, icon }) => {
            const isActive = filter === key;
            return (
              <button
                key={key}
                id={`filter-${key}`}
                onClick={() => setFilter(key)}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  padding: '6px 14px', borderRadius: 100,
                  border: `1.5px solid ${isActive ? 'var(--cyan)' : 'var(--surface-3)'}`,
                  background: isActive ? 'var(--cyan-dim)' : 'transparent',
                  color: isActive ? 'var(--cyan)' : 'var(--text-muted)',
                  fontSize: 12, fontWeight: isActive ? 700 : 400,
                  cursor: 'pointer', transition: 'all 0.15s ease',
                  fontFamily: 'var(--font-mono)', whiteSpace: 'nowrap', flexShrink: 0,
                }}
              >
                {icon} {label}
                {key === 'donation' && donationCount > 0 && (
                  <span style={{
                    background: 'var(--donation-green)', color: '#0A1F1A',
                    borderRadius: '50%', width: 18, height: 18,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 800,
                  }}>{donationCount}</span>
                )}
                {key === 'discounted' && discountedCount > 0 && (
                  <span style={{
                    background: 'var(--orange)', color: '#fff',
                    borderRadius: '50%', width: 18, height: 18,
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 800,
                  }}>{discountedCount}</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Summary strip */}
      <div className="fade-up" style={{ display: 'flex', gap: 10, marginBottom: 20, overflowX: 'auto' }}>
        {[
          { icon: '🏷️', value: `${discountedCount}`, label: 'Sedang Diskon', color: 'var(--orange)' },
          { icon: '🤝', value: `${donationCount}`,   label: 'Open Donasi',   color: 'var(--donation-green)' },
          { icon: '📍', value: '< 2 km',             label: 'Terdekat',      color: 'var(--cyan)' },
        ].map(({ icon, value, label, color }) => (
          <div key={label} style={{
            flexShrink: 0, background: 'var(--surface-1)',
            border: '1px solid var(--border)', borderRadius: 12,
            padding: '12px 16px', minWidth: 100,
          }}>
            <div style={{ fontSize: 18, marginBottom: 4 }}>{icon}</div>
            <div className="data-text" style={{ fontSize: 16, fontWeight: 800, color }}>{value}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2, letterSpacing: '0.06em' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* ── Location banner */}
      <div className="fade-up-1" style={{
        background: 'var(--surface-1)', border: '1px solid var(--border)',
        borderRadius: 12, padding: '12px 16px', marginBottom: 20,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <span style={{ fontSize: 20 }}>📍</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>Pasar Minggu, Jakarta Selatan</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Menampilkan {filtered.length} menu dalam radius 5 km</div>
        </div>
        <button style={{
          background: 'none', border: '1px solid var(--border)', borderRadius: 6,
          color: 'var(--cyan)', fontSize: 11, padding: '4px 10px',
          cursor: 'pointer', fontFamily: 'var(--font-mono)', fontWeight: 600,
        }}>Ubah</button>
      </div>

      {/* ── Warung horizontal scroll */}
      <div className="fade-up-2" style={{ marginBottom: 24 }}>
        <div className="label" style={{ marginBottom: 10 }}>🏪 Warung Terdekat</div>
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 4 }}>
          {mockWarungs.map((warung) => (
            <div key={warung.id} style={{
              flexShrink: 0, width: 130,
              background: 'var(--surface-1)', border: '1px solid var(--border)',
              borderRadius: 12, padding: '12px',
              display: 'flex', flexDirection: 'column', gap: 6, cursor: 'pointer',
              transition: 'border-color 0.2s',
            }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--cyan-border)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              <div style={{ fontSize: 32, textAlign: 'center' }}>{warung.imageEmoji}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.3 }}>
                {warung.name}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                <span>⭐</span> {warung.rating}
              </div>
              <div style={{ fontSize: 10, color: 'var(--cyan)', fontFamily: 'var(--font-mono)' }}>
                {warung.distanceKm} km
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Product grid */}
      <div className="fade-up-3">
        <div className="label" style={{ marginBottom: 12 }}>
          {filter === 'donation' ? '🤝 Donasi Tersedia' : filter === 'discounted' ? '🏷️ Menu Diskon' : '🍽️ Semua Menu'}
        </div>
        {filtered.length === 0 ? (
          <div style={{
            padding: '48px 20px', textAlign: 'center',
            border: '2px dashed var(--surface-3)', borderRadius: 16,
            color: 'var(--text-muted)',
          }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>🍽️</div>
            <div style={{ fontSize: 14 }}>Tidak ada menu ditemukan</div>
            <div style={{ fontSize: 12, marginTop: 6 }}>Coba ubah filter atau pencarian</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {filtered.map((product, i) => (
              <div key={product.id} className="fade-up" style={{ animationDelay: `${i * 0.04}s` }}>
                <FoodCard
                  product={product}
                  onBuy={(p) => setBoughtProduct(p)}
                  onClaim={(p) => setClaimedProduct(p)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Buy confirmation modal */}
      {boughtProduct && (
        <div className="modal-overlay" onClick={() => setBoughtProduct(null)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 52, marginBottom: 8 }}>{boughtProduct.imageEmoji}</div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{boughtProduct.name}</h2>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{boughtProduct.stallName}</div>
            </div>
            <div style={{
              background: 'var(--surface-2)', borderRadius: 12, padding: '16px', marginBottom: 20,
              border: '1px solid var(--border)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Harga</span>
                <span className="data-text" style={{ fontWeight: 700, color: 'var(--orange)', fontSize: 15 }}>
                  Rp{boughtProduct.currentPrice.toLocaleString('id')}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: 13 }}>Stok tersisa</span>
                <span className="data-text" style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: 13 }}>
                  {boughtProduct.qty} porsi
                </span>
              </div>
            </div>
            <button className="btn-primary" style={{ width: '100%', marginBottom: 10, padding: '14px', fontSize: 15 }}
              onClick={() => setBoughtProduct(null)}>
              ✓ Konfirmasi Pembelian
            </button>
            <button className="btn-ghost" style={{ width: '100%' }} onClick={() => setBoughtProduct(null)}>
              Batal
            </button>
          </div>
        </div>
      )}

      {/* ── Claim donation modal */}
      {claimedProduct && (
        <div className="modal-overlay" onClick={() => setClaimedProduct(null)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 52, marginBottom: 8 }}>{claimedProduct.imageEmoji}</div>
              <div className="badge badge-recipient" style={{ marginBottom: 10 }}>DONASI GRATIS</div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>{claimedProduct.name}</h2>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{claimedProduct.stallName}</div>
            </div>
            <div style={{
              background: 'rgba(46,232,154,0.06)', borderRadius: 12, padding: '14px',
              border: '1px solid rgba(46,232,154,0.2)', marginBottom: 20,
              fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6,
            }}>
              ⚠️ Setelah klaim, Anda bertanggung jawab untuk mengambil donasi ini dalam <strong style={{ color: 'var(--warn)' }}>24 jam</strong>. Upload bukti foto penggunaan donasi wajib dilakukan.
            </div>
            <button className="btn-donation" style={{ width: '100%', marginBottom: 10, padding: '14px', fontSize: 15 }}
              onClick={() => setClaimedProduct(null)}>
              🤝 Klaim Donasi Ini
            </button>
            <button className="btn-ghost" style={{ width: '100%' }} onClick={() => setClaimedProduct(null)}>
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
