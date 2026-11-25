// #07 Category & Manga Filter Tabs — Radix UI Tabs
// #08 Faceted Filter & Sort Bar — MUI
// #09 Book & Manga Cards — Shadcn UI
// #10 Quick-View Modal — Headless UI
import React, { useState } from 'react';
import * as RadixTabs from '@radix-ui/react-tabs';
import { MenuItem, Select, FormControl, Chip, Stack, Box } from '@mui/material';
// headlessui v2 — Transition wraps Dialog for animations
// Note: In HUI v2, Dialog has built-in transition via data-* attributes
// We use Dialog directly without wrapping Transition
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { catalog, Book, BookFormat, Category } from '../data/catalog';
import { CartItem, WishlistItem, useStore, formatCurrency } from '../store/useStore';
import { CoverArt } from './CoverArt';
import { toast } from 'sonner';
import { Heart, Eye, Plus, Star, X, BookOpen, ArrowLeft, ArrowRight } from 'lucide-react';

type TabId = 'all' | 'manga' | 'fiction' | 'scifi' | 'artdesign';

const TABS: { id: TabId; label: string }[] = [
  { id: 'all', label: 'All Titles' },
  { id: 'manga', label: '📚 Manga' },
  { id: 'fiction', label: 'Fiction' },
  { id: 'scifi', label: 'Sci-Fi & Fantasy' },
  { id: 'artdesign', label: 'Art & Design' },
];

const TAB_TO_CATEGORY: Record<TabId, Category | null> = {
  all: null,
  manga: 'Manga',
  fiction: 'Fiction',
  scifi: 'Sci-Fi & Fantasy',
  artdesign: 'Art & Design',
};

