'use client';

import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';

export default function LoginPage() {
  const router = useRouter();
  const { setRole } = useApp();

  const handleSelect = (role: 'seller' | 'consumer') => {
    setRole(role);
    if (role === 'seller') {
      router.push('/seller/dashboard');
    } else {
      router.push('/consumer/home');
    }
  };

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: 'var(--surface)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          height: '40%',
          background: 'radial-gradient(ellipse at center, rgba(86, 182, 198, 0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ width: '100%', maxWidth: 400, position: 'relative' }}>

        {/* Back + Header */}
        <div className="fade-up" style={{ marginBottom: 40, textAlign: 'center' }}>
          <button
            onClick={() => router.back()}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: 13,
              fontFamily: 'var(--font-sans)',
              padding: '4px 0',
            }}
          >
            ← Kembali
          </button>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              padding: '6px 14px',
              border: '1px solid var(--cyan-border)',
              borderRadius: 40,
              background: 'var(--cyan-dim)',
              marginBottom: 20,
            }}
          >
            <span style={{ fontSize: 14 }}>♻</span>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontWeight: 700,
                fontSize: 12,
                letterSpacing: '0.14em',
                color: 'var(--cyan)',
                textTransform: 'uppercase',
              }}
            >
              SisaRasa
            </span>
          </div>

          <h1
            style={{
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
              marginBottom: 8,
            }}
          >
            Saya adalah...
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Pilih peran untuk melanjutkan
          </p>
        </div>

        {/* Role cards */}
        <div className="fade-up-1" style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>

          {/* Seller card */}
          <button
            id="btn-role-seller"
            onClick={() => handleSelect('seller')}
            style={{
              width: '100%',
              padding: '24px 22px',
              background: 'var(--surface-1)',
              border: '1.5px solid var(--orange-border)',
              borderRadius: 14,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--orange)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 0 24px var(--orange-glow)';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--orange-border)';
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0, left: 0, right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, transparent, var(--orange), transparent)',
              }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  background: 'var(--orange-dim)',
                  border: '1px solid var(--orange-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                  flexShrink: 0,
                }}
              >
                🏪
              </div>
              <div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    marginBottom: 4,
                    letterSpacing: '-0.01em',
                  }}
                >
                  Penjual (Warung)
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Kelola stok, lihat AI Insight, dan aktifkan donasi
                </div>
                <div style={{ marginTop: 8 }}>
                  <span className="badge badge-orange">Seller Mode</span>
                </div>
              </div>
              <div style={{ marginLeft: 'auto', color: 'var(--orange)', fontSize: 18 }}>→</div>
            </div>
          </button>

          {/* Consumer card */}
          <button
            id="btn-role-consumer"
            onClick={() => handleSelect('consumer')}
            style={{
              width: '100%',
              padding: '24px 22px',
              background: 'var(--surface-1)',
              border: '1.5px solid var(--cyan-border)',
              borderRadius: 14,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s ease',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--cyan)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 0 24px var(--cyan-glow)';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.borderColor = 'var(--cyan-border)';
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0, left: 0, right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, transparent, var(--cyan), transparent)',
              }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  background: 'var(--cyan-dim)',
                  border: '1px solid var(--cyan-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 28,
                  flexShrink: 0,
                }}
              >
                🛒
              </div>
              <div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    marginBottom: 4,
                    letterSpacing: '-0.01em',
                  }}
                >
                  Konsumen
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Temukan makanan diskon & donasi dari warung terdekat
                </div>
                <div style={{ marginTop: 8 }}>
                  <span className="badge badge-cyan">Consumer Mode</span>
                </div>
              </div>
              <div style={{ marginLeft: 'auto', color: 'var(--cyan)', fontSize: 18 }}>→</div>
            </div>
          </button>
        </div>

        {/* Footer note */}
        <div
          className="fade-up-2"
          style={{
            textAlign: 'center',
            padding: '16px',
            background: 'var(--surface-2)',
            borderRadius: 10,
            border: '1px solid var(--border)',
          }}
        >
          <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.6 }}>
            Demo mode — data tidak disimpan. Dapat berganti peran kapan saja melalui profil.
          </p>
        </div>
      </div>
    </div>
  );
}
