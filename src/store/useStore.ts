import { useMemo } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Book, BookFormat } from '../data/catalog';

export interface CartItem {
  bookId: string;
  format: BookFormat;
  price: number;
  quantity: number;
  title: string;
  author: string;
  isManga: boolean;
  coverColors: Book['coverColors'];
}

export interface WishlistItem {
  bookId: string;
  format: BookFormat;
  price: number;
  title: string;
  author: string;
  isManga: boolean;
  coverColors: Book['coverColors'];
}

export interface BundleItem {
  bookId: string;
  format: BookFormat;
  price: number;
  title: string;
  isManga: boolean;
  coverColors: Book['coverColors'];
}

export type Theme = 'midnight' | 'sepia';

export type CurrencyCode = 'USD' | 'INR' | 'GBP' | 'EUR' | 'JPY' | 'CAD' | 'AUD';

export interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  name: string;
  rate: number;
  flag: string;
}

export const CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  USD: { code: 'USD', symbol: '$', name: 'Dollar (USD)', rate: 1.0, flag: '🇺🇸' },
  INR: { code: 'INR', symbol: '₹', name: 'Rupees (INR)', rate: 84.4, flag: '🇮🇳' },
  GBP: { code: 'GBP', symbol: '£', name: 'Pound (GBP)', rate: 0.79, flag: '🇬🇧' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro (EUR)', rate: 0.93, flag: '🇪🇺' },
  JPY: { code: 'JPY', symbol: '¥', name: 'Yen (JPY)', rate: 154.5, flag: '🇯🇵' },
  CAD: { code: 'CAD', symbol: 'CA$', name: 'Canadian Dollar', rate: 1.40, flag: '🇨🇦' },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rate: 1.53, flag: '🇦🇺' },
};

