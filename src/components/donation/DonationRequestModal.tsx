'use client';

import { useState } from 'react';
import { DonationLog } from '@/types';
import CountdownTimer from '@/components/ui/CountdownTimer';
import { formatPrice } from '@/lib/utils';

interface DonationRequestModalProps {
  onClose: () => void;
  productName: string;
  productEmoji: string;
  stallName: string;
  stallAddress: string;
  stallPhone: string;
  qty: number;
  normalPrice: number;
}

export default function DonationRequestModal({
  onClose,
  productName,
  productEmoji,
  stallName,
  stallAddress,
  stallPhone,
  qty,
  normalPrice,
}: DonationRequestModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [pantiName, setPantiName] = useState('');
  const [pantiDoc, setPantiDoc] = useState('');
  const [agreed, setAgreed] = useState(false);

  const whatsappUrl = `https://wa.me/62${stallPhone.replace(/^0/, '')}?text=${encodeURIComponent(
    `Halo, saya dari ${pantiName}. Kami ingin mengajukan permintaan donasi untuk ${productName} (${qty} porsi) dari ${stallName}. Boleh kami konfirmasi jadwal pengambilan?`
  )}`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '90dvh', overflowY: 'auto' }}>
        {/* Handle */}
        <div style={{ width: 40, height: 4, borderRadius: 2, background: 'var(--ash)', margin: '0 auto 20px' }} />

        {/* Step 1: Product info + agree */}
        {step === 1 && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{
                width: 56, height: 56, fontSize: 32,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--ink-muted)', borderRadius: 8, border: '1px solid var(--ash)',
              }}>
                {productEmoji}
              </div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--smoke)', marginBottom: 2 }}>{stallName}</div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--cream)' }}>{productName}</div>
                <div style={{ fontSize: 12, color: 'var(--amber)', marginTop: 2 }}>
                  {qty} porsi · Normal {formatPrice(normalPrice)}/porsi
                </div>
              </div>
            </div>

            {/* Legal Disclaimer */}
            <div style={{
              background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 6, padding: 14, marginBottom: 16,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--critical)', letterSpacing: '0.08em', marginBottom: 8 }}>
                ⚠ DISCLAIMER HUKUM
              </div>
              <p style={{ fontSize: 12, color: 'var(--silver)', lineHeight: 1.7 }}>
                Setelah proses serah terima makanan selesai, <strong style={{ color: 'var(--cream)' }}>tanggung jawab atas kelayakan konsumsi makanan berpindah sepenuhnya kepada pihak penerima</strong>. SisaRasa tidak bertanggung jawab atas kondisi makanan pasca pengambilan.
              </p>
            </div>

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer', marginBottom: 20 }}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                style={{ marginTop: 2, accentColor: 'var(--amber)', width: 16, height: 16 }}
              />
              <span style={{ fontSize: 12, color: 'var(--silver)', lineHeight: 1.6 }}>
                Saya telah membaca dan menyetujui disclaimer di atas, serta menyatakan bahwa lembaga kami berhak menerima donasi.
              </span>
            </label>

            <button
              className="btn-primary"
              style={{ width: '100%' }}
              disabled={!agreed}
              onClick={() => setStep(2)}
            >
              Lanjutkan →
            </button>
          </>
        )}

        {/* Step 2: Identity upload */}
        {step === 2 && (
          <>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Verifikasi Lembaga</h3>
            <p style={{ fontSize: 12, color: 'var(--smoke)', marginBottom: 20 }}>
              Upload identitas panti untuk verifikasi akuntabilitas donasi.
            </p>

            <div style={{ marginBottom: 14 }}>
              <label className="label">Nama Lembaga / Panti</label>
              <input
                className="input"
                placeholder="cth: Panti Asuhan Harapan Bangsa"
                value={pantiName}
                onChange={(e) => setPantiName(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label className="label">Upload Dokumen Identitas</label>
              <div
                style={{
                  border: '2px dashed var(--ash)', borderRadius: 8,
                  padding: '24px 16px', textAlign: 'center', cursor: 'pointer',
                  background: pantiDoc ? 'rgba(34,197,94,0.05)' : 'transparent',
                  transition: 'all 0.2s ease',
                }}
                onClick={() => setPantiDoc(pantiDoc ? '' : 'dokumen_panti.pdf')}
              >
                {pantiDoc ? (
                  <>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>✅</div>
                    <div style={{ fontSize: 13, color: 'var(--fresh)', fontWeight: 600 }}>{pantiDoc}</div>
                    <div style={{ fontSize: 11, color: 'var(--smoke)', marginTop: 4 }}>Klik untuk ganti</div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>📄</div>
                    <div style={{ fontSize: 13, color: 'var(--silver)' }}>Klik untuk upload</div>
                    <div style={{ fontSize: 11, color: 'var(--smoke)', marginTop: 4 }}>SK Lembaga, KTP Ketua, atau dokumen resmi lainnya</div>
                  </>
                )}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 10 }}>
              <button className="btn-ghost" onClick={() => setStep(1)} style={{ width: '100%' }}>← Kembali</button>
              <button
                className="btn-primary"
                style={{ width: '100%' }}
                disabled={!pantiName || !pantiDoc}
                onClick={() => setStep(3)}
              >
                Ajukan Donasi →
              </button>
            </div>
          </>
        )}

        {/* Step 3: Confirmation + WA */}
        {step === 3 && (
          <>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>🎉</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--cream)', marginBottom: 8 }}>
                Permintaan Terkirim!
              </h3>
              <p style={{ fontSize: 12, color: 'var(--smoke)', lineHeight: 1.6 }}>
                Permintaan donasi <strong style={{ color: 'var(--cream)' }}>{productName}</strong> dari{' '}
                <strong style={{ color: 'var(--amber)' }}>{stallName}</strong> telah terdaftar.
              </p>
            </div>

            {/* Countdown 24h */}
            <div style={{
              background: 'var(--ink-muted)', borderRadius: 8, padding: 16,
              textAlign: 'center', marginBottom: 16, border: '1px solid var(--ash)',
            }}>
              <CountdownTimer
                targetDate={new Date(Date.now() + 24 * 60 * 60 * 1000)}
                label="Batas waktu upload bukti"
                size="lg"
              />
              <p style={{ fontSize: 11, color: 'var(--smoke)', marginTop: 8, lineHeight: 1.5 }}>
                Upload foto bukti makanan tiba di lokasi sebelum batas waktu ini.<br/>
                <strong style={{ color: 'var(--critical)' }}>Peringatan:</strong> Akun panti akan dibekukan otomatis jika gagal mengunggah bukti.
              </p>
            </div>

            {/* Next steps */}
            <div style={{ marginBottom: 20 }}>
              {[
                { num: '1', text: 'Hubungi penjual via WhatsApp untuk konfirmasi jadwal pengambilan' },
                { num: '2', text: 'Ambil makanan ke lokasi warung sesuai jadwal' },
                { num: '3', text: 'Upload foto bukti makanan telah tiba di Aktivitas' },
              ].map((s) => (
                <div key={s.num} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10 }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%', background: 'var(--amber)',
                    color: 'var(--ink)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700, flexShrink: 0,
                  }}>
                    {s.num}
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--silver)', lineHeight: 1.5 }}>{s.text}</p>
                </div>
              ))}
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ width: '100%', display: 'block', textAlign: 'center', textDecoration: 'none', marginBottom: 10 }}
            >
              💬 Chat WhatsApp Penjual
            </a>
            <button className="btn-ghost" style={{ width: '100%' }} onClick={onClose}>
              Tutup
            </button>
          </>
        )}
      </div>
    </div>
  );
}
