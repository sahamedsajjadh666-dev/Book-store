import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Toaster } from 'sonner';
import { useStore } from './store/useStore';

// Multi-UI Library Providers & Theme Bridge
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import { ConfigProvider as AntdConfigProvider, theme as antdTheme } from 'antd';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';

// Components
import { PromoTicker } from './components/PromoTicker';
import { Navbar } from './components/Navbar';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { HeroSection } from './components/HeroSection';
import { CatalogSection } from './components/CatalogSection';
import { BundleBuilder } from './components/BundleBuilder';
import { CartDrawer, CheckoutModal } from './components/CartAndCheckout';
import { WishlistDrawer } from './components/WishlistDrawer';
import { ArchitectureDrawer } from './components/ArchitectureDrawer';
import { ReportsViewer } from './components/ReportsViewer';
import { CommandPalette } from './components/CommandPalette';
import { Footer } from './components/Footer';

// Robust Error Boundary
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 32, background: '#131A2A', color: '#F8FAFC', minHeight: '100vh', fontFamily: 'sans-serif' }}>
          <h1 style={{ color: '#F59E0B' }}>Something went wrong.</h1>
          <p style={{ color: '#94A3B8' }}>{this.state.error?.message}</p>
          <pre style={{ background: '#0B0F19', padding: 16, borderRadius: 8, overflow: 'auto' }}>
            {this.state.error?.stack}
          </pre>
          <button
            onClick={() => { localStorage.clear(); window.location.reload(); }}
            style={{ marginTop: 16, padding: '8px 16px', background: '#F59E0B', color: '#000', border: 'none', borderRadius: 4, cursor: 'pointer', fontWeight: 600 }}
          >
            Clear LocalStorage &amp; Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const { theme } = useStore();
  const [commandOpen, setCommandOpen] = useState(false);

  // Apply persisted theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme === 'sepia' ? 'sepia' : '');
  }, [theme]);

  // Global keyboard shortcut ⌘K / Ctrl+K
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setCommandOpen((v) => !v);
    }
    if (e.key === 'Escape') setCommandOpen(false);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Synchronized MUI Theme (Midnight vs Sepia)
  const muiTheme = useMemo(() => {
    return createTheme({
      palette: {
        mode: theme === 'midnight' ? 'dark' : 'light',
        primary: {
          main: theme === 'midnight' ? '#F59E0B' : '#B45309',
        },
        background: {
          default: theme === 'midnight' ? '#0B0F19' : '#F4ECD8',
          paper: theme === 'midnight' ? '#131A2A' : '#EAE0C8',
        },
        text: {
          primary: theme === 'midnight' ? '#F8FAFC' : '#2C1E16',
          secondary: theme === 'midnight' ? '#94A3B8' : '#6B5344',
        },
      },
      typography: {
        fontFamily: "'Inter', system-ui, sans-serif",
      },
    });
  }, [theme]);

  // Synchronized Ant Design Theme (Midnight vs Sepia)
  const antdConfigTheme = useMemo(() => {
    return {
      algorithm: theme === 'midnight' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      token: {
        colorPrimary: theme === 'midnight' ? '#F59E0B' : '#B45309',
        colorBgBase: theme === 'midnight' ? '#0B0F19' : '#F4ECD8',
        colorTextBase: theme === 'midnight' ? '#F8FAFC' : '#2C1E16',
        borderRadius: 8,
      },
    };
  }, [theme]);

  return (
    <ErrorBoundary>
      <MuiThemeProvider theme={muiTheme}>
        <AntdConfigProvider theme={antdConfigTheme}>
          <ChakraProvider value={defaultSystem}>
            <div
              style={{
                minHeight: '100vh',
                background: 'var(--bg-primary)',
                color: 'var(--text-primary)',
                transition: 'background 0.3s, color 0.3s',
              }}
            >
              {/* #01 Promo Ticker (Ant Design) */}
              <PromoTicker />

              {/* #02 Sticky Glassmorphic Navbar (Shadcn UI) */}
              <Navbar onCommandPaletteOpen={() => setCommandOpen(true)} />

              {/* #04 2-Mode Theme Pill Switcher (Chakra UI) */}
              <ThemeSwitcher />

              {/* #06 Dual Spotlight Hero (Tailwind UI) */}
              <HeroSection />

              {/* #07 #08 #09 #10 Catalog (Radix Tabs, MUI, Shadcn, Headless UI) */}
              <CatalogSection />

              {/* #11 3-Item Bundle Builder (Chakra UI) */}
              <BundleBuilder />

              {/* #17 Footer (Tailwind UI) */}
              <Footer />

              {/* #13 Cart Drawer (Vaul) */}
              <CartDrawer />

              {/* #15 Simulated Checkout Modal (Ant Design Steps) */}
              <CheckoutModal />

              {/* #14 Saved Wishlist Drawer (Radix Popover) */}
              <WishlistDrawer />

              {/* #05 UI Library Architecture Inspector Drawer (Vaul / Sheet) */}
              <ArchitectureDrawer />

              {/* #16 Architecture & Reports Viewer (MUI Table) */}
              <ReportsViewer />

              {/* #03 Command Palette (cmdk) */}
              <CommandPalette open={commandOpen} onClose={() => setCommandOpen(false)} />

              {/* #12 Toast Notification Stack (Sonner) */}
              <Toaster
                position="bottom-right"
                toastOptions={{
                  style: {
                    background: 'var(--bg-surface)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border)',
                  },
                }}
              />
            </div>
          </ChakraProvider>
        </AntdConfigProvider>
      </MuiThemeProvider>
    </ErrorBoundary>
  );
}
