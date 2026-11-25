// #16 Architecture & Reports Viewer — MUI Table
import React, { useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Tabs, Tab, Box,
} from '@mui/material';
import { X, FileText, Database } from 'lucide-react';
import { useStore } from '../store/useStore';

const components = [
  { id: '#01', name: 'Promo Announcement Ticker', library: 'Ant Design', state: 'Static messages', midnight: '--accent, --text-primary', sepia: '--accent (#B45309)' },
  { id: '#02', name: 'Sticky Glassmorphic Navbar', library: 'Shadcn UI', state: 'cartOpen, wishlist, inspectorMode', midnight: '--bg-glass, --border, --accent', sepia: '--bg-glass (warm)' },
  { id: '#03', name: 'Command Palette (⌘K)', library: 'cmdk', state: 'catalog, addToCart', midnight: '--bg-surface, --border', sepia: '--bg-surface (#EAE0C8)' },
  { id: '#04', name: '2-Mode Theme Pill Switcher', library: 'Chakra UI', state: 'theme, setTheme', midnight: 'ALL 6 tokens', sepia: 'ALL 6 tokens (warm)' },
  { id: '#05', name: 'Architecture Inspector Drawer', library: 'Vaul / Radix Sheet', state: 'architectureOpen', midnight: '--bg-surface, --border', sepia: '--bg-surface (#EAE0C8)' },
  { id: '#06', name: 'Dual Spotlight Hero', library: 'Tailwind UI', state: 'addToCart, addToWishlist', midnight: '--bg-primary, --accent', sepia: '--bg-primary (#F4ECD8)' },
  { id: '#07', name: 'Category & Manga Filter Tabs', library: 'Radix UI Tabs', state: 'activeTab (local)', midnight: '--bg-surface, --accent', sepia: '--accent (#B45309)' },
  { id: '#08', name: 'Faceted Filter & Sort Bar', library: 'MUI', state: 'filterFormat, filterDir, sortBy', midnight: 'MUI theme via CSS vars', sepia: 'MUI theme (sepia)' },
  { id: '#09', name: 'Interactive Book & Manga Cards', library: 'Shadcn UI', state: 'addToCart, wishlist, selectedEdition', midnight: '--bg-surface, --accent, --border', sepia: '--bg-surface (#EAE0C8)' },
  { id: '#10', name: 'Quick-View & Chapter Excerpt Modal', library: 'Headless UI', state: 'selectedBook (local)', midnight: '--bg-surface, --text-primary', sepia: '--bg-surface (#EAE0C8)' },
  { id: '#11', name: '3-Item Bundle Builder', library: 'Chakra UI', state: 'bundle[], addToBundle, addBundleToCart', midnight: '--border, --accent', sepia: '--accent (#B45309)' },
  { id: '#12', name: 'Toast Notification Stack', library: 'Sonner', state: 'Triggered by actions', midnight: 'Inherits via CSS vars', sepia: 'Inherits (warm)' },
  { id: '#13', name: 'Global Slide-Over Cart Drawer', library: 'Vaul', state: 'cart, giftWrap, promoCode, totals', midnight: '--bg-surface, --accent', sepia: '--bg-surface (#EAE0C8)' },
  { id: '#14', name: 'Saved Wishlist Popover', library: 'Radix Popover', state: 'wishlist[], moveWishlistToCart', midnight: '--bg-surface, --border, --accent', sepia: '--accent (#B45309)' },
  { id: '#15', name: 'Multi-Step Checkout Modal', library: 'Ant Design Steps', state: 'step (local), cart snapshot', midnight: '--accent (steps)', sepia: '--accent (#B45309)' },
  { id: '#16', name: 'Architecture & Reports Viewer', library: 'MUI Table', state: 'architectureOpen', midnight: '--bg-surface, --text-primary', sepia: '--text-primary (#2C1E16)' },
  { id: '#17', name: 'Bookshop & Manga Club Footer', library: 'Tailwind UI', state: 'setArchitectureOpen, newsletter', midnight: '--bg-primary, --border, --accent', sepia: '--bg-primary (#F4ECD8)' },
];