export const CatalogSection: React.FC = () => {
  const { addToCart, addToWishlist, removeFromWishlist, isWishlisted, inspectorMode, currency } = useStore();

  const [activeTab, setActiveTab] = useState<TabId>('all');
  const [filterFormat, setFilterFormat] = useState<string>('all');
  const [filterDir, setFilterDir] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('default');
  const [quickViewBook, setQuickViewBook] = useState<Book | null>(null);

  // Filter
  let books = catalog;
  const catFilter = TAB_TO_CATEGORY[activeTab];
  if (catFilter) books = books.filter((b) => b.category === catFilter);
  if (filterFormat !== 'all') books = books.filter((b) => b.editions.some((e) => e.format === filterFormat));
  if (filterDir === 'rtl') books = books.filter((b) => b.direction === 'RTL');
  if (filterDir === 'ltr') books = books.filter((b) => b.direction === 'LTR');

  // Sort
  if (sortBy === 'price-asc') books = [...books].sort((a, b) => a.editions[0].price - b.editions[0].price);
  if (sortBy === 'price-desc') books = [...books].sort((a, b) => b.editions[0].price - a.editions[0].price);
  if (sortBy === 'rating') books = [...books].sort((a, b) => b.rating - a.rating);

  return (
    <section id="catalog" className="py-12" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="font-serif text-3xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
            Our Catalog
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            {catalog.length} titles — {catalog.filter((b) => b.isManga).length} manga · {catalog.filter((b) => !b.isManga).length} books
          </p>
        </div>

        {/* #07 Category Tabs */}
        <div
          data-component-id="#07"
          data-ui-library="Radix UI Tabs"
          className={`mb-6 ${inspectorMode ? 'inspector-active' : ''}`}
        >
          <RadixTabs.Root value={activeTab} onValueChange={(v) => setActiveTab(v as TabId)}>
            <RadixTabs.List
              className="flex gap-1 p-1 rounded-xl w-fit"
              style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
            >
              {TABS.map((tab) => (
                <RadixTabs.Trigger
                  key={tab.id}
                  value={tab.id}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-all outline-none"
                  style={{
                    background: activeTab === tab.id ? 'var(--accent)' : 'transparent',
                    color: activeTab === tab.id ? '#000' : 'var(--text-muted)',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  {tab.label}
                </RadixTabs.Trigger>
              ))}
            </RadixTabs.List>
          </RadixTabs.Root>
        </div>

        {/* #08 Faceted Filter Bar */}
        <div
          data-component-id="#08"
          data-ui-library="MUI"
          className={`mb-8 p-4 rounded-xl flex flex-wrap gap-4 items-center ${inspectorMode ? 'inspector-active' : ''}`}
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
        >
          <span className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>Filter</span>

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <Select
              value={filterFormat}
              onChange={(e) => setFilterFormat(e.target.value)}
              sx={{
                color: 'var(--text-primary)',
                '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border)' },
                '.MuiSvgIcon-root': { color: 'var(--text-muted)' },
                fontSize: 13,
              }}
            >
              <MenuItem value="all">All Formats</MenuItem>
              <MenuItem value="Paperback">Paperback</MenuItem>
              <MenuItem value="Hardcover">Hardcover</MenuItem>
              <MenuItem value="Collector's Edition">Collector's Edition</MenuItem>
              <MenuItem value="Tankōbon">Tankōbon</MenuItem>
              <MenuItem value="Vizbig / 3-in-1">Vizbig / 3-in-1</MenuItem>
              <MenuItem value="Hardcover Deluxe">Hardcover Deluxe</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <Select
              value={filterDir}
              onChange={(e) => setFilterDir(e.target.value)}
              sx={{
                color: 'var(--text-primary)',
                '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border)' },
                '.MuiSvgIcon-root': { color: 'var(--text-muted)' },
                fontSize: 13,
              }}
            >
              <MenuItem value="all">All Directions</MenuItem>
              <MenuItem value="rtl">RTL Manga</MenuItem>
              <MenuItem value="ltr">LTR Books</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 160 }}>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              sx={{
                color: 'var(--text-primary)',
                '.MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border)' },
                '.MuiSvgIcon-root': { color: 'var(--text-muted)' },
                fontSize: 13,
              }}
            >
              <MenuItem value="default">Default Order</MenuItem>
              <MenuItem value="price-asc">Price: Low → High</MenuItem>
              <MenuItem value="price-desc">Price: High → Low</MenuItem>
              <MenuItem value="rating">Highest Rated</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {filterFormat !== 'all' && (
              <Chip
                label={filterFormat}
                size="small"
                onDelete={() => setFilterFormat('all')}
                sx={{ color: 'var(--accent) !important', borderColor: 'var(--accent) !important', fontSize: 12 }}
                variant="outlined"
              />
            )}
            {filterDir !== 'all' && (
              <Chip
                label={filterDir === 'rtl' ? 'RTL Manga' : 'LTR Books'}
                size="small"
                onDelete={() => setFilterDir('all')}
                sx={{ color: 'var(--accent) !important', borderColor: 'var(--accent) !important', fontSize: 12 }}
                variant="outlined"
              />
            )}
          </Box>

          <span className="ml-auto text-xs" style={{ color: 'var(--text-muted)' }}>
            {books.length} title{books.length !== 1 ? 's' : ''} shown
          </span>
        </div>

        {/* #09 Book Cards Grid */}
        <div
          data-component-id="#09"
          data-ui-library="Shadcn UI"
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${inspectorMode ? 'inspector-active' : ''}`}
        >
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onQuickView={() => setQuickViewBook(book)}
              addToCart={addToCart}
              addToWishlist={addToWishlist}
              removeFromWishlist={removeFromWishlist}
              isWishlisted={isWishlisted}
              inspectorMode={inspectorMode}
              currency={currency}
            />
          ))}
        </div>
      </div>

      {/* #10 Quick-View Modal */}
      {quickViewBook && (
        <QuickViewModal book={quickViewBook} onClose={() => setQuickViewBook(null)} addToCart={addToCart} inspectorMode={inspectorMode} currency={currency} />
      )}
    </section>
  );
};

// --- BookCard component ---
interface BookCardProps {
  book: Book;
  onQuickView: () => void;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (bookId: string) => void;
  isWishlisted: (bookId: string) => boolean;
  inspectorMode: boolean;
  currency: any;
}

const BookCard: React.FC<BookCardProps> = ({
  book, onQuickView, addToCart, addToWishlist, removeFromWishlist, isWishlisted, inspectorMode, currency
}) => {
  const [selectedEditionIdx, setSelectedEditionIdx] = useState(0);
  const edition = book.editions[selectedEditionIdx];
  const wishlisted = isWishlisted(book.id);

  const handleAddToCart = () => {
    addToCart({
      bookId: book.id,
      format: edition.format,
      price: edition.price,
      title: book.title,
      author: book.author,
      isManga: book.isManga,
      coverColors: book.coverColors,
    });
    toast.success(`${book.title} added!`, { description: `${edition.format} — ${formatCurrency(edition.price, currency)}` });
  };

  const toggleWishlist = () => {
    if (wishlisted) {
      removeFromWishlist(book.id);
      toast.info('Removed from Wishlist');
    } else {
      addToWishlist({
        bookId: book.id,
        format: edition.format,
        price: edition.price,
        title: book.title,
        author: book.author,
        isManga: book.isManga,
        coverColors: book.coverColors,
      });
      toast.success('Saved to Wishlist!');
    }
  };

  return (
    <div className="book-card rounded-2xl overflow-hidden flex flex-col">
      {/* Cover */}
      <div
        className="relative flex items-center justify-center py-6"
        style={{ background: book.coverColors.bg, minHeight: 220 }}
      >
        <CoverArt book={book} size="md" />
        {/* Direction badge */}
        <span
          className="absolute top-3 left-3 text-xs font-mono font-bold px-2 py-0.5 rounded"
          style={{ background: 'rgba(0,0,0,0.6)', color: book.coverColors.accent, border: `1px solid ${book.coverColors.accent}` }}
        >
          {book.direction}
        </span>
        {/* Wishlist button */}
        <button
          onClick={toggleWishlist}
          className="absolute top-3 right-3 p-1.5 rounded-full"
          style={{
            background: 'rgba(0,0,0,0.5)',
            border: 'none',
            cursor: 'pointer',
            color: wishlisted ? '#ef4444' : '#fff',
          }}
        >
          <Heart size={14} fill={wishlisted ? '#ef4444' : 'none'} />
        </button>
        {/* Quick view */}
        <button
          onClick={onQuickView}
          className="absolute bottom-3 right-3 p-1.5 rounded-full"
          style={{ background: 'rgba(0,0,0,0.5)', border: 'none', cursor: 'pointer', color: '#fff' }}
        >
          <Eye size={14} />
        </button>
        {/* Manga badge */}
        {book.isManga && book.volumeBadge && (
          <span
            className="absolute bottom-3 left-3 text-xs font-bold px-2 py-0.5 rounded"
            style={{ background: book.coverColors.accent, color: '#000' }}
          >
            {book.volumeBadge}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3
            className="text-sm font-bold leading-tight line-clamp-2 flex-1"
            style={{ color: 'var(--text-primary)' }}
          >
            {book.title}
          </h3>
        </div>
        <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{book.author}</p>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={10}
              fill={i < Math.floor(book.rating) ? 'var(--accent)' : 'none'}
              style={{ color: 'var(--accent)' }}
            />
          ))}
          <span className="text-xs ml-1" style={{ color: 'var(--text-muted)' }}>{book.rating}</span>
        </div>

        {/* Edition selector */}
        <div className="flex flex-wrap gap-1 mb-3">
          {book.editions.map((ed, idx) => (
            <button
              key={ed.format}
              onClick={() => setSelectedEditionIdx(idx)}
              className="text-xs px-2 py-1 rounded-full transition-all"
              style={{
                background: idx === selectedEditionIdx ? 'var(--accent)' : 'var(--border)',
                color: idx === selectedEditionIdx ? '#000' : 'var(--text-muted)',
                border: 'none',
                cursor: 'pointer',
                fontWeight: idx === selectedEditionIdx ? 600 : 400,
              }}
            >
              {ed.format}
            </button>
          ))}
        </div>

        {/* Price + Add */}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-lg font-bold" style={{ color: 'var(--accent)' }}>
            {formatCurrency(edition.price, currency)}
          </span>
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg transition-all"
            style={{ background: 'var(--accent)', color: '#000', border: 'none', cursor: 'pointer', fontWeight: 600 }}
          >
            <Plus size={14} /> Cart
          </button>
        </div>
      </div>
    </div>
  );
};

// --- QuickView Modal ---
interface QuickViewProps {
  book: Book;
  onClose: () => void;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  inspectorMode: boolean;
  currency: any;
}

const QuickViewModal: React.FC<QuickViewProps> = ({ book, onClose, addToCart, inspectorMode, currency }) => {
  const [selectedEditionIdx, setSelectedEditionIdx] = useState(0);
  const edition = book.editions[selectedEditionIdx];

  return (
    <Dialog open={true} onClose={onClose} className="relative z-[80]">
      {/* Backdrop */}
      <div
        className="fixed inset-0"
        style={{ background: 'rgba(0,0,0,0.65)' }}
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          data-component-id="#10"
          data-ui-library="Headless UI"
          className={`w-full max-w-2xl rounded-2xl overflow-hidden ${inspectorMode ? 'inspector-active' : ''}`}
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
        >
              {/* Header */}
              <div className="flex items-center justify-between p-5" style={{ borderBottom: '1px solid var(--border)' }}>
                <DialogTitle className="font-serif text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  Quick View
                </DialogTitle>
                <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 flex gap-6">
                {/* Cover */}
                <div className="flex-shrink-0">
                  <CoverArt book={book} size="lg" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'var(--accent)', color: '#000' }}>
                      {book.category}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--border)', color: 'var(--text-muted)' }}>
                      {book.direction} Reading
                    </span>
                    {book.volumeBadge && (
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--border)', color: 'var(--accent)' }}>
                        {book.volumeBadge}
                      </span>
                    )}
                  </div>

                  <h2 className="font-serif text-2xl font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                    {book.title}
                  </h2>
                  <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>
                    {book.isManga ? 'Mangaka' : 'Author'}: <strong style={{ color: 'var(--text-primary)' }}>{book.author}</strong>
                  </p>
                  <p className="text-xs mb-3" style={{ color: 'var(--text-muted)' }}>
                    {book.publisher} · {book.year} · {book.pages} pages
                  </p>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={14} fill={i < Math.floor(book.rating) ? 'var(--accent)' : 'none'} style={{ color: 'var(--accent)' }} />
                    ))}
                    <span className="text-sm ml-1" style={{ color: 'var(--text-muted)' }}>{book.rating}/5</span>
                  </div>

                  <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--text-muted)' }}>
                    {book.synopsis}
                  </p>

                  {/* Edition selector */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    {book.editions.map((ed, idx) => (
                      <button
                        key={ed.format}
                        onClick={() => setSelectedEditionIdx(idx)}
                        className="text-xs px-3 py-1.5 rounded-full transition-all"
                        style={{
                          background: idx === selectedEditionIdx ? 'var(--accent)' : 'var(--border)',
                          color: idx === selectedEditionIdx ? '#000' : 'var(--text-muted)',
                          border: 'none', cursor: 'pointer', fontWeight: idx === selectedEditionIdx ? 600 : 400
                        }}
                      >
                        {ed.format} — {formatCurrency(ed.price, currency)}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>
                      {formatCurrency(edition.price, currency)}
                    </span>
                    <button
                      className="btn-accent flex-1 text-sm"
                      onClick={() => {
                        addToCart({
                          bookId: book.id,
                          format: edition.format,
                          price: edition.price,
                          title: book.title,
                          author: book.author,
                          isManga: book.isManga,
                          coverColors: book.coverColors,
                        });
                        toast.success(`${book.title} added to cart!`);
                        onClose();
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>

              {/* Excerpt */}
              <div
                className="mx-6 mb-6 p-4 rounded-xl"
                style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  {book.direction === 'RTL' ? (
                    <ArrowLeft size={14} style={{ color: 'var(--accent)' }} />
                  ) : (
                    <ArrowRight size={14} style={{ color: 'var(--accent)' }} />
                  )}
                  <span className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>
                    {book.isManga ? 'Manga Scene Excerpt' : 'Chapter Excerpt'} · {book.direction}
                  </span>
                </div>
                <p
                  className="text-sm leading-relaxed italic"
                  style={{
                    color: 'var(--text-primary)',
                    direction: book.direction === 'RTL' ? 'rtl' : 'ltr',
                  }}
                >
                  "{book.excerpt}"
                </p>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      );
    };
