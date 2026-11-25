// #03 Command Palette Search — cmdk + Radix Dialog
import React, { useState, useEffect } from 'react';
import { Command } from 'cmdk';
import { Search, BookOpen, X } from 'lucide-react';
import { catalog } from '../data/catalog';
import { useStore, formatCurrency } from '../store/useStore';
import { toast } from 'sonner';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ open, onClose }) => {
  const [search, setSearch] = useState('');
  const { addToCart, inspectorMode, currency } = useStore();

  useEffect(() => {
    if (!open) setSearch('');
  }, [open]);

  if (!open) return null;

  const filtered = catalog.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      b.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-24"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={onClose}
    >
      <div
        data-component-id="#03"
        data-ui-library="cmdk"
        onClick={(e) => e.stopPropagation()}
        className={inspectorMode ? 'inspector-active' : ''}
      >
        <Command label="Book Search">
          <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <Search size={18} style={{ color: 'var(--text-muted)' }} />
            <Command.Input
              value={search}
              onValueChange={setSearch}
              placeholder="Search books, manga, authors…"
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                fontSize: 15,
                flex: 1,
              }}
            />
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <X size={16} />
            </button>
          </div>
          <Command.List style={{ padding: '8px', maxHeight: 360, overflowY: 'auto' }}>
            <Command.Empty>
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                No results for "{search}"
              </div>
            </Command.Empty>
            {filtered.length > 0 && (
              <Command.Group heading={
                <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '4px 12px', display: 'block' }}>
                  {filtered.length} Result{filtered.length !== 1 ? 's' : ''}
                </span>
              }>
                {filtered.map((book) => (
                  <Command.Item
                    key={book.id}
                    value={book.title + book.author}
                    onSelect={() => {
                      const edition = book.editions[0];
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
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '10px 12px',
                      borderRadius: 6,
                      cursor: 'pointer',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 44,
                        borderRadius: 3,
                        background: book.coverColors.bg,
                        border: `1px solid ${book.coverColors.accent}`,
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <BookOpen size={14} style={{ color: book.coverColors.accent }} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{book.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{book.author} · {book.category}</div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)' }}>
                        {formatCurrency(book.editions[0].price, currency)}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>
                        {book.direction} · {book.isManga ? '📚' : '📖'}
                      </div>
                    </div>
                  </Command.Item>
                ))}
              </Command.Group>
            )}
          </Command.List>
          <div style={{ borderTop: '1px solid var(--border)', padding: '8px 16px', display: 'flex', gap: 16 }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>↑↓ navigate</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>↵ add to cart</span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>esc close</span>
          </div>
        </Command>
      </div>
    </div>
  );
};