const report1 = `# Report 1: Store Type & Architectural Plan

## Store Domain & Hybrid Positioning
**Vellum & Ink** operates as an independent literary bookshop and specialty manga storefront, supporting both standard LTR books and RTL manga volumes with multi-edition pricing across 6 format types.

## Zero-Backend Client Architecture
Pure client-side state graph persisting via \`localStorage\`:
- \`vellum_store\` — unified Zustand store (cart, wishlist, theme, bundle, promo)

### localStorage Data Keys
| Key | Contents |
|-----|----------|
| \`vellum_store.cart\` | CartItem[] with bookId, format, price, quantity |
| \`vellum_store.wishlist\` | WishlistItem[] |
| \`vellum_store.theme\` | 'midnight' or 'sepia' |
| \`vellum_store.bundle\` | (BundleItem | null)[] — 3 slots |
| \`vellum_store.giftWrap\` | boolean |
| \`vellum_store.promoCode\` | string |
| \`vellum_store.promoApplied\` | boolean |

## Catalog
16 curated titles: 8 Literary/Sci-Fi/Design Books + 8 Manga Volumes with custom SVG/CSS cover art.

## Promo & Bundle Engine (Deterministic, Client-Side)
- \`READ20\` → 20% off subtotal
- \`MANGA15\` → 15% off manga line items
- 3-Item Bundle → automatic 15% discount applied at \`addBundleToCart()\`
- Free shipping automatically applied when subtotal ≥ $50

## Multi-UI Library CSS Bridge
All 8 UI libraries are synced via 6 shared \`:root\` CSS custom properties. Switching theme calls \`setTheme()\` which:
1. Updates Zustand store (persisted to localStorage)
2. Sets \`data-theme\` attribute on \`<html>\`
3. CSS cascade re-maps all 6 tokens
4. MUI ThemeProvider, Ant Design ConfigProvider, and Chakra tokens read the new values
`;

const report2 = `# Report 2: Multi-UI Library & 17-Component Matrix

## Cross-Library Style Harmonization
All 8 UI libraries share 6 CSS custom properties as a bridge:
\`--bg-primary\`, \`--bg-surface\`, \`--text-primary\`, \`--text-muted\`, \`--accent\`, \`--border\`

### Conflict Resolution Strategy
- **MUI**: Injected via \`sx\` prop referencing \`var(--...)\` + global \`.MuiPaper-root\` overrides
- **Ant Design**: \`ConfigProvider\` + global CSS class overrides for Steps component
- **Chakra UI**: Custom color mode reading CSS vars
- **Tailwind**: Extended theme with CSS var tokens (\`vi-bg\`, \`vi-accent\`, etc.)
- **Headless UI / cmdk / Vaul**: Styled via inline \`style\` props and global CSS

## Component Library Map
See the interactive table below for all 17 components with their library assignments and theme token dependencies.
`;

