// #11 3-Item Bundle Builder — Chakra UI
import React from 'react';
import { catalog } from '../data/catalog';
import { CoverArt } from './CoverArt';
import { useStore, formatCurrency } from '../store/useStore';
import { toast } from 'sonner';
import { Plus, X, Package, ShoppingBag } from 'lucide-react';

export const BundleBuilder: React.FC = () => {
  const { bundle, addToBundle, removeFromBundle, addBundleToCart, setCartOpen, inspectorMode, currency } = useStore();
  const filledCount = bundle.filter(Boolean).length;
  const isComplete = filledCount === 3;

  const bundleTotal = bundle
    .filter(Boolean)
    .reduce((acc, item) => acc + (item?.price ?? 0), 0);
  const discountedTotal = bundleTotal * 0.85;

  const handleAddToSlot = (slotIdx: number, bookId: string) => {
    const book = catalog.find((b) => b.id === bookId);
    if (!book) return;
    const edition = book.editions[0];
    addToBundle(slotIdx, {
      bookId: book.id,
      format: edition.format,
      price: edition.price,
      title: book.title,
      isManga: book.isManga,
      coverColors: book.coverColors,
    });
    toast.success(`${book.title} added to Bundle Slot ${slotIdx + 1}!`);
  };

  const handleAddAllToCart = () => {
    if (!isComplete) return;
    addBundleToCart();
    setCartOpen(true);
    toast.success('Bundle added to cart! 15% discount applied.', {
      description: `Saved ${formatCurrency(bundleTotal - discountedTotal, currency)}`,
    });
  };

  return (
    <section
      id="bundle"
      data-component-id="#11"
      data-ui-library="Chakra UI"
      className={`py-14 ${inspectorMode ? 'inspector-active' : ''}`}
      style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Package size={22} style={{ color: 'var(--accent)' }} />
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
              Reading Box Builder
            </span>
          </div>
          <h2 className="font-serif text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
            Build Your 3-Item Bundle
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Mix any 3 books or manga volumes for an automatic{' '}
            <strong style={{ color: 'var(--accent)' }}>15% bundle discount</strong>
          </p>
        </div>

        {/* Progress bar */}
        <div className="max-w-md mx-auto mb-10">
          <div className="flex justify-between text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
            <span>{filledCount}/3 items selected</span>
            {isComplete && <span style={{ color: 'var(--accent)', fontWeight: 600 }}>✓ Bundle complete!</span>}
          </div>
          <div className="shipping-bar-track">
            <div className="shipping-bar-fill" style={{ width: `${(filledCount / 3) * 100}%` }} />
          </div>
        </div>

        {/* 3 Slots */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {[0, 1, 2].map((slotIdx) => {
            const item = bundle[slotIdx];
            return (
              <div
                key={slotIdx}
                className={`bundle-slot rounded-2xl p-5 flex flex-col items-center text-center min-h-[220px] relative ${item ? 'filled' : ''}`}
              >
                <div
                  className="text-xs font-bold mb-3 px-2 py-0.5 rounded"
                  style={{ background: 'var(--border)', color: 'var(--text-muted)' }}
                >
                  Slot {slotIdx + 1}
                </div>

                {item ? (
                  <>
                    {(() => {
                      const book = catalog.find((b) => b.id === item.bookId);
                      return book ? (
                        <CoverArt
                          book={book}
                          size="sm"
                          className="mb-3"
                        />
                      ) : null;
                    })()}
                    <p className="text-xs font-semibold line-clamp-2 mb-1" style={{ color: 'var(--text-primary)' }}>
                      {item.title}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{item.format}</p>
                    <p className="text-sm font-bold mt-1" style={{ color: 'var(--accent)' }}>
                      {formatCurrency(item.price, currency)}
                    </p>
                    <button
                      onClick={() => removeFromBundle(slotIdx)}
                      className="absolute top-3 right-3 p-1 rounded-full"
                      style={{ background: 'var(--border)', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                    >
                      <X size={12} />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center flex-1">
                    <Plus size={28} style={{ color: 'var(--border)', marginBottom: 8 }} />
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      Select a title below
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Book selector */}
        <div className="mb-8">
          <p className="text-sm font-semibold mb-4" style={{ color: 'var(--text-muted)' }}>
            Click a title to add to the next empty slot:
          </p>
          <div className="flex flex-wrap gap-2">
            {catalog.map((book) => {
              const inBundle = bundle.some((b) => b?.bookId === book.id);
              const nextEmpty = bundle.findIndex((b) => b === null);
              return (
                <button
                  key={book.id}
                  disabled={inBundle || nextEmpty === -1}
                  onClick={() => nextEmpty !== -1 && !inBundle && handleAddToSlot(nextEmpty, book.id)}
                  className="text-xs px-3 py-1.5 rounded-full transition-all"
                  style={{
                    background: inBundle ? 'var(--accent)' : 'var(--border)',
                    color: inBundle ? '#000' : (nextEmpty === -1 ? 'var(--text-muted)' : 'var(--text-primary)'),
                    border: 'none',
                    cursor: inBundle || nextEmpty === -1 ? 'default' : 'pointer',
                    opacity: nextEmpty === -1 && !inBundle ? 0.5 : 1,
                    fontWeight: inBundle ? 600 : 400,
                  }}
                >
                  {book.isManga ? '📚' : '📖'} {book.title}
                  {inBundle && ' ✓'}
                </button>
              );
            })}
          </div>
        </div>

        {/* Summary + CTA */}
        {filledCount > 0 && (
          <div
            className="max-w-sm mx-auto rounded-2xl p-6 text-center"
            style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}
          >
            <div className="flex justify-between text-sm mb-2">
              <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
              <span style={{ color: 'var(--text-primary)' }}>{formatCurrency(bundleTotal, currency)}</span>
            </div>
            <div className="flex justify-between text-sm mb-3">
              <span style={{ color: 'var(--accent)' }}>Bundle discount (15%)</span>
              <span style={{ color: 'var(--accent)' }}>-{formatCurrency(bundleTotal - discountedTotal, currency)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold mb-5" style={{ borderTop: '1px solid var(--border)', paddingTop: 12 }}>
              <span style={{ color: 'var(--text-primary)' }}>Bundle Total</span>
              <span style={{ color: 'var(--accent)' }}>{formatCurrency(discountedTotal, currency)}</span>
            </div>
            <button
              onClick={handleAddAllToCart}
              disabled={!isComplete}
              className="w-full btn-accent flex items-center justify-center gap-2 py-3"
              style={{ opacity: isComplete ? 1 : 0.5, cursor: isComplete ? 'pointer' : 'default' }}
            >
              <ShoppingBag size={16} />
              {isComplete ? 'Add Bundle to Cart' : `Add ${3 - filledCount} More Item${3 - filledCount !== 1 ? 's' : ''}`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
