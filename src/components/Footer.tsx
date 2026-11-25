// #17 Bookshop & Manga Club Footer — Tailwind UI
import React, { useState } from 'react';
import { BookOpen, Mail, Twitter, Instagram, Github, ArrowRight, Layers } from 'lucide-react';
import { useStore } from '../store/useStore';
import { toast } from 'sonner';

export const Footer: React.FC = () => {
  const { setArchitectureOpen, inspectorMode } = useStore();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error('Please enter a valid email address.');
      return;
    }
    setSubmitted(true);
    toast.success('Subscribed! Welcome to the Vellum & Ink newsletter.');
    setEmail('');
  };

  const links = {
    Shop: ['All Books', 'Manga Collection', 'New Arrivals', 'Bundle Builder', 'Gift Cards'],
    Read: ['Staff Picks', 'Reading Lists', 'Manga Guide', 'Book Club', 'Events'],
    Info: ['About Us', 'Shipping Policy', 'Returns', 'Press Kit', 'Affiliates'],
  };

  return (
    <footer
      id="footer"
      data-component-id="#17"
      data-ui-library="Tailwind UI"
      className={`${inspectorMode ? 'inspector-active' : ''}`}
      style={{
        background: 'var(--bg-primary)',
        borderTop: '2px solid var(--border)',
        marginTop: 0,
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={24} style={{ color: 'var(--accent)' }} />
              <span className="font-serif text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Vellum <span style={{ color: 'var(--accent)' }}>&</span> Ink
              </span>
            </div>
            <p className="text-sm mb-6 leading-relaxed max-w-sm" style={{ color: 'var(--text-muted)' }}>
              An independent literary bookshop and specialty manga storefront. Curating the finest
              volumes for the discerning reader since 2024.
            </p>

            {/* Newsletter */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--accent)' }}>
                📬 Manga Club Newsletter
              </p>
              {submitted ? (
                <p className="text-sm" style={{ color: 'var(--accent)' }}>
                  ✓ You're on the list!
                </p>
              ) : (
                <form onSubmit={handleSubscribe} className="flex gap-2">
                  <div className="flex-1 relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      className="w-full text-sm py-2 pl-9 pr-3 rounded-lg"
                      style={{
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                        outline: 'none',
                      }}
                    />
                  </div>
                  <button type="submit" className="btn-accent text-xs px-4 flex items-center gap-1">
                    Join <ArrowRight size={12} />
                  </button>
                </form>
              )}
              <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                Monthly picks, manga releases, and reading events.
              </p>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([heading, items]) => (
            <div key={heading}>
              <h3 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'var(--accent)' }}>
                {heading}
              </h3>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-sm transition-colors hover:text-[var(--accent)]"
                      style={{ color: 'var(--text-muted)', textDecoration: 'none' }}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-wrap items-center justify-between gap-4 mt-12 pt-8"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            © 2024 Vellum & Ink. All rights reserved.{' '}
            <span style={{ color: 'var(--border)' }}>·</span>{' '}
            Powered by React + Vite + TypeScript
          </p>

          <div className="flex items-center gap-4">
            {/* Quick links */}
            <button
              onClick={() => setArchitectureOpen(true)}
              className="flex items-center gap-1.5 text-xs"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            >
              <Layers size={12} /> Architecture Reports
            </button>

            {/* Social */}
            {[Twitter, Instagram, Github].map((Icon, i) => (
              <button
                key={i}
                className="p-1.5 rounded-lg transition-colors"
                style={{ background: 'var(--border)', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <Icon size={14} />
              </button>
            ))}
          </div>
        </div>

        {/* Component registry summary */}
        <div
          className="mt-8 p-4 rounded-xl"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
        >
          <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-muted)' }}>
            UI LIBRARY REGISTRY
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { lib: 'Ant Design', comps: '#01, #15' },
              { lib: 'Shadcn UI / Radix', comps: '#02, #09' },
              { lib: 'cmdk', comps: '#03' },
              { lib: 'Chakra UI', comps: '#04, #11' },
              { lib: 'Vaul / Sheet', comps: '#05, #13' },
              { lib: 'Tailwind UI', comps: '#06, #17' },
              { lib: 'Radix Tabs', comps: '#07' },
              { lib: 'MUI', comps: '#08, #16' },
              { lib: 'Headless UI', comps: '#10' },
              { lib: 'Sonner', comps: '#12' },
              { lib: 'Radix Popover', comps: '#14' },
            ].map(({ lib, comps }) => (
              <div
                key={lib}
                className="flex items-center gap-1.5 text-xs px-2 py-1 rounded-full"
                style={{ background: 'var(--border)', color: 'var(--text-muted)' }}
              >
                <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{lib}</span>
                <span>→ {comps}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
