'use client';

import { useState, useEffect } from 'react';
import { formatCountdown } from '@/lib/utils';

interface CountdownTimerProps {
  targetDate: Date;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  onExpire?: () => void;
}

export default function CountdownTimer({
  targetDate,
  label = 'Berakhir dalam',
  size = 'md',
  onExpire,
}: CountdownTimerProps) {
  const [timeStr, setTimeStr] = useState(formatCountdown(targetDate));
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const tick = () => {
      const remaining = targetDate.getTime() - Date.now();
      if (remaining <= 0) {
        setTimeStr('00:00:00');
        setIsExpired(true);
        onExpire?.();
        return;
      }
      setTimeStr(formatCountdown(targetDate));
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate, onExpire]);

  const fontSizes = { sm: { label: 10, time: 13 }, md: { label: 11, time: 18 }, lg: { label: 12, time: 28 } };
  const fs = fontSizes[size];

  return (
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          fontSize: fs.label,
          color: 'var(--smoke)',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: 2,
          fontWeight: 600,
        }}
      >
        {label}
      </div>
      <div
        className="data-text"
        style={{
          fontSize: fs.time,
          fontWeight: 700,
          letterSpacing: '0.05em',
          color: isExpired ? 'var(--smoke)' : 'var(--critical)',
          animation: !isExpired ? 'countdown-tick 1s ease-in-out infinite' : 'none',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {timeStr}
      </div>
    </div>
  );
}
