'use client';

import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { formatPrice, formatTimeAgo } from '@/lib/utils';
import { TransactionStatus } from '@/types';

const STATUS_CONFIG: Record<TransactionStatus, { label: string; badge: string; icon: string }> = {
  waiting_pickup:  { label: 'Menunggu Pengambilan', badge: 'badge-orange',  icon: '🕐' },
  waiting_proof:   { label: 'Menunggu Bukti Foto',  badge: 'badge-urgent',  icon: '📸' },
  proof_submitted: { label: 'Bukti Terkirim',       badge: 'badge-cyan',    icon: '✅' },
  completed:       { label: 'Selesai',               badge: 'badge-recipient', icon: '🎉' },
  cancelled:       { label: 'Dibatalkan',            badge: 'badge-gray',   icon: '✕' },
};

export default function ConsumerTransactionsPage() {
  const { transactions, currentUser } = useApp();
  const router = useRouter();

  const sorted = [...transactions].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );

  const completedCount = transactions.filter((t) => t.status === 'completed').length;
  const donationCount = transactions.filter((t) => t.type === 'donation_claim').length;
  const totalSpent = transactions
    .filter((t) => t.status === 'completed' && t.type === 'purchase')
    .reduce((s, t) => s + t.totalPrice, 0);

  return (
    <div className="page-container">
      {/* Header */}
      <div className="page-header" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <span className="label label-cyan">Riwayat</span>
        <h1 style={{ fontSize: 20, marginTop: 2 }}>Transaksi & Donasi</h1>
      </div>

      {/* Stats */}
      <div
        className="fade-up"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 20 }}
      >
        {[
          { label: 'Selesai',   value: completedCount,           color: 'var(--cyan)' },
          { label: 'Donasi',    value: donationCount,            color: 'var(--donation-green)' },
          { label: 'Dihemat',   value: formatPrice(totalSpent),  color: 'var(--orange)' },
        ].map(({ label, value, color }) => (
          <div key={label} className="card" style={{ padding: '14px 10px', textAlign: 'center' }}>
            <div className="data-text" style={{ fontSize: typeof value === 'string' ? 11 : 22, fontWeight: 700, color }}>
              {value}
            </div>
            <div className="label" style={{ marginBottom: 0, marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Transaction list */}
      <div className="fade-up-1" style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
        {sorted.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Belum ada transaksi</div>
          </div>
        )}

        {sorted.map((txn) => {
          const statusCfg = STATUS_CONFIG[txn.status];
          const isDonation = txn.type === 'donation_claim';
          const needsAction = txn.status === 'waiting_proof';

          return (
            <div
              key={txn.id}
              className="card"
              style={{
                overflow: 'hidden',
                border: needsAction ? '1px solid var(--urgent-dim)' : undefined,
                boxShadow: needsAction ? '0 0 16px rgba(255,61,31,0.1)' : undefined,
              }}
            >
              {/* Top accent for urgent */}
              {needsAction && (
                <div style={{ height: 2, background: 'linear-gradient(90deg, transparent, var(--urgent), transparent)', backgroundSize: '200%', animation: 'shimmer 2s linear infinite' }} />
              )}

              <div style={{ padding: '14px 16px' }}>
                {/* Row 1: emoji + name + status */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 10 }}>
                  <div
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 10,
                      background: isDonation ? 'var(--donation-dim)' : 'var(--surface-2)',
                      border: `1px solid ${isDonation ? 'rgba(46,232,154,0.3)' : 'var(--border)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 24,
                      flexShrink: 0,
                    }}
                  >
                    {txn.productEmoji}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 3, lineHeight: 1.3 }}>
                      {txn.productName}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 6 }}>
                      {txn.stallName}
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                      <span className={`badge ${statusCfg.badge}`}>
                        {statusCfg.icon} {statusCfg.label}
                      </span>
                      {isDonation && <span className="badge badge-recipient">Donasi</span>}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div className="data-text" style={{ fontSize: 14, fontWeight: 700, color: isDonation ? 'var(--donation-green)' : 'var(--text-primary)' }}>
                      {isDonation ? 'GRATIS' : formatPrice(txn.totalPrice)}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 3 }}>
                      {txn.qty} porsi
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 1 }}>
                      {formatTimeAgo(txn.createdAt)}
                    </div>
                  </div>
                </div>

                {/* Pickup info */}
                <div
                  style={{
                    padding: '8px 10px',
                    background: 'var(--surface-2)',
                    borderRadius: 6,
                    marginBottom: needsAction ? 10 : 0,
                    fontSize: 11,
                    color: 'var(--text-secondary)',
                    lineHeight: 1.5,
                  }}
                >
                  📍 {txn.stallAddress} · 📞 {txn.stallPhone}
                </div>

                {/* Action for waiting_proof */}
                {needsAction && (
                  <button
                    className="btn-primary"
                    style={{ width: '100%', fontSize: 12, padding: '10px' }}
                    onClick={() => {/* upload proof */}}
                  >
                    📸 Upload Bukti Foto Penerimaan
                  </button>
                )}

                {/* Notes */}
                {txn.notes && (
                  <div
                    style={{
                      marginTop: 8,
                      padding: '6px 10px',
                      background: 'var(--urgent-dim)',
                      borderRadius: 6,
                      fontSize: 11,
                      color: 'var(--urgent)',
                      fontWeight: 600,
                    }}
                  >
                    ⚠️ {txn.notes}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* CTAs */}
      <div className="fade-up-2" style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        <button
          className="btn-cyan"
          style={{ flex: 1, fontSize: 12 }}
          onClick={() => router.push('/consumer/home')}
        >
          ← Ke Marketplace
        </button>
        <button
          className="btn-ghost"
          style={{ flex: 1, fontSize: 12 }}
          onClick={() => router.push('/consumer/donations')}
        >
          Lihat Donasi
        </button>
      </div>
    </div>
  );
}
