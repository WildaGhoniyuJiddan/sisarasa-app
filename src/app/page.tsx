'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SplashPage() {
  const router = useRouter();
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [showInstall, setShowInstall] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstall(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (deferredPrompt as any).prompt();
    setDeferredPrompt(null);
    setShowInstall(false);
  };

  const handleMasuk = () => router.push('/login');

  return (
    <div
      style={{
        minHeight: '100dvh',
        background: 'var(--surface)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background glows */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '120%',
          height: '50%',
          background: 'radial-gradient(ellipse at center, rgba(86, 182, 198, 0.08) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '-10%',
          width: '60%',
          height: '50%',
          background: 'radial-gradient(ellipse at center, rgba(23, 12, 121, 0.05) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ width: '100%', maxWidth: 400, position: 'relative', textAlign: 'center' }}>

        {/* Logo badge */}
        <div
          className="fade-up"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 18px',
            border: '1px solid var(--cyan-border)',
            borderRadius: 40,
            background: 'var(--cyan-dim)',
            marginBottom: 36,
          }}
        >
          <span style={{ fontSize: 18 }}>♻</span>
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontWeight: 700,
              fontSize: 14,
              letterSpacing: '0.14em',
              color: 'var(--cyan)',
              textTransform: 'uppercase',
            }}
          >
            SisaRasa
          </span>
        </div>

        {/* Hero text */}
        <div className="fade-up-1" style={{ marginBottom: 16 }}>
          <h1
            style={{
              fontSize: 'clamp(32px, 10vw, 52px)',
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-0.03em',
              color: 'var(--text-primary)',
              marginBottom: 0,
            }}
          >
            Kurangi Sisa,
            <br />
            <span
              style={{
                color: 'var(--orange)',
              }}
            >
              Tambah Rasa.
            </span>
          </h1>
        </div>

        <p
          className="fade-up-2"
          style={{
            fontSize: 13,
            color: 'var(--text-secondary)',
            lineHeight: 1.75,
            maxWidth: 300,
            margin: '0 auto 40px',
          }}
        >
          Platform AI untuk warung Indonesia — prediksi surplus, dynamic pricing otomatis, dan donasi pangan terverifikasi.
        </p>

        {/* CTA Buttons */}
        <div className="fade-up-3" style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
          <button
            id="btn-masuk"
            className="btn-primary"
            style={{ width: '100%', fontSize: 15, padding: '14px 24px' }}
            onClick={handleMasuk}
          >
            Masuk ke SisaRasa →
          </button>

          {showInstall && mounted && (
            <button
              id="btn-install"
              className="btn-cyan"
              style={{ width: '100%', fontSize: 14, padding: '13px 24px' }}
              onClick={handleInstall}
            >
              📲 Install Aplikasi (PWA)
            </button>
          )}
        </div>

        {/* Stats strip */}
        <div
          className="fade-up-4"
          style={{
            padding: '20px 0 0',
            borderTop: '1px solid var(--border)',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
          }}
        >
          {[
            { num: '48Jt+', label: 'Ton sisa/tahun' },
            { num: '12K+', label: 'Warung aktif' },
            { num: '97K+', label: 'Porsi didonasi' },
          ].map(({ num, label }) => (
            <div key={label}>
              <div
                className="data-text"
                style={{ fontSize: 18, fontWeight: 700, color: 'var(--cyan)' }}
              >
                {num}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: 'var(--text-muted)',
                  marginTop: 3,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Scan line animation */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, var(--cyan), transparent)',
            opacity: 0.4,
            animation: 'shimmer 3s linear infinite',
            backgroundSize: '200%',
          }}
        />
      </div>
    </div>
  );
}
