'use client';

import { AIInsight } from '@/types';

interface InsightCardProps {
  insight: AIInsight;
  onAction?: (insight: AIInsight) => void;
  index?: number;
}

const URGENCY_CONFIG = {
  high:   { label: 'MENDESAK',  color: 'var(--urgent)',         glow: 'rgba(255,61,31,0.08)'   },
  medium: { label: 'PERHATIAN', color: 'var(--warn)',            glow: 'rgba(248,244,159,0.06)' },
  low:    { label: 'INFO',      color: 'var(--text-secondary)',  glow: 'rgba(49,245,225,0.04)'  },
};

const TYPE_ICONS: Record<AIInsight['type'], string> = {
  surplus_warning:    '⚡',
  pricing_suggestion: '💸',
  donation_prompt:    '🤝',
  stock_optimum:      '✅',
};

export default function InsightCard({ insight, onAction, index = 0 }: InsightCardProps) {
  const urgency = URGENCY_CONFIG[insight.urgency];
  const icon = TYPE_ICONS[insight.type];

  return (
    <div
      className={insight.urgency === 'high' ? 'insight-card insight-card-urgent' : 'insight-card'}
      style={{
        animationDelay: `${index * 0.08}s`,
        padding: '16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: `${urgency.color}20`,
          border: `1px solid ${urgency.color}40`,
          fontSize: 20,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {icon}
        </div>
        <div>
          <span className="badge" style={{
            background: `${urgency.color}18`,
            color: urgency.color,
            border: `1px solid ${urgency.color}40`,
            fontSize: 10,
            marginBottom: 4,
            display: 'inline-flex',
          }}>
            AI · {urgency.label}
          </span>
          <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.25 }}>
            {insight.title}
          </h4>
        </div>
      </div>

      <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 14 }}>
        {insight.body}
      </p>

      <button
        onClick={() => onAction?.(insight)}
        className={insight.urgency === 'high' ? 'btn-primary' : 'btn-cyan'}
        style={{ width: '100%' }}
      >
        {insight.actionLabel} →
      </button>
    </div>
  );
}
