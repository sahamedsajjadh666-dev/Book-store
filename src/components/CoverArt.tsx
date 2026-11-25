import React from 'react';
import { Book } from '../data/catalog';

interface CoverArtProps {
  book: Book;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: { w: 84, h: 120 },
  md: { w: 136, h: 196 },
  lg: { w: 160, h: 230 },
};

export const CoverArt: React.FC<CoverArtProps> = ({ book, className = '', size = 'md' }) => {
  if (!book || !book.coverColors) {
    return null;
  }

  const { w, h } = sizes[size] || sizes.md;
  const c = book.coverColors;
  const isManga = book.isManga;
  const hasVolume = Boolean(book.volumeBadge);

  // Split title cleanly across words for typography
  const words = book.title.split(' ');
  const titleLines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length <= (size === 'sm' ? 10 : 14)) {
      currentLine = (currentLine + ' ' + word).trim();
    } else {
      if (currentLine) titleLines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) titleLines.push(currentLine);

  const displayLines = titleLines.slice(0, size === 'sm' ? 2 : 3);
  if (titleLines.length > (size === 'sm' ? 2 : 3) && displayLines.length > 0) {
    displayLines[displayLines.length - 1] += '…';
  }

  const spineWidth = Math.max(6, Math.round(w * 0.08));
  const fontSize = size === 'sm' ? 9 : size === 'md' ? 12 : 14;
  const authorSize = size === 'sm' ? 7.5 : size === 'md' ? 10 : 11;
  const lineHeight = fontSize * 1.25;

  // Ensure high contrast author/accent text
  const authorColor = c.text || '#F8FAFC';
  const foilAccent = c.accent || '#F59E0B';

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      className={`select-none shadow-md hover:shadow-xl transition-shadow ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{
        display: 'block',
        borderRadius: 4,
        flexShrink: 0,
        filter: 'drop-shadow(0 4px 10px rgba(0, 0, 0, 0.35))',
      }}
      role="img"
      aria-label={`${book.title} cover`}
    >
      <defs>
        {/* Spine lighting gradient for physical 3D book depth */}
        <linearGradient id={`spine-grad-${book.id}-${size}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#000" stopOpacity="0.5" />
          <stop offset="35%" stopColor="#fff" stopOpacity="0.18" />
          <stop offset="70%" stopColor="#000" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.6" />
        </linearGradient>

        {/* Cover texture overlay */}
        <linearGradient id={`cover-shine-${book.id}-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
        </linearGradient>
      </defs>

      {/* Main Cover Background */}
      <rect width={w} height={h} fill={c.bg} rx="3" />

      {/* Decorative inner foil frame */}
      <rect
        x={spineWidth + 5}
        y={5}
        width={w - spineWidth - 10}
        height={h - 10}
        fill="none"
        stroke={foilAccent}
        strokeWidth="0.8"
        strokeOpacity="0.45"
        rx="2"
      />

      {/* Pattern & Art element */}
      {isManga ? (
        <g opacity="0.22">
          {/* Dynamic Manga Speed/Action diagonals */}
          {Array.from({ length: 6 }).map((_, i) => (
            <line
              key={i}
              x1={spineWidth + 8 + i * 18}
              y1={h}
              x2={spineWidth + 30 + i * 18}
              y2={0}
              stroke={foilAccent}
              strokeWidth="0.75"
            />
          ))}
          {/* Manga circle seal */}
          <circle
            cx={w - 28}
            cy={h / 2}
            r={size === 'sm' ? 14 : 22}
            fill="none"
            stroke={foilAccent}
            strokeWidth="1"
          />
        </g>
      ) : (
        <g opacity="0.2">
          {/* Literary geometric ornament */}
          <circle
            cx={(w + spineWidth) / 2}
            cy={h * 0.52}
            r={size === 'sm' ? 12 : 20}
            fill="none"
            stroke={foilAccent}
            strokeWidth="1"
          />
          <line
            x1={spineWidth + 12}
            y1={h * 0.52}
            x2={w - 12}
            y2={h * 0.52}
            stroke={foilAccent}
            strokeWidth="0.5"
          />
        </g>
      )}

      {/* Spine 3D band */}
      <rect x="0" y="0" width={spineWidth} height={h} fill={c.spine || '#1e1e1e'} rx="1" />
      <rect x="0" y="0" width={spineWidth} height={h} fill={`url(#spine-grad-${book.id}-${size})`} />

      {/* Foil Shine Overlay */}
      <rect
        x={spineWidth}
        y="0"
        width={w - spineWidth}
        height={h}
        fill={`url(#cover-shine-${book.id}-${size})`}
      />

      {/* Volume Badge (for Manga) or Genre Stamp (for Books) */}
      {hasVolume && book.volumeBadge ? (
        <g>
          <rect
            x={spineWidth + 8}
            y={size === 'sm' ? 9 : 12}
            width={size === 'sm' ? 36 : 48}
            height={size === 'sm' ? 13 : 16}
            fill={foilAccent}
            rx="2"
          />
          <text
            x={spineWidth + 8 + (size === 'sm' ? 18 : 24)}
            y={size === 'sm' ? 19 : 24}
            fontSize={size === 'sm' ? 7.5 : 9}
            fill="#0B0F19"
            fontFamily="monospace"
            fontWeight="bold"
            textAnchor="middle"
          >
            {book.volumeBadge}
          </text>
        </g>
      ) : (
        <text
          x={spineWidth + 9}
          y={size === 'sm' ? 17 : 22}
          fontSize={size === 'sm' ? 6.5 : 8}
          fill={foilAccent}
          fontFamily="monospace"
          letterSpacing="0.08em"
          opacity="0.85"
        >
          {book.category.toUpperCase()}
        </text>
      )}

      {/* Book / Manga Title */}
      <text
        x={spineWidth + 9}
        y={hasVolume ? (size === 'sm' ? 36 : 46) : (size === 'sm' ? 32 : 40)}
        fontSize={fontSize}
        fill={c.text || '#FFFFFF'}
        fontFamily="Georgia, serif"
        fontWeight="bold"
      >
        {displayLines.map((line, idx) => (
          <tspan key={idx} x={spineWidth + 9} dy={idx === 0 ? 0 : lineHeight}>
            {line}
          </tspan>
        ))}
      </text>

      {/* Author / Mangaka */}
      <text
        x={spineWidth + 9}
        y={h - (size === 'sm' ? 22 : 28)}
        fontSize={authorSize}
        fill={authorColor}
        fontFamily="sans-serif"
        fontWeight="500"
        opacity="0.9"
      >
        {size === 'sm' && book.author.length > 12 ? book.author.substring(0, 10) + '…' : book.author}
      </text>

      {/* Reading Direction Indicator (RTL / LTR) */}
      <g>
        <rect
          x={w - (size === 'sm' ? 24 : 30)}
          y={h - (size === 'sm' ? 16 : 20)}
          width={size === 'sm' ? 18 : 23}
          height={size === 'sm' ? 10 : 13}
          fill="#000000"
          fillOpacity="0.55"
          rx="2"
        />
        <text
          x={w - (size === 'sm' ? 15 : 18.5)}
          y={h - (size === 'sm' ? 8.5 : 10.5)}
          fontSize={size === 'sm' ? 6 : 7.5}
          fill={foilAccent}
          fontFamily="monospace"
          fontWeight="bold"
          textAnchor="middle"
        >
          {book.direction}
        </text>
      </g>

      {/* Outer book edge stroke */}
      <rect
        x="0.5"
        y="0.5"
        width={w - 1}
        height={h - 1}
        fill="none"
        stroke="#000"
        strokeOpacity="0.4"
        rx="3"
      />
    </svg>
  );
};
