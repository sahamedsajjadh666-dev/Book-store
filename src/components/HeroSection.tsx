// #06 Dual Book & Manga Spotlight Hero — Tailwind UI
import React from 'react';
import { catalog } from '../data/catalog';
import { CoverArt } from './CoverArt';
import { useStore, formatCurrency } from '../store/useStore';
import { toast } from 'sonner';
import { ArrowRight, Star, Heart } from 'lucide-react';

export const HeroSection: React.FC = () => {
  const { addToCart, addToWishlist, isWishlisted, removeFromWishlist, setCartOpen, inspectorMode, currency } = useStore();

  const flagship = catalog.find((b) => b.id === 'blood-meridian') || catalog[0];
  const mangaFeatured = catalog.find((b) => b.id === 'berserk-deluxe-1') || catalog[1] || catalog[0];

  const handleAddToCart = (book: typeof flagship) => {
    const edition = book.editions[book.editions.length - 1]; // premium edition
    addToCart({
      bookId: book.id,
      format: edition.format,
      price: edition.price,
      title: book.title,
      author: book.author,
      isManga: book.isManga,
      coverColors: book.coverColors,
    });
    toast.success(`${book.title} added to cart!`, {
      description: `${edition.format} — ${formatCurrency(edition.price, currency)}`,
    });
  };

  const handleToggleWishlist = (book: typeof flagship) => {
    if (isWishlisted(book.id)) {
      removeFromWishlist(book.id);
      toast.info(`Removed ${book.title} from Wishlist`);
    } else {
      addToWishlist({
        bookId: book.id,
        format: book.editions[0].format,
        price: book.editions[0].price,
        title: book.title,
        author: book.author,
        isManga: book.isManga,
        coverColors: book.coverColors,
      });
      toast.success(`Saved ${book.title} to Wishlist!`);
    }
  };

  return (
    <section
      data-component-id="#06"
      data-ui-library="Tailwind UI"
      className={`relative overflow-hidden ${inspectorMode ? 'inspector-active' : ''}`}
      style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border)' }}
    >
      {/* Background radial glow */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 20%, var(--accent) 0%, transparent 65%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3" style={{ background: 'var(--border)', color: 'var(--accent)' }}>
            <span>Curator's Spotlight</span>
            <span>·</span>
            <span>Two Pillars of Print</span>
          </div>
          <h1
            className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold mb-3 tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Curated for the{' '}
            <span style={{ color: 'var(--accent)' }}>Dedicated Reader</span>
          </h1>
          <p className="text-sm sm:text-base max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            Exquisite physical editions: iconic literary fiction paired with definitive collector's manga volumes.
          </p>
        </div>

        {/* Dual Spotlight Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {[flagship, mangaFeatured].map((book) => {
            const premiumEdition = book.editions[book.editions.length - 1];
            const wishlisted = isWishlisted(book.id);

            return (
              <div
                key={book.id}
                className="rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row gap-5 items-center sm:items-stretch transition-all duration-300 hover:shadow-2xl"
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow)',
                }}
              >
                {/* Book Cover */}
                <div className="flex-shrink-0 flex items-center justify-center">
                  <CoverArt book={book} size="md" />
                </div>

                {/* Book Details */}
                <div className="flex flex-col flex-1 min-w-0 w-full justify-between">
                  <div>
                    {/* Badges */}
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: 'var(--accent)', color: '#0B0F19' }}
                      >
                        {book.isManga ? '📚 Manga' : '📖 Literary'}
                      </span>
                      <span
                        className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-full"
                        style={{ background: 'var(--border)', color: 'var(--text-muted)' }}
                      >
                        {book.direction}
                      </span>
                      {book.volumeBadge && (
                        <span
                          className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full ml-auto"
                          style={{ background: 'var(--border)', color: 'var(--accent)' }}
                        >
                          {book.volumeBadge}
                        </span>
                      )}
                    </div>

                    {/* Title & Author */}
                    <h2
                      className="font-serif text-lg sm:text-xl font-bold mb-1 leading-snug line-clamp-2"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {book.title}
                    </h2>
                    <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
                      {book.author} · {book.year}
                    </p>

                    {/* Star Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          fill={i < Math.floor(book.rating) ? 'var(--accent)' : 'none'}
                          style={{ color: 'var(--accent)' }}
                        />
                      ))}
                      <span className="text-xs ml-1 font-semibold" style={{ color: 'var(--text-muted)' }}>
                        {book.rating.toFixed(1)}
                      </span>
                    </div>

                    {/* Synopsis */}
                    <p
                      className="text-xs leading-relaxed line-clamp-3 mb-4"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      {book.synopsis}
                    </p>
                  </div>

                  {/* Pricing and Action Buttons */}
                  <div
                    className="mt-auto pt-3 border-t flex flex-wrap items-center justify-between gap-2"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <div>
                      <span className="text-[10px] uppercase tracking-wider block font-medium" style={{ color: 'var(--text-muted)' }}>
                        {premiumEdition.format}
                      </span>
                      <span className="text-xl font-bold font-serif" style={{ color: 'var(--accent)' }}>
                        {formatCurrency(premiumEdition.price, currency)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleWishlist(book)}
                        className="px-3 py-2 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5"
                        style={{
                          background: 'var(--bg-primary)',
                          borderColor: 'var(--border)',
                          color: wishlisted ? '#EF4444' : 'var(--text-muted)',
                        }}
                        title={wishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
                      >
                        <Heart size={14} fill={wishlisted ? '#EF4444' : 'none'} />
                        <span className="hidden sm:inline">{wishlisted ? 'Saved' : 'Save'}</span>
                      </button>

                      <button
                        onClick={() => {
                          handleAddToCart(book);
                          setCartOpen(true);
                        }}
                        className="btn-accent px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-sm whitespace-nowrap"
                      >
                        <span>Add to Cart</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
