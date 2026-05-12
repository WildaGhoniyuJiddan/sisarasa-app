'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';

const SELLER_NAV = [
  {
    href: '/seller/dashboard',
    label: 'Dapur',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    accentColor: 'var(--orange)',
  },
  {
    href: '/seller/stock',
    label: 'Stok',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    ),
    accentColor: 'var(--orange)',
  },
  {
    href: '/seller/donations',
    label: 'Donasi',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
      </svg>
    ),
    accentColor: 'var(--donation-green)',
  },
  {
    href: '/seller/profile',
    label: 'Profil',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    accentColor: 'var(--orange)',
  },
];

const CONSUMER_NAV = [
  {
    href: '/consumer/home',
    label: 'Pasar',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
    ),
    accentColor: 'var(--cyan)',
  },
  {
    href: '/consumer/transactions',
    label: 'Transaksi',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
      </svg>
    ),
    accentColor: 'var(--cyan)',
  },
  {
    href: '/consumer/donations',
    label: 'Donasi',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
      </svg>
    ),
    accentColor: 'var(--donation-green)',
  },
  {
    href: '/consumer/profile',
    label: 'Profil',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.5 : 1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    accentColor: 'var(--cyan)',
  },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { userRole } = useApp();

  // Don't show on splash / login
  if (pathname === '/' || pathname === '/login') return null;

  const navItems = userRole === 'seller' ? SELLER_NAV : CONSUMER_NAV;
  const defaultAccent = userRole === 'seller' ? 'var(--orange)' : 'var(--cyan)';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(15, 29, 31, 0.94)',
        backdropFilter: 'blur(16px) saturate(1.5)',
        borderTop: '1px solid var(--border)',
        zIndex: 50,
        display: 'flex',
        justifyContent: 'center',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 480,
          height: 'var(--nav-h)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
        }}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const accent = item.accentColor || defaultAccent;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                color: isActive ? accent : 'var(--text-muted)',
                textDecoration: 'none',
                transition: 'color 0.15s ease',
                padding: '8px 16px',
                position: 'relative',
                flex: 1,
              }}
            >
              {item.icon(isActive)}
              <span
                style={{
                  fontSize: 9,
                  fontWeight: isActive ? 700 : 400,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                {item.label}
              </span>
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 28,
                    height: 2,
                    background: accent,
                    borderRadius: '0 0 3px 3px',
                    boxShadow: `0 0 8px ${accent}`,
                  }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
