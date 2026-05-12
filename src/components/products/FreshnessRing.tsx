'use client';

import { getFreshnessStatus, freshnessColor, getFreshnessProgress, freshnessShortLabel, getHoursElapsed } from '@/lib/utils';

interface FreshnessRingProps {
  cookedAt: Date;
  size?: number;
  showLabel?: boolean;
}

export default function FreshnessRing({ cookedAt, size = 56, showLabel = true }: FreshnessRingProps) {
  const status   = getFreshnessStatus(cookedAt);
  const progress = getFreshnessProgress(cookedAt);
  const color    = freshnessColor(status);
  const hours    = getHoursElapsed(cookedAt);

  const r      = (size - 6) / 2;
  const circ   = 2 * Math.PI * r;
  const offset = circ * (1 - progress);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Track */}
          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none"
            stroke="var(--surface-3)"
            strokeWidth={5}
          />
          {/* Progress */}
          <circle
            cx={size / 2} cy={size / 2} r={r}
            fill="none"
            stroke={color}
            strokeWidth={5}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.5s ease' }}
          />
        </svg>
        {/* Center emoji indicator */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: size > 50 ? 18 : 14,
        }}>
          {status === 'fresh' ? '🟢' : status === 'warn' ? '🟡' : '🔴'}
        </div>
      </div>
      {showLabel && (
        <div style={{
          fontSize: 9, fontFamily: 'var(--font-mono)', color, fontWeight: 700,
          letterSpacing: '0.06em', textTransform: 'uppercase', textAlign: 'center',
        }}>
          {freshnessShortLabel(status)}<br />
          <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>{hours.toFixed(1)}j</span>
        </div>
      )}
    </div>
  );
}
