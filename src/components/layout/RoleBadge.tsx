'use client';

import { useApp } from '@/context/AppContext';
import { useRouter } from 'next/navigation';

export default function RoleBadge() {
  const { userRole } = useApp();
  const router = useRouter();

  return (
    <button
      id="role-badge-switch"
      onClick={() => router.push('/login')}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '5px 12px',
        borderRadius: 6,
        border: `1px solid ${userRole === 'seller' ? 'var(--orange-border)' : 'var(--cyan-border)'}`,
        background: userRole === 'seller' ? 'var(--orange-dim)' : 'var(--cyan-dim)',
        color: userRole === 'seller' ? 'var(--orange)' : 'var(--cyan)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.07em',
        textTransform: 'uppercase',
      }}
      title="Ganti peran"
    >
      <span style={{ fontSize: 14 }}>{userRole === 'seller' ? '🏪' : '🛒'}</span>
      {userRole === 'seller' ? 'Penjual' : 'Konsumen'}
      <span style={{ opacity: 0.6, fontSize: 10 }}>↕</span>
    </button>
  );
}
