'use client';

import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { getFreshnessStatus, formatPrice, formatHours, freshnessShortLabel, freshnessDotClass, formatTimeAgo } from '@/lib/utils';

export default function SellerDashboard() {
  const { currentUser, products, aiInsights, donationLogs, activateDonation } = useApp();
  const router = useRouter();

  const myProducts = products.filter((p) => p.stallId === currentUser.id);
  const availableCount = myProducts.filter((p) => p.status !== 'sold').length;
  const donationCount = myProducts.filter((p) => p.isDonation || p.status === 'donation').length;
  const totalQty = myProducts.reduce((s, p) => s + p.qty, 0);

  const urgentInsights = aiInsights.filter((i) => i.urgency === 'high');
  const otherInsights = aiInsights.filter((i) => i.urgency !== 'high');

  return (
    <div className="page-container">
      {/* ── Header */}
      <div className="page-header" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span className="label label-cyan">Dashboard Penjual</span>
            <h1 style={{ fontSize: 20, marginTop: 2 }}>
              {currentUser.stallName ?? currentUser.name}
            </h1>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className={`badge badge-${currentUser.badgeStatus === 'none' ? 'gray' : 'orange'}`}>
              {currentUser.badgeStatus === 'none' ? 'Anggota' : `🏅 ${currentUser.badgeStatus}`}
            </span>
            <button
              onClick={() => router.push('/login')}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 12, fontFamily: 'var(--font-sans)' }}
            >
              Ganti ↔
            </button>
          </div>
        </div>
      </div>

      {/* ── Stats row */}
      <div className="fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}>
        {[
          { label: 'Menu Aktif', value: availableCount, color: 'var(--cyan)' },
          { label: 'Total Stok', value: totalQty, color: 'var(--text-primary)' },
          { label: 'Donasi', value: donationLogs.length, color: 'var(--donation-green)' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card" style={{ padding: '14px 12px', textAlign: 'center' }}>
            <div className="data-text" style={{ fontSize: 22, fontWeight: 700, color }}>
              {value}
            </div>
            <div className="label" style={{ marginBottom: 0, marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* ── Stock accuracy */}
      <div className="fade-up-1 card card-cyan" style={{ padding: '14px 16px', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <span className="label label-cyan" style={{ marginBottom: 0 }}>Akurasi Stok AI</span>
          <span className="data-text" style={{ fontSize: 18, fontWeight: 700, color: 'var(--cyan)' }}>
            {currentUser.stockAccuracy}%
          </span>
        </div>
        <div style={{ height: 6, background: 'var(--surface-3)', borderRadius: 4, overflow: 'hidden' }}>
          <div
            style={{
              height: '100%',
              width: `${currentUser.stockAccuracy}%`,
              background: 'linear-gradient(90deg, var(--cyan), #1DBDAD)',
              borderRadius: 4,
              transition: 'width 0.8s ease',
            }}
          />
        </div>
      </div>

      {/* ── AI Insights */}
      <div className="fade-up-2" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span className="label" style={{ marginBottom: 0 }}>✦ AI Insight</span>
          <span className="badge badge-cyan">{aiInsights.length} insight</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {urgentInsights.map((insight) => (
            <div key={insight.id} className="insight-card insight-card-urgent" style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>⚠️</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span className="badge badge-urgent">Urgent</span>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4, lineHeight: 1.3 }}>
                    {insight.title}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: 10 }}>
                    {insight.body}
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn-primary" style={{ fontSize: 11, padding: '7px 12px' }}>
                      {insight.actionLabel} →
                    </button>
                    {insight.type === 'donation_prompt' && (
                      <button
                        className="btn-donation"
                        style={{ fontSize: 11, padding: '7px 12px' }}
                        onClick={() => insight.relatedProductId && activateDonation(insight.relatedProductId)}
                      >
                        Donasikan
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {otherInsights.map((insight) => (
            <div key={insight.id} className="insight-card" style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>
                  {insight.type === 'stock_optimum' ? '✅' : '💡'}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4, lineHeight: 1.3 }}>
                    {insight.title}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: 8 }}>
                    {insight.body}
                  </div>
                  <button className="btn-cyan" style={{ fontSize: 11, padding: '6px 12px' }}>
                    {insight.actionLabel}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── My Products */}
      <div className="fade-up-3" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span className="label" style={{ marginBottom: 0 }}>Stok Saya</span>
          <button
            className="btn-ghost"
            style={{ fontSize: 11, padding: '5px 10px' }}
            onClick={() => router.push('/seller/stock')}
          >
            + Tambah
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {myProducts.map((product) => {
            const freshness = getFreshnessStatus(product.cookedAt);
            const isDonation = product.isDonation || product.status === 'donation';
            return (
              <div key={product.id} className="card" style={{ padding: '14px 16px', position: 'relative', overflow: 'hidden' }}>
                <div className={`status-strip status-strip-${isDonation ? 'donation' : freshness}`} />
                <div style={{ paddingLeft: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 10,
                      background: 'var(--surface-2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 24,
                      flexShrink: 0,
                    }}
                  >
                    {product.imageEmoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 3 }}>
                      {product.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <span className={`badge badge-${isDonation ? 'recipient' : freshness === 'fresh' ? 'cyan' : freshness === 'warn' ? 'orange' : 'urgent'}`}>
                        <span className={freshnessDotClass(freshness)} style={{ width: 5, height: 5 }} />
                        {isDonation ? 'Donasi' : freshnessShortLabel(freshness)}
                      </span>
                      <span className="badge badge-gray">{product.qty} porsi</span>
                      <span className="data-text" style={{ fontSize: 10, color: 'var(--text-muted)' }}>
                        {formatHours(product.cookedAt)} lalu
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div className="data-text" style={{ fontSize: 13, fontWeight: 700, color: isDonation ? 'var(--donation-green)' : 'var(--text-primary)' }}>
                      {isDonation ? 'GRATIS' : formatPrice(product.currentPrice)}
                    </div>
                    {product.currentPrice < product.normalPrice && !isDonation && (
                      <div className="data-text" style={{ fontSize: 10, color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                        {formatPrice(product.normalPrice)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Donation history */}
      {donationLogs.length > 0 && (
        <div className="fade-up-4" style={{ marginBottom: 20 }}>
          <span className="label" style={{ marginBottom: 12 }}>Riwayat Donasi</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {donationLogs.map((log) => (
              <div key={log.id} className="card" style={{ padding: '12px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 22 }}>{log.productEmoji}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{log.productName}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{log.receiverName}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className={`badge badge-${log.status === 'completed' ? 'cyan' : log.status === 'pending' ? 'orange' : 'gray'}`}>
                      {log.status === 'completed' ? '✓ Selesai' : log.status === 'pending' ? 'Menunggu' : log.status}
                    </span>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 4 }}>{formatTimeAgo(log.createdAt)}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