function downloadFile(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export const ReportsViewer: React.FC = () => {
  const { architectureOpen, setArchitectureOpen, inspectorMode } = useStore();
  const [activeTab, setActiveTab] = useState(0);

  if (!architectureOpen) return null;

  const handleExportMd = () => {
    const content = `${report1}\n\n---\n\n${report2}`;
    downloadFile(content, 'vellum-and-ink-reports.md', 'text/markdown');
  };

  const handleExportJson = () => {
    const data = {
      store: 'Vellum & Ink',
      version: '1.0.0',
      architecture: {
        frontend: 'React 18 + Vite + TypeScript',
        styling: 'Tailwind CSS + CSS Custom Properties',
        state: 'Zustand (persisted to localStorage)',
        theme: { tokens: ['--bg-primary', '--bg-surface', '--text-primary', '--text-muted', '--accent', '--border'], modes: ['midnight', 'sepia'] },
        uiLibraries: ['Shadcn UI / Radix UI', 'MUI', 'Ant Design', 'Chakra UI', 'Headless UI', 'cmdk', 'Sonner', 'Vaul'],
      },
      components: components.map((c) => ({
        id: c.id, name: c.name, library: c.library, state: c.state,
        themeTokens: { midnight: c.midnight, sepia: c.sepia },
      })),
    };
    downloadFile(JSON.stringify(data, null, 2), 'vellum-and-ink-architecture.json', 'application/json');
  };

  return (
    <div
      className="fixed inset-0 z-[85] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.65)' }}
      onClick={(e) => { if (e.target === e.currentTarget) setArchitectureOpen(false); }}
    >
      <div
        data-component-id="#16"
        data-ui-library="MUI Table"
        className={`w-full max-w-5xl rounded-2xl overflow-hidden flex flex-col ${inspectorMode ? 'inspector-active' : ''}`}
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          maxHeight: '90vh',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 flex-shrink-0" style={{ borderBottom: '1px solid var(--border)' }}>
          <h2 className="text-xl font-bold font-serif" style={{ color: 'var(--text-primary)' }}>
            Architecture & Store Reports
          </h2>
          <div className="flex items-center gap-3">
            <button
              onClick={handleExportMd}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg btn-ghost"
            >
              <FileText size={14} /> Export .md
            </button>
            <button
              onClick={handleExportJson}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg btn-ghost"
            >
              <Database size={14} /> Export .json
            </button>
            <button onClick={() => setArchitectureOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'var(--border)', px: 2, flexShrink: 0 }}>
          <Tabs
            value={activeTab}
            onChange={(_, v) => setActiveTab(v)}
            sx={{
              '.MuiTab-root': { color: 'var(--text-muted)', fontSize: 13, textTransform: 'none' },
              '.Mui-selected': { color: 'var(--accent) !important' },
              '.MuiTabs-indicator': { backgroundColor: 'var(--accent)' },
            }}
          >
            <Tab label="Report 1: Store Architecture" />
            <Tab label="Report 2: Component Matrix" />
          </Tabs>
        </Box>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
          {activeTab === 0 && (
            <div>
              <div
                className="prose max-w-none text-sm leading-relaxed"
                style={{ color: 'var(--text-primary)' }}
              >
                {report1.split('\n').map((line, i) => {
                  if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold font-serif mb-3 mt-6" style={{ color: 'var(--text-primary)' }}>{line.slice(3)}</h2>;
                  if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold font-serif mb-4" style={{ color: 'var(--accent)' }}>{line.slice(2)}</h1>;
                  if (line.startsWith('### ')) return <h3 key={i} className="text-base font-bold mb-2 mt-4" style={{ color: 'var(--text-primary)' }}>{line.slice(4)}</h3>;
                  if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{line.slice(2, -2)}</p>;
                  if (line.startsWith('- `')) {
                    const match = line.match(/- `([^`]+)`\s*→?\s*(.*)/);
                    if (match) return <div key={i} className="flex gap-2 mb-1"><code className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'var(--border)', color: 'var(--accent)' }}>{match[1]}</code><span style={{ color: 'var(--text-muted)' }}>{match[2]}</span></div>;
                  }
                  if (line.startsWith('| ')) {
                    return null; // skip raw table lines, handled below
                  }
                  if (line === '') return <br key={i} />;
                  return <p key={i} className="mb-2" style={{ color: 'var(--text-muted)' }}>{line}</p>;
                })}

                {/* localStorage table */}
                <TableContainer component={Paper} sx={{ mb: 3, background: 'var(--bg-primary) !important', border: '1px solid var(--border)' }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, fontSize: 12 }}>localStorage Key</TableCell>
                        <TableCell sx={{ fontWeight: 700, fontSize: 12 }}>Contents</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {[
                        ['vellum_store.cart', 'CartItem[] — bookId, format, price, quantity'],
                        ['vellum_store.wishlist', 'WishlistItem[]'],
                        ['vellum_store.theme', "'midnight' or 'sepia'"],
                        ['vellum_store.bundle', '(BundleItem | null)[] — 3 slots'],
                        ['vellum_store.giftWrap', 'boolean'],
                        ['vellum_store.promoCode', 'string'],
                        ['vellum_store.promoApplied', 'boolean'],
                      ].map(([key, val]) => (
                        <TableRow key={key}>
                          <TableCell sx={{ fontSize: 12 }}><code>{key}</code></TableCell>
                          <TableCell sx={{ fontSize: 12, color: 'var(--text-muted)' }}>{val}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </div>
          )}

          {activeTab === 1 && (
            <div>
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                All 17 components mapped to their UI libraries, state slices, and theme token dependencies for both{' '}
                <strong style={{ color: 'var(--text-primary)' }}>Midnight</strong> and{' '}
                <strong style={{ color: 'var(--accent)' }}>Sepia</strong> modes.
              </p>
              <TableContainer component={Paper} sx={{ background: 'var(--bg-primary) !important', border: '1px solid var(--border)' }}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, fontSize: 11, whiteSpace: 'nowrap' }}>ID</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: 11 }}>Component</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: 11, whiteSpace: 'nowrap' }}>UI Library</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: 11 }}>State Slices</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: 11 }}>Midnight Tokens</TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: 11 }}>Sepia Tokens</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {components.map((c) => (
                      <TableRow key={c.id} sx={{ '&:hover': { background: 'rgba(255,255,255,0.03)' } }}>
                        <TableCell>
                          <span
                            style={{
                              background: 'var(--accent)',
                              color: '#000',
                              fontSize: 10,
                              fontWeight: 700,
                              padding: '2px 6px',
                              borderRadius: 3,
                              fontFamily: 'monospace',
                            }}
                          >
                            {c.id}
                          </span>
                        </TableCell>
                        <TableCell sx={{ fontSize: 11, fontWeight: 600, maxWidth: 160 }}>{c.name}</TableCell>
                        <TableCell>
                          <span
                            style={{
                              background: 'var(--border)',
                              color: 'var(--accent)',
                              fontSize: 10,
                              padding: '2px 6px',
                              borderRadius: 12,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {c.library}
                          </span>
                        </TableCell>
                        <TableCell sx={{ fontSize: 10, color: 'var(--text-muted)', maxWidth: 140 }}>{c.state}</TableCell>
                        <TableCell sx={{ fontSize: 10, fontFamily: 'monospace', maxWidth: 130 }}>{c.midnight}</TableCell>
                        <TableCell sx={{ fontSize: 10, fontFamily: 'monospace', maxWidth: 130, color: 'var(--accent)' }}>{c.sepia}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