export const formatCurrency = (amountInUSD: number, currency: CurrencyCode = 'USD'): string => {
  const info = CURRENCIES[currency] || CURRENCIES.USD;
  const converted = amountInUSD * info.rate;
  if (info.code === 'JPY') {
    return `${info.symbol}${Math.round(converted).toLocaleString()}`;
  }
  return `${info.symbol}${converted.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

interface StoreState {
  // Theme
  theme: Theme;
  setTheme: (t: Theme) => void;

  // Currency
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;

  // Cart
  cart: CartItem[];
  giftWrap: boolean;
  promoCode: string;
  promoApplied: boolean;
  promoDiscount: number;
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (bookId: string, format: BookFormat) => void;
  updateQuantity: (bookId: string, format: BookFormat, delta: number) => void;
  clearCart: () => void;
  toggleGiftWrap: () => void;
  applyPromo: (code: string) => { success: boolean; message: string };
  clearPromo: () => void;

  // Wishlist
  wishlist: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (bookId: string) => void;
  moveWishlistToCart: (bookId: string) => void;
  isWishlisted: (bookId: string) => boolean;

  // Bundle
  bundle: (BundleItem | null)[];
  addToBundle: (slot: number, item: BundleItem) => void;
  removeFromBundle: (slot: number) => void;
  clearBundle: () => void;
  addBundleToCart: () => void;

  // UI state
  cartOpen: boolean;
  wishlistOpen: boolean;
  checkoutOpen: boolean;
  inspectorMode: boolean;
  architectureOpen: boolean;
  setCartOpen: (v: boolean) => void;
  setWishlistOpen: (v: boolean) => void;
  setCheckoutOpen: (v: boolean) => void;
  setInspectorMode: (v: boolean) => void;
  setArchitectureOpen: (v: boolean) => void;
}

const PROMO_CODES: Record<string, { discount: number; type: 'flat' | 'manga'; label: string }> = {
  READ20: { discount: 0.20, type: 'flat', label: '20% off your order' },
  MANGA15: { discount: 0.15, type: 'manga', label: '15% off manga items' },
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      theme: 'midnight',
      setTheme: (t) => {
        set({ theme: t });
        document.documentElement.setAttribute('data-theme', t === 'sepia' ? 'sepia' : '');
      },

      currency: 'USD',
      setCurrency: (c) => set({ currency: c }),

      cart: [],
      giftWrap: false,
      promoCode: '',
      promoApplied: false,
      promoDiscount: 0,

      addToCart: (item) => set((s) => {
        const existing = s.cart.find(
          (c) => c.bookId === item.bookId && c.format === item.format
        );
        if (existing) {
          return {
            cart: s.cart.map((c) =>
              c.bookId === item.bookId && c.format === item.format
                ? { ...c, quantity: c.quantity + 1 }
                : c
            ),
          };
        }
        return { cart: [...s.cart, { ...item, quantity: 1 }] };
      }),

      removeFromCart: (bookId, format) =>
        set((s) => ({ cart: s.cart.filter((c) => !(c.bookId === bookId && c.format === format)) })),

      updateQuantity: (bookId, format, delta) =>
        set((s) => ({
          cart: s.cart
            .map((c) =>
              c.bookId === bookId && c.format === format
                ? { ...c, quantity: Math.max(0, c.quantity + delta) }
                : c
            )
            .filter((c) => c.quantity > 0),
        })),

      clearCart: () => set({ cart: [], giftWrap: false, promoCode: '', promoApplied: false, promoDiscount: 0 }),
      toggleGiftWrap: () => set((s) => ({ giftWrap: !s.giftWrap })),

      applyPromo: (code) => {
        const promo = PROMO_CODES[code.toUpperCase()];
        if (!promo) return { success: false, message: 'Invalid promo code.' };
        const { cart } = get();
        if (promo.type === 'manga' && !cart.some((c) => c.isManga)) {
          return { success: false, message: 'MANGA15 requires at least one manga in cart.' };
        }
        set({ promoCode: code.toUpperCase(), promoApplied: true, promoDiscount: promo.discount });
        return { success: true, message: `${promo.label} applied!` };
      },

      clearPromo: () => set({ promoCode: '', promoApplied: false, promoDiscount: 0 }),

      wishlist: [],
      addToWishlist: (item) =>
        set((s) => ({
          wishlist: s.wishlist.some((w) => w.bookId === item.bookId)
            ? s.wishlist
            : [...s.wishlist, item],
        })),
      removeFromWishlist: (bookId) =>
        set((s) => ({ wishlist: s.wishlist.filter((w) => w.bookId !== bookId) })),
      moveWishlistToCart: (bookId) => {
        const { wishlist, addToCart, removeFromWishlist } = get();
        const item = wishlist.find((w) => w.bookId === bookId);
        if (item) {
          addToCart({ ...item, isManga: item.isManga });
          removeFromWishlist(bookId);
        }
      },
      isWishlisted: (bookId) => get().wishlist.some((w) => w.bookId === bookId),

      bundle: [null, null, null],
      addToBundle: (slot, item) =>
        set((s) => {
          const nb = [...s.bundle];
          nb[slot] = item;
          return { bundle: nb };
        }),
      removeFromBundle: (slot) =>
        set((s) => {
          const nb = [...s.bundle];
          nb[slot] = null;
          return { bundle: nb };
        }),
      clearBundle: () => set({ bundle: [null, null, null] }),
      addBundleToCart: () => {
        const { bundle, addToCart } = get();
        bundle.forEach((item) => {
          if (item) {
            addToCart({
              bookId: item.bookId,
              format: item.format,
              price: item.price * 0.85,
              title: item.title,
              author: '',
              isManga: item.isManga,
              coverColors: item.coverColors,
            });
          }
        });
        set({ bundle: [null, null, null] });
      },

      cartOpen: false,
      wishlistOpen: false,
      checkoutOpen: false,
      inspectorMode: false,
      architectureOpen: false,
      setCartOpen: (v) => set({ cartOpen: v }),
      setWishlistOpen: (v) => set({ wishlistOpen: v }),
      setCheckoutOpen: (v) => set({ checkoutOpen: v }),
      setInspectorMode: (v) => set({ inspectorMode: v }),
      setArchitectureOpen: (v) => set({ architectureOpen: v }),
    }),
    {
      name: 'vellum_store',
      partialize: (s) => ({
        theme: s.theme,
        currency: s.currency,
        cart: s.cart,
        wishlist: s.wishlist,
        bundle: s.bundle,
        giftWrap: s.giftWrap,
        promoCode: s.promoCode,
        promoApplied: s.promoApplied,
        promoDiscount: s.promoDiscount,
      }),
    }
  )
);

// Selectors
export const useCartTotal = () => {
  const cart = useStore((s) => s.cart);
  const giftWrap = useStore((s) => s.giftWrap);
  const promoCode = useStore((s) => s.promoCode);
  const promoApplied = useStore((s) => s.promoApplied);

  return useMemo(() => {
    const sub = cart.reduce((acc, c) => acc + c.price * c.quantity, 0);
    let discount = 0;
    if (promoApplied) {
      if (promoCode === 'READ20') discount = sub * 0.20;
      if (promoCode === 'MANGA15') {
        const mangaTotal = cart
          .filter((c) => c.isManga)
          .reduce((a, c) => a + c.price * c.quantity, 0);
        discount = mangaTotal * 0.15;
      }
    }
    const afterDiscount = sub - discount;
    const shipping = afterDiscount >= 50 ? 0 : 5.99;
    const giftWrapFee = giftWrap ? 4.0 : 0;
    return {
      subtotal: sub,
      discount,
      shipping,
      giftWrapFee,
      total: afterDiscount + shipping + giftWrapFee,
    };
  }, [cart, giftWrap, promoCode, promoApplied]);
};

export const useCartCount = () => useStore((s) => s.cart.reduce((a, c) => a + c.quantity, 0));
