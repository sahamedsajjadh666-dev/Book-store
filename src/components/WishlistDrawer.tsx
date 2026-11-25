// #14 Wishlist Popover — Radix Popover
import React from 'react';
import * as Popover from '@radix-ui/react-popover';
import { Heart, X, ShoppingCart } from 'lucide-react';
import { useStore, formatCurrency } from '../store/useStore';
import { toast } from 'sonner';
import { catalog } from '../data/catalog';
import { CoverArt } from './CoverArt';

export const WishlistDrawer: React.FC = () => {
  const { wishlistOpen, setWishlistOpen, wishlist, removeFromWishlist, moveWishlistToCart, setCartOpen, inspectorMode, currency } = useStore();

  if (!wishlistOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-end pt-16 pr-4"
      style={{ background: 'rgba(0,0,0,0.3)' }}
      onClick={() => setWishlistOpen(false)}
    >
      <div
        data-component-id="#14"
        data-ui-library="Radix Popover"
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-sm rounded-2xl overflow-hidden ${inspectorMode ? 'inspector-active' : ''}`}
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2">
            <Heart size={18} style={{ color: '#ef4444' }} />
            <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
              Wishlist ({wishlist.length})
            </span>
          </div>
          <button
            onClick={() => setWishlistOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Items */}
        <div style={{ maxHeight: 400, overflowY: 'auto', padding: '8px' }}>
          {wishlist.length === 0 ? (
            <div className="text-center py-10">
              <Heart size={32} style={{ color: 'var(--border)', margin: '0 auto 8px' }} />
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No saved items</p>
            </div>
          ) : (
            wishlist.map((item) => {
              const book = catalog.find((b) => b.id === item.bookId);
              return (
                <div
                  key={item.bookId}
                  className="flex gap-3 p-3 rounded-xl mb-2"
                  style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}
                >
                  {book && <CoverArt book={book} size="sm" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold line-clamp-2 mb-1" style={{ color: 'var(--text-primary)' }}>
                      {item.title}
                    </p>
                    <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{item.format}</p>
                    <p className="text-sm font-bold mb-2" style={{ color: 'var(--accent)' }}>
                      {formatCurrency(item.price, currency)}
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          moveWishlistToCart(item.bookId);
                          setCartOpen(true);
                          setWishlistOpen(false);
                          toast.success(`${item.title} moved to cart!`);
                        }}
                        className="flex-1 flex items-center justify-center gap-1 text-xs py-1.5 rounded-lg"
                        style={{ background: 'var(--accent)', color: '#000', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                      >
                        <ShoppingCart size={12} /> Move to Cart
                      </button>
                      <button
                        onClick={() => { removeFromWishlist(item.bookId); toast.info('Removed from wishlist.'); }}
                        className="p-1.5 rounded-lg"
                        style={{ background: 'var(--border)', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
