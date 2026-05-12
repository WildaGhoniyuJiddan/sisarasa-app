'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { getFreshnessStatus, freshnessShortLabel, freshnessDotClass, formatPrice, formatHours, getDiscountPercent } from '@/lib/utils';

export default function SellerStockPage() {
  const { products, currentUser, updateProductStatus, activateDonation } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<'all' | 'available' | 'discounted' | 'donation'>('all');

  const myProducts = products.filter((p) => p.stallId === currentUser.id);
  const filtered = filter === 'all' ? myProducts : myProducts.filter((p) => p.status === filter);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <span className="label label-cyan">Manajemen Stok</span>
            <h1 style={{ fontSize: 20, marginTop: 2 }}>Produk Saya</h1>
          </div>
          <button
            id="btn-add-product"
            className="btn-primary"
            style={{ fontSize: 12, padding: '8px 14px' }}
            onClick={() => setShowForm(true)}
          >
            + Tambah
          </button>
        </div>

        {/* Filter chips */}
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2 }}>
          {(['all', 'available', 'discounted', 'donation'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                flexShrink: 0,
                padding: '5px 12px',
                borderRadius: 20,
                border: `1px solid ${filter === f ? 'var(--cyan)' : 'var(--border)'}`,
                background: filter === f ? 'var(--cyan-dim)' : 'transparent',
                color: filter === f ? 'var(--cyan)' : 'var(--text-muted)',
                fontSize: 11,
                fontFamily: 'var(--font-sans)',
                fontWeight: filter === f ? 700 : 400,
                cursor: 'pointer',
                letterSpacing: '0.05em',
                transition: 'all 0.15s ease',
              }}
            >
              {f === 'all' ? 'Semua' : f === 'available' ? 'Tersedia' : f === 'discounted' ? 'Diskon' : 'Donasi'}
            </button>
          ))}
        </div>
      </div>

      {/* Camera / Add Product Prompt */}
      <div
        className="fade-up card card-orange"
        style={{ padding: '18px 20px', marginBottom: 20, cursor: 'pointer' }}
        onClick={() => setShowForm(true)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 12,
              background: 'var(--orange-dim)',
              border: '1px solid var(--orange-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 26,
              flexShrink: 0,
            }}
          >
            📷
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 3 }}>
              Tambah Produk via Kamera (AI Vision)
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Foto makanan → AI kenali nama, kategori & harga otomatis
            </div>
          </div>
          <div style={{ marginLeft: 'auto', color: 'var(--orange)', fontSize: 18 }}>→</div>
        </div>
      </div>

      {/* Product list */}
      <div className="fade-up-1" style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)', fontSize: 13 }}>
            Tidak ada produk di kategori ini.
          </div>
        )}
        {filtered.map((product) => {
          const freshness = getFreshnessStatus(product.cookedAt);
          const isDonation = product.isDonation || product.status === 'donation';
          const discount = getDiscountPercent(product);
          return (
            <div key={product.id} className="card" style={{ padding: '16px', position: 'relative', overflow: 'hidden' }}>
              <div className={`status-strip status-strip-${isDonation ? 'donation' : freshness}`} />
              <div style={{ paddingLeft: 10 }}>
                {/* Top row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                  <div
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 10,
                      background: 'var(--surface-2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 26,
                      flexShrink: 0,
                    }}
                  >
                    {product.imageEmoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
                      {product.name}
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                      <span className={`badge badge-${isDonation ? 'recipient' : freshness === 'fresh' ? 'cyan' : freshness === 'warn' ? 'orange' : 'urgent'}`}>
                        <span className={freshnessDotClass(freshness)} style={{ width: 5, height: 5 }} />
                        {isDonation ? 'Donasi' : freshnessShortLabel(freshness)}
                      </span>
                      <span className="badge badge-gray">{formatHours(product.cookedAt)} lalu</span>
                      <span className="badge badge-gray">{product.qty} porsi</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div className="data-text" style={{ fontSize: 14, fontWeight: 700, color: isDonation ? 'var(--donation-green)' : discount > 0 ? 'var(--orange)' : 'var(--text-primary)' }}>
                      {isDonation ? 'GRATIS' : formatPrice(product.currentPrice)}
                    </div>
                    {discount > 0 && !isDonation && (
                      <div className="data-text" style={{ fontSize: 10, color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                        {formatPrice(product.normalPrice)}
                      </div>
                    )}
                    {discount > 0 && !isDonation && (
                      <span className="badge badge-urgent" style={{ marginTop: 4 }}>-{discount}%</span>
                    )}
                  </div>
                </div>

                {/* Action row */}
                <div style={{ display: 'flex', gap: 8, borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                  {!isDonation && product.status !== 'sold' && (
                    <>
                      <button
                        className="btn-ghost"
                        style={{ fontSize: 11, padding: '6px 12px', flex: 1 }}
                        onClick={() => updateProductStatus(product.id, 'discounted')}
                        disabled={product.status === 'discounted'}
                      >
                        Aktifkan Diskon
                      </button>
                      <button
                        className="btn-donation"
                        style={{ fontSize: 11, padding: '6px 12px', flex: 1 }}
                        onClick={() => activateDonation(product.id)}
                      >
                        Donasikan 💚
                      </button>
                    </>
                  )}
                  {isDonation && (
                    <div style={{ fontSize: 12, color: 'var(--donation-green)', fontWeight: 600 }}>
                      ✓ Mode donasi aktif — menunggu klaim panti
                    </div>
                  )}
                  {product.status === 'sold' && (
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Habis terjual</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Product Modal (simplified) */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: 18 }}>Tambah Produk</h2>
              <button
                onClick={() => setShowForm(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 20 }}
              >
                ×
              </button>
            </div>

            {/* Camera placeholder */}
            <div
              style={{
                height: 160,
                background: 'var(--surface-2)',
                border: '2px dashed var(--border-strong)',
                borderRadius: 12,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                marginBottom: 20,
                cursor: 'pointer',
              }}
            >
              <span style={{ fontSize: 36 }}>📷</span>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Tap untuk foto produk</span>
              <span className="badge badge-cyan">AI Vision Aktif</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
              <div>
                <label className="label">Nama Produk</label>
                <input className="input" type="text" placeholder="Nasi Gudeg Komplit..." />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div>
                  <label className="label">Harga Normal</label>
                  <input className="input" type="number" placeholder="22000" />
                </div>
                <div>
                  <label className="label">Jumlah Porsi</label>
                  <input className="input" type="number" placeholder="10" />
                </div>
              </div>
            </div>

            <button className="btn-primary" style={{ width: '100%' }} onClick={() => setShowForm(false)}>
              Simpan Produk →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
