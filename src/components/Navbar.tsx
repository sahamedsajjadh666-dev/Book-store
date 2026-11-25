// #02 Sticky Glassmorphic Navbar — Shadcn UI / Radix UI
import React, { useState } from 'react';
import { ShoppingCart, Heart, Search, BookOpen, Eye, EyeOff, ChevronDown } from 'lucide-react';
import { useStore, CURRENCIES } from '../store/useStore';
import { useCartCount } from '../store/useStore';
import { toast } from 'sonner';

interface NavbarProps {
  onCommandPaletteOpen: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onCommandPaletteOpen }) => {
  const {
    setCartOpen,
    setWishlistOpen,
    wishlist,
    inspectorMode,
    setInspectorMode,
    setArchitectureOpen,
    currency,
    setCurrency,
  } = useStore();
  const cartCount = useCartCount();
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);

  const navLinks = [
    { label: 'All Titles', href: '#catalog' },
    { label: 'Manga', href: '#manga' },
    { label: 'Books', href: '#books' },
    { label: 'Bundle Builder', href: '#bundle' },
    { label: 'Reports', action: () => setArchitectureOpen(true) },
  ];

  return (
    <nav
      data-component-id="#02"
      data-ui-library="Shadcn UI"
      className={`glass-nav sticky top-0 z-40 ${inspectorMode ? 'inspector-active' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5" style={{ color: 'var(--accent)' }}>
              <BookOpen size={22} strokeWidth={1.8} />
            </div>
            <span className="font-serif text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Vellum <span style={{ color: 'var(--accent)' }}>&</span> Ink
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) =>
              link.action ? (
                <button
                  key={link.label}
                  onClick={link.action}
                  className="text-sm font-medium transition-colors hover:text-[var(--accent)]"
                  style={{ color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {link.label}
                </button>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm font-medium transition-colors hover:text-[var(--accent)]"
                  style={{ color: 'var(--text-muted)', textDecoration: 'none' }}
                >
                  {link.label}
                </a>
              )
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              onClick={onCommandPaletteOpen}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all"
              style={{
                background: 'var(--border)',
                color: 'var(--text-muted)',
                border: '1px solid var(--border)',
              }}
              title="⌘K"
            >
              <Search size={14} />
              <span className="hidden sm:inline text-xs">Search</span>
              <kbd
                className="hidden sm:inline text-xs px-1 py-0.5 rounded"
                style={{ background: 'var(--bg-primary)', color: 'var(--text-muted)' }}
              >
                ⌘K
              </kbd>
            </button>

            {/* Inspector Toggle */}
            <button
              onClick={() => setInspectorMode(!inspectorMode)}
              className="relative p-2 rounded-lg transition-all"
              style={{
                background: inspectorMode ? 'var(--accent)' : 'var(--border)',
                color: inspectorMode ? '#000' : 'var(--text-muted)',
              }}
              title="UI Inspector Mode"
            >
              {inspectorMode ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>

            {/* Wishlist */}
            <button
              onClick={() => setWishlistOpen(true)}
              className="relative p-2 rounded-lg transition-all"
              style={{ background: 'var(--border)', color: 'var(--text-muted)' }}
            >
              <Heart size={16} />
              {wishlist.length > 0 && (
                <span
                  className="absolute -top-1 -right-1 text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--accent)', color: '#000', fontSize: 10 }}
                >
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 rounded-lg transition-all"
              style={{ background: 'var(--accent)', color: '#000' }}
            >
              <ShoppingCart size={16} />
              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: 10 }}
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* Currency Selector (Replaces Layers option) */}
            <div className="relative">
              <button
                onClick={() => setCurrencyMenuOpen(!currencyMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all border"
                style={{
                  background: 'var(--border)',
                  borderColor: currencyMenuOpen ? 'var(--accent)' : 'var(--border)',
                  color: 'var(--text-primary)',
                }}
                title="Change Currency (USD, INR, GBP, EUR, JPY...)"
              >
                <span>{CURRENCIES[currency]?.flag}</span>
                <span style={{ color: 'var(--accent)' }}>{CURRENCIES[currency]?.symbol}</span>
                <span className="font-mono text-[11px]">{CURRENCIES[currency]?.code}</span>
                <ChevronDown size={12} className={`transition-transform duration-200 ${currencyMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {currencyMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setCurrencyMenuOpen(false)} />
                  <div
                    className="absolute right-0 mt-2 w-48 rounded-xl shadow-2xl py-1.5 z-50 border backdrop-blur-md"
                    style={{
                      background: 'var(--bg-surface)',
                      borderColor: 'var(--border)',
                      boxShadow: 'var(--shadow)',
                    }}
                  >
                    <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      Select Currency
                    </div>
                    {Object.values(CURRENCIES).map((c) => (
                      <button
                        key={c.code}
                        onClick={() => {
                          setCurrency(c.code);
                          setCurrencyMenuOpen(false);
                          toast.success(`Currency changed to ${c.symbol} ${c.name}`);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 text-xs transition-colors hover:bg-[var(--border)]"
                        style={{
                          background: currency === c.code ? 'var(--border)' : 'transparent',
                          color: 'var(--text-primary)',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{c.flag}</span>
                          <span className="font-semibold">{c.name}</span>
                        </div>
                        <span className="font-bold font-mono" style={{ color: 'var(--accent)' }}>
                          {c.symbol}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
