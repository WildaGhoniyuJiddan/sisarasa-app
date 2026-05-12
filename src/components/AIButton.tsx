'use client';

import { useState } from 'react';

interface AIButtonProps {
  onClick?: () => void;
}

export default function AIButton({ onClick }: AIButtonProps) {
  const [isPulsing, setIsPulsing] = useState(false);

  const handleClick = () => {
    setIsPulsing(true);
    setTimeout(() => setIsPulsing(false), 600);
    onClick?.();
  };

  return (
    <button
      id="btn-ai-assistant"
      className="fab glow-cyan"
      onClick={handleClick}
      title="AI Assistant SisaRasa"
      style={{
        transform: isPulsing ? 'scale(0.92)' : undefined,
      }}
    >
      {/* Sparkle icon */}
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#0A1F1A"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" fill="#0A1F1A" stroke="none" />
        <circle cx="19" cy="4" r="1.5" fill="#0A1F1A" />
        <circle cx="5" cy="19" r="1" fill="#0A1F1A" />
      </svg>
    </button>
  );
}
