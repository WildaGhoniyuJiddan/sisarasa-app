'use client';

import { useState } from 'react';

interface AddProductModalProps {
  onClose: () => void;
  onAdd: (product: {
    name: string;
    category: string;
    normalPrice: number;
    qty: number;
    cookedAt: Date;
    imageEmoji: string;
  }) => void;
}

const CATEGORIES = ['Makanan Berat', 'Lauk', 'Snack', 'Minuman', 'Dessert'];
const EMOJIS = ['🍛', '🍗', '🥩', '🍲', '🥗', '🍜', '🍱', '🥬', '🍚', '🍖', '🧋', '🍡'];

export default function AddProductModal({ onClose, onAdd }: AddProductModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Makanan Berat');
  const [normalPrice, setNormalPrice] = useState('');
  const [qty, setQty] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🍛');
  const [batchMode, setBatchMode] = useState(true);

  // Default cooked time = now
  const [cookedHoursAgo, setCookedHoursAgo] = useState('0');

  const handleSubmit = () => {
    if (!name || !normalPrice || !qty) return;
    const cookedAt = new Date(Date.now() - parseFloat(cookedHoursAgo) * 60 * 60 * 1000);
    onAdd({
      name,
      category,
      normalPrice: parseInt(normalPrice),
      qty: parseInt(qty),
      cookedAt,
      imageEmoji: selectedEmoji,
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-sheet" onClick={(e) => e.stopPropagation()}>
        {/* Handle bar */}
        <div
          style={{
            width: 40, height: 4, borderRadius: 2,
            background: 'var(--surface-3)', margin: '0 auto 20px',
          }}
        />

        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
          Tambah Menu
        </h2>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 20 }}>
          Input stok dan waktu masak untuk tracking kesegaran otomatis.
        </p>

        {/* Emoji picker */}
        <div style={{ marginBottom: 16 }}>
          <div className="label">Ikon Menu</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {EMOJIS.map((e) => (
              <button
                key={e}
                onClick={() => setSelectedEmoji(e)}
                style={{
                  width: 40, height: 40, fontSize: 22,
                  borderRadius: 6,
                  border: `2px solid ${selectedEmoji === e ? 'var(--cyan)' : 'var(--surface-3)'}`,
                  background: selectedEmoji === e ? 'var(--cyan-dim)' : 'var(--surface-2)',
                  cursor: 'pointer', transition: 'all 0.12s ease',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {e}
              </button>
            ))}
          </div>
        </div>

        {/* Name */}
        <div style={{ marginBottom: 14 }}>
          <label className="label">Nama Menu</label>
          <input
            className="input"
            placeholder="cth: Nasi Gudeg Komplit"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
          {/* Category */}
          <div>
            <label className="label">Kategori</label>
            <select
              className="input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c} style={{ background: 'var(--surface-1)' }}>{c}</option>
              ))}
            </select>
          </div>
          {/* Qty */}
          <div>
            <label className="label">Jumlah (porsi)</label>
            <input
              className="input"
              type="number"
              placeholder="12"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            />
          </div>
        </div>

        {/* Price */}
        <div style={{ marginBottom: 14 }}>
          <label className="label">Harga Normal (Rp)</label>
          <input
            className="input"
            type="number"
            placeholder="22000"
            value={normalPrice}
            onChange={(e) => setNormalPrice(e.target.value)}
          />
        </div>

        {/* Timestamp mode */}
        <div style={{ marginBottom: 20 }}>
          <div className="label">Waktu Masak</div>
          <div
            style={{
              display: 'flex', borderRadius: 4, overflow: 'hidden',
              border: '1px solid var(--surface-3)', marginBottom: 10,
            }}
          >
            {(['Baru masak', 'Sudah beberapa jam'] as const).map((mode, i) => (
              <button
                key={mode}
                onClick={() => setBatchMode(i === 0)}
                style={{
                  flex: 1, padding: '8px 0', fontSize: 12, fontWeight: 600,
                  background: (i === 0) === batchMode ? 'var(--orange)' : 'transparent',
                  color: (i === 0) === batchMode ? '#fff' : 'var(--text-muted)',
                  border: 'none', cursor: 'pointer', transition: 'all 0.15s ease',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {mode}
              </button>
            ))}
          </div>
          {!batchMode && (
            <div>
              <label className="label">Sudah berapa jam sejak masak?</label>
              <input
                className="input"
                type="number"
                step="0.5"
                placeholder="2.5"
                value={cookedHoursAgo}
                onChange={(e) => setCookedHoursAgo(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 10 }}>
          <button className="btn-ghost" onClick={onClose} style={{ width: '100%' }}>
            Batal
          </button>
          <button
            className="btn-primary"
            onClick={handleSubmit}
            style={{ width: '100%' }}
            disabled={!name || !normalPrice || !qty}
          >
            Tambah Menu
          </button>
        </div>
      </div>
    </div>
  );
}
