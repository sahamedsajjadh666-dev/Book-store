// #05 UI Library Architecture Inspector Drawer — Radix Sheet (implemented as fixed panel)
import React from 'react';
import { X, Layers } from 'lucide-react';
import { useStore } from '../store/useStore';

const components = [
  { id: '#01', name: 'Promo Announcement Ticker', library: 'Ant Design', state: 'Static messages', tokens: '--accent, --text-primary' },
  { id: '#02', name: 'Sticky Glassmorphic Navbar', library: 'Shadcn UI', state: 'cartOpen, wishlist.length, inspectorMode', tokens: '--bg-glass, --border, --accent' },
  { id: '#03', name: 'Command Palette Search (⌘K)', library: 'cmdk', state: 'catalog, addToCart', tokens: '--bg-surface, --border, --text-primary' },
  { id: '#04', name: '2-Mode Theme Pill Switcher', library: 'Chakra UI', state: 'theme, setTheme', tokens: 'ALL 6 tokens' },
  { id: '#05', name: 'Architecture Inspector Drawer', library: 'Radix Sheet / Vaul', state: 'architectureOpen', tokens: '--bg-surface, --border' },
  { id: '#06', name: 'Dual Book & Manga Spotlight Hero', library: 'Tailwind UI', state: 'addToCart, addToWishlist', tokens: '--bg-primary, --accent, --text-primary' },
  { id: '#07', name: 'Category & Manga Filter Tabs', library: 'Radix UI Tabs', state: 'activeTab (local)', tokens: '--bg-surface, --accent, --border' },
  { id: '#08', name: 'Faceted Filter & Sort Bar', library: 'MUI', state: 'filterFormat, filterDir, sortBy (local)', tokens: '--bg-surface, --text-primary via MUI theme' },
  { id: '#09', name: 'Interactive Book & Manga Cards', library: 'Shadcn UI', state: 'addToCart, wishlist, selectedEdition', tokens: '--bg-surface, --accent, --border, --text-muted' },
  { id: '#10', name: 'Quick-View & Chapter Excerpt Reader Modal', library: 'Headless UI', state: 'selectedBook (local)', tokens: '--bg-surface, --bg-primary, --text-primary' },
  { id: '#11', name: '3-Item Reading & Manga Box Bundle Builder', library: 'Chakra UI', state: 'bundle[], addToBundle, addBundleToCart', tokens: '--border, --accent, --bg-surface' },
  { id: '#12', name: 'Toast Notification Stack', library: 'Sonner', state: 'Triggered by actions', tokens: 'Inherits via CSS vars' },
  { id: '#13', name: 'Global Slide-Over Cart Drawer', library: 'Vaul', state: 'cart, giftWrap, promoCode, totals', tokens: '--bg-surface, --border, --accent' },
  { id: '#14', name: 'Saved Wishlist Popover / Drawer', library: 'Radix Popover', state: 'wishlist[], moveWishlistToCart', tokens: '--bg-surface, --border, --accent' },
  { id: '#15', name: 'Multi-Step Simulated Checkout Modal', library: 'Ant Design Steps', state: 'step (local), cart snapshot', tokens: '--accent (steps), --bg-surface' },
  { id: '#16', name: 'Architecture & Store Reports Viewer', library: 'MUI Table', state: 'architectureOpen', tokens: '--bg-surface, --text-primary via MUI' },
  { id: '#17', name: 'Bookshop & Manga Club Footer', library: 'Tailwind UI', state: 'setArchitectureOpen, newsletter (local)', tokens: '--bg-primary, --border, --accent' },
];

export const ArchitectureDrawer: React.FC = () => {
  const { architectureOpen, setArchitectureOpen, inspectorMode } = useStore();

  if (!architectureOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex justify-end"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={() => setArchitectureOpen(false)}
    >
      <div
        data-component-id="#05"
        data-ui-library="Vaul / Radix Sheet"
        onClick={(e) => e.stopPropagation()}
        className={`${inspectorMode ? 'inspector-active' : ''}`}
        style={{
          width: '100%',
          maxWidth: 640,
          background: 'var(--bg-surface)',
          borderLeft: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-5"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <div className="flex items-center gap-3">
            <Layers size={20} style={{ color: 'var(--accent)' }} />
            <div>
              <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                Architecture Inspector
              </h2>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                17 Components · 8 UI Libraries · 2 Theme Tokens
              </p>
            </div>
          </div>
          <button
            onClick={() => setArchitectureOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          {components.map((comp) => (
            <div
              key={comp.id}
              className="mb-3 rounded-lg p-3"
              style={{
                background: 'var(--bg-primary)',
                border: '1px solid var(--border)',
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className="text-xs font-mono font-bold px-1.5 py-0.5 rounded"
                    style={{ background: 'var(--accent)', color: '#000' }}
                  >
                    {comp.id}
                  </span>
                  <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {comp.name}
                  </span>
                </div>
                <span
                  className="text-xs font-medium px-2 py-0.5 rounded-full whitespace-nowrap"
                  style={{ background: 'var(--border)', color: 'var(--accent)' }}
                >
                  {comp.library}
                </span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div>
                  <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>State Slices</div>
                  <div className="text-xs font-mono" style={{ color: 'var(--text-primary)', opacity: 0.8 }}>{comp.state}</div>
                </div>
                <div>
                  <div className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Theme Tokens</div>
                  <div className="text-xs font-mono" style={{ color: 'var(--accent)', opacity: 0.9 }}>{comp.tokens}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
