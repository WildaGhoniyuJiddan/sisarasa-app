'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import BottomNav from '@/components/layout/BottomNav';
import CountdownTimer from '@/components/ui/CountdownTimer';
import { formatTimeAgo, formatPrice } from '@/lib/utils';

const STATUS_CONFIG: Record<
  'pending' | 'confirmed' | 'completed' | 'expired',
  { label: string; color: string; bg: string; step: number }
> = {
  pending:   { label: 'Menunggu Konfirmasi', color: 'var(--warning)', bg: 'rgba(245,158,11,0.1)', step: 1 },
  confirmed: { label: 'Dijadwalkan',         color: 'var(--amber)',   bg: 'rgba(249,115,22,0.1)', step: 2 },
  completed: { label: 'Selesai',             color: 'var(--fresh)',   bg: 'rgba(34,197,94,0.1)',  step: 3 },
  expired:   { label: 'Kedaluwarsa',         color: 'var(--smoke)',   bg: 'rgba(107,114,128,0.1)', step: 0 },
};

export default function ActivityPage() {
  const { donationLogs, userRole } = useApp();
  const [proofUploaded, setProofUploaded] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'donations' | 'sales'>('donations');

  const handleProofUpload = (logId: string) => {
    setProofUploaded((prev) => [...prev, logId]);
  };

  const mockSales = [
    { id: 's1', name: 'Nasi Gudeg Komplit', emoji: '🍛', qty: 4, price: 16500, time: new Date(Date.now() - 45 * 60000) },
    { id: 's2', name: 'Ayam Bakar', emoji: '🍗', qty: 2, price: 28000, time: new Date(Date.now() - 2 * 60 * 60000) },
    { id: 's3', name: 'Es Teh Manis', emoji: '🧋', qty: 8, price: 5000, time: new Date(Date.now() - 3 * 60 * 60000) },
    { id: 's4', name: 'Soto Betawi', emoji: '🍲', qty: 3, price: 18000, time: new Date(Date.now() - 5 * 60 * 60000) },
  ];

  const totalRevenue = mockSales.reduce((sum, s) => sum + s.price * s.qty, 0);

  return (
    <>
      <div className="page-container">
        {/* Header */}
        <div className="page-header">
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: 'var(--smoke)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Riwayat
            </div>
            <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--cream)', marginTop: 1 }}>
              Aktivitas
            </h1>
          </div>

          {/* Tabs */}
          <div
            style={{
              display: 'flex', background: 'var(--ink-soft)',
              borderRadius: 6, padding: 3, border: '1px solid var(--ink-muted)',
            }}
          >
            {(['donations', 'sales'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1, padding: '7px 0', borderRadius: 4, border: 'none',
                  background: activeTab === tab ? 'var(--amber)' : 'transparent',
                  color: activeTab === tab ? 'var(--ink)' : 'var(--smoke)',
                  fontFamily: 'var(--font-mono)', fontSize: 12, fontWeight: 700,
                  cursor: 'pointer', transition: 'all 0.15s ease',
                }}
              >
                {tab === 'donations' ? '🤝 Donasi' : '💰 Penjualan'}
              </button>
            ))}
          </div>
        </div>

        {/* Donations tab */}
        {activeTab === 'donations' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {donationLogs.length === 0 && (
              <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--smoke)' }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>🤝</div>
                <div>Belum ada riwayat donasi</div>
              </div>
            )}
            {donationLogs.map((log, i) => {
              const sc = STATUS_CONFIG[log.status];
              const isProofUploaded = log.proofPhotoUrl || proofUploaded.includes(log.id);

              return (
                <div
                  key={log.id}
                  className="card fade-up"
                  style={{ animationDelay: `${i * 0.07}s`, padding: 16 }}
                >
                  {/* Top */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                    <div
                      style={{
                        width: 48, height: 48, fontSize: 26,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'var(--ink-muted)', borderRadius: 8,
                        border: '1px solid var(--ash)', flexShrink: 0,
                      }}
                    >
                      {log.productEmoji}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--cream)', marginBottom: 2 }}>
                        {log.productName}
                      </h3>
                      <div style={{ fontSize: 11, color: 'var(--smoke)', marginBottom: 4 }}>
                        {log.stallName} · {log.qty} porsi · {formatTimeAgo(log.createdAt)}
                      </div>
                      <span
                        className="badge"
                        style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.color}44` }}
                      >
                        {sc.label}
                      </span>
                    </div>
                  </div>

                  {/* Progress steps */}
                  <div
                    style={{
                      display: 'flex', alignItems: 'center', gap: 0,
                      marginBottom: 12, position: 'relative',
                    }}
                  >
                    {['Diajukan', 'Dikonfirmasi', 'Selesai'].map((step, idx) => {
                      const stepNum = idx + 1;
                      const isDone = sc.step >= stepNum;
                      const isCurrent = sc.step === stepNum;
                      return (
                        <div key={step} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                          {idx < 2 && (
                            <div
                              style={{
                                position: 'absolute', top: 10, left: '50%', right: '-50%',
                                height: 2, background: isDone && sc.step > stepNum ? sc.color : 'var(--ash)',
                                transition: 'background 0.3s ease',
                              }}
                            />
                          )}
                          <div
                            style={{
                              width: 20, height: 20, borderRadius: '50%', zIndex: 1,
                              background: isDone ? sc.color : 'var(--ash)',
                              border: isCurrent ? `3px solid ${sc.color}` : '2px solid transparent',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: 10, fontWeight: 700, color: isDone ? 'var(--ink)' : 'var(--smoke)',
                              transition: 'all 0.3s ease',
                            }}
                          >
                            {isDone ? '✓' : stepNum}
                          </div>
                          <div style={{ fontSize: 9, color: isDone ? sc.color : 'var(--smoke)', marginTop: 4, letterSpacing: '0.04em' }}>
                            {step}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Pending actions */}
                  {log.status === 'pending' && (
                    <div
                      style={{
                        background: 'var(--ink-muted)', borderRadius: 6,
                        padding: 12, marginBottom: 10,
                        border: '1px solid var(--ash)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: 11, color: 'var(--smoke)', marginBottom: 2 }}>Batas upload bukti</div>
                          <CountdownTimer
                            targetDate={log.expiredAt}
                            label=""
                            size="md"
                          />
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 11, color: 'var(--smoke)', marginBottom: 4 }}>Hubungi penjual</div>
                          <a
                            href={`https://wa.me/6208123456789`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: 4,
                              background: 'rgba(37,211,102,0.12)', border: '1px solid rgba(37,211,102,0.3)',
                              color: '#25d366', borderRadius: 4, padding: '5px 10px',
                              textDecoration: 'none', fontSize: 12, fontWeight: 600,
                              fontFamily: 'var(--font-mono)',
                            }}
                          >
                            💬 WhatsApp
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Upload proof */}
                  {(log.status === 'confirmed' || log.status === 'pending') && !isProofUploaded && (
                    <button
                      className="btn-ghost"
                      style={{ width: '100%', fontSize: 12 }}
                      onClick={() => handleProofUpload(log.id)}
                    >
                      📷 Upload Bukti Foto Terima
                    </button>
                  )}

                  {isProofUploaded && log.status !== 'completed' && (
                    <div
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
                        background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)',
                        borderRadius: 6, color: 'var(--fresh)', fontSize: 12,
                      }}
                    >
                      ✅ Bukti foto telah diunggah — menunggu verifikasi
                    </div>
                  )}

                  {log.status === 'completed' && (
                    <div
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
                        background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)',
                        borderRadius: 6, color: 'var(--fresh)', fontSize: 12,
                      }}
                    >
                      ✅ Donasi berhasil diselesaikan
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Sales tab */}
        {activeTab === 'sales' && (
          <>
            {/* Revenue summary */}
            <div
              className="fade-up"
              style={{
                background: 'linear-gradient(135deg, var(--ink-soft), rgba(249,115,22,0.06))',
                border: '1px solid var(--amber)',
                borderRadius: 10, padding: 16, marginBottom: 16,
              }}
            >
              <div style={{ fontSize: 11, color: 'var(--smoke)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 4 }}>
                Pendapatan Hari Ini
              </div>
              <div
                className="data-text"
                style={{ fontSize: 30, fontWeight: 700, color: 'var(--amber)' }}
              >
                {formatPrice(totalRevenue)}
              </div>
              <div style={{ fontSize: 12, color: 'var(--smoke)', marginTop: 4 }}>
                {mockSales.reduce((sum, s) => sum + s.qty, 0)} porsi terjual
              </div>
            </div>

            {/* Sales list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {mockSales.map((sale, i) => (
                <div
                  key={sale.id}
                  className="card fade-up"
                  style={{ animationDelay: `${i * 0.06}s`, padding: '12px 14px' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 22, flexShrink: 0 }}>{sale.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--cream)' }}>{sale.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--smoke)' }}>
                        {sale.qty} porsi · {formatTimeAgo(sale.time)}
                      </div>
                    </div>
                    <div className="data-text" style={{ fontSize: 14, fontWeight: 700, color: 'var(--fresh)' }}>
                      +{formatPrice(sale.price * sale.qty)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </>
  );
}
