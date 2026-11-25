// #01 Promo Announcement Ticker — Ant Design
import React from 'react';
import { useStore, formatCurrency } from '../store/useStore';

export const PromoTicker: React.FC = () => {
  const inspectorMode = useStore((s) => s.inspectorMode);
  const currency = useStore((s) => s.currency);

  const messages = [
    '📚 Use code READ20 for 20% off your entire order',
    '🎌 Use code MANGA15 for 15% off all Manga volumes',
    `🚚 Free shipping on orders over ${formatCurrency(50, currency)} — no code needed`,
    '✨ New: Berserk Deluxe & Nausicaä Box Set now in stock',
    `🎁 Add Gift Wrap at checkout for just ${formatCurrency(4, currency)}`,
    '📖 3-Item Bundle Builder — mix books & manga for 15% off',
  ];

  return (
    <div
      data-component-id="#01"
      data-ui-library="Ant Design"
      className={`ticker-wrap py-1 text-sm font-medium z-50 ${inspectorMode ? 'inspector-active' : ''}`}
      style={{ background: 'var(--accent)', color: '#000' }}
    >
      <div className="ticker-content">
        {messages.map((msg, i) => (
          <span key={i} className="mx-16">{msg}</span>
        ))}
        {/* Duplicate for seamless loop */}
        {messages.map((msg, i) => (
          <span key={`b-${i}`} className="mx-16">{msg}</span>
        ))}
      </div>
    </div>
  );
};
