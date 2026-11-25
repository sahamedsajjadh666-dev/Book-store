// #13 Global Slide-Over Cart Drawer — Vaul / Radix Sheet
// #15 Multi-Step Checkout Modal — Ant Design Steps
import React, { useState } from 'react';
import { Drawer } from 'vaul';
import { Steps } from 'antd';
import { X, Minus, Plus, Trash2, Gift, Tag, ShoppingBag, CheckCircle } from 'lucide-react';
import { useStore, useCartTotal, formatCurrency } from '../store/useStore';
import { toast } from 'sonner';
import { CoverArt } from './CoverArt';
import { catalog } from '../data/catalog';

const checkoutSteps = [
  { title: 'Shipping' },
  { title: 'Packaging' },
  { title: 'Confirmation' },
];

// --- Cart Drawer ---
export const CartDrawer: React.FC = () => {
  const {
    cartOpen, setCartOpen, cart, updateQuantity, removeFromCart, clearCart,
    giftWrap, toggleGiftWrap, promoCode, promoApplied, applyPromo, clearPromo,
    setCheckoutOpen, inspectorMode, currency,
  } = useStore();
  const totals = useCartTotal();
  const [promoInput, setPromoInput] = useState('');

  const handleApplyPromo = () => {
    const result = applyPromo(promoInput);
    if (result.success) {
      toast.success(result.message);
      setPromoInput('');
    } else {
      toast.error(result.message);
    }
  };

  const freeShippingProgress = Math.min((totals.subtotal / 50) * 100, 100);

  return (
    <Drawer.Root open={cartOpen} onOpenChange={setCartOpen} direction="right">
      <Drawer.Portal>
        <Drawer.Overlay style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 70 }} />
        <Drawer.Content
          data-component-id="#13"
          data-ui-library="Vaul"
          className={inspectorMode ? 'inspector-active' : ''}
          style={{
            position: 'fixed', right: 0, top: 0, bottom: 0,
            width: '100%', maxWidth: 440,
            background: 'var(--bg-surface)',
            borderLeft: '1px solid var(--border)',
            zIndex: 71,
            display: 'flex', flexDirection: 'column',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5" style={{ borderBottom: '1px solid var(--border)' }}>
            <div className="flex items-center gap-3">
              <ShoppingBag size={20} style={{ color: 'var(--accent)' }} />
              <div>
                <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Your Cart</h2>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {cart.length} item{cart.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {cart.length > 0 && (
                <button onClick={() => { clearCart(); toast.info('Cart cleared.'); }}
                  className="text-xs px-2 py-1 rounded" style={{ background: 'var(--border)', color: 'var(--text-muted)', border: 'none', cursor: 'pointer' }}>
                  Clear
                </button>
              )}
              <button onClick={() => setCartOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Free shipping progress */}
          {totals.subtotal < 50 && (
            <div className="px-5 py-3" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-primary)' }}>
              <div className="flex justify-between text-xs mb-1.5">
                <span style={{ color: 'var(--text-muted)' }}>Free shipping at {formatCurrency(50, currency)}</span>
                <span style={{ color: 'var(--accent)', fontWeight: 600 }}>
                  {formatCurrency(50 - totals.subtotal, currency)} to go
                </span>
              </div>
              <div className="shipping-bar-track">
                <div className="shipping-bar-fill" style={{ width: `${freeShippingProgress}%` }} />
              </div>
            </div>
          )}
          {totals.subtotal >= 50 && (
            <div className="px-5 py-2 text-xs font-semibold text-center" style={{ background: 'var(--accent)', color: '#000' }}>
              🎉 You have free shipping!
            </div>
          )}

          {/* Cart items */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag size={40} style={{ color: 'var(--border)', margin: '0 auto 12px' }} />
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Your cart is empty</p>
                <button
                  onClick={() => setCartOpen(false)}
                  className="mt-4 btn-accent text-sm"
                >
                  Browse Titles
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const book = catalog.find((b) => b.id === item.bookId);
                return (
                  <div
                    key={`${item.bookId}-${item.format}`}
                    className="flex gap-3 mb-4 pb-4"
                    style={{ borderBottom: '1px solid var(--border)' }}
                  >
                    {book && <CoverArt book={book} size="sm" />}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold line-clamp-2 mb-0.5" style={{ color: 'var(--text-primary)' }}>
                        {item.title}
                      </p>
                      <p className="text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
                        {item.format} · {item.isManga ? '📚' : '📖'}
                      </p>
                      <p className="text-sm font-bold mb-2" style={{ color: 'var(--accent)' }}>
                        {formatCurrency(item.price, currency)}
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.bookId, item.format, -1)}
                          className="p-1 rounded"
                          style={{ background: 'var(--border)', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-sm font-semibold w-6 text-center" style={{ color: 'var(--text-primary)' }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.bookId, item.format, 1)}
                          className="p-1 rounded"
                          style={{ background: 'var(--border)', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}
                        >
                          <Plus size={12} />
                        </button>
                        <button
                          onClick={() => { removeFromCart(item.bookId, item.format); toast.info('Item removed.'); }}
                          className="ml-auto p-1 rounded"
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div style={{ borderTop: '1px solid var(--border)', padding: '16px' }}>
              {/* Gift wrap */}
              <label
                className="flex items-center gap-3 mb-4 cursor-pointer p-3 rounded-lg"
                style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}
              >
                <input
                  type="checkbox"
                  checked={giftWrap}
                  onChange={toggleGiftWrap}
                  style={{ accentColor: 'var(--accent)', width: 16, height: 16 }}
                />
                <Gift size={16} style={{ color: 'var(--accent)' }} />
                <span className="text-sm flex-1" style={{ color: 'var(--text-primary)' }}>
                  Add Gift Wrap
                </span>
                <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>+{formatCurrency(4.0, currency)}</span>
              </label>

              {/* Promo code */}
              <div className="flex gap-2 mb-4">
                <div className="flex-1 relative">
                  <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    value={promoApplied ? promoCode : promoInput}
                    onChange={(e) => !promoApplied && setPromoInput(e.target.value.toUpperCase())}
                    placeholder="Promo code (READ20, MANGA15)"
                    disabled={promoApplied}
                    className="w-full text-sm py-2 pl-9 pr-3 rounded-lg"
                    style={{
                      background: 'var(--bg-primary)',
                      border: `1px solid ${promoApplied ? 'var(--accent)' : 'var(--border)'}`,
                      color: 'var(--text-primary)',
                      outline: 'none',
                    }}
                  />
                </div>
                {promoApplied ? (
                  <button onClick={() => { clearPromo(); toast.info('Promo code removed.'); }}
                    className="btn-ghost text-xs px-3">
                    Remove
                  </button>
                ) : (
                  <button onClick={handleApplyPromo} className="btn-accent text-xs px-4">Apply</button>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-1.5 mb-4">
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-muted)' }}>Subtotal</span>
                  <span style={{ color: 'var(--text-primary)' }}>{formatCurrency(totals.subtotal, currency)}</span>
                </div>
                {totals.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'var(--accent)' }}>Promo ({promoCode})</span>
                    <span style={{ color: 'var(--accent)' }}>-{formatCurrency(totals.discount, currency)}</span>
                  </div>
                )}
                {totals.giftWrapFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'var(--text-muted)' }}>Gift Wrap</span>
                    <span style={{ color: 'var(--text-primary)' }}>+{formatCurrency(totals.giftWrapFee, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-muted)' }}>Shipping</span>
                  <span style={{ color: totals.shipping === 0 ? 'var(--accent)' : 'var(--text-primary)' }}>
                    {totals.shipping === 0 ? 'FREE' : formatCurrency(totals.shipping, currency)}
                  </span>
                </div>
                <div
                  className="flex justify-between text-base font-bold pt-2"
                  style={{ borderTop: '1px solid var(--border)' }}
                >
                  <span style={{ color: 'var(--text-primary)' }}>Total</span>
                  <span style={{ color: 'var(--accent)' }}>{formatCurrency(totals.total, currency)}</span>
                </div>
              </div>

              <button
                onClick={() => { setCartOpen(false); setCheckoutOpen(true); }}
                className="w-full btn-accent py-3 text-sm font-bold"
              >
                Checkout →
              </button>
            </div>
          )}
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

// --- #15 Checkout Modal ---
export const CheckoutModal: React.FC = () => {
  const { checkoutOpen, setCheckoutOpen, cart, clearCart, inspectorMode, currency } = useStore();
  const totals = useCartTotal();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '', email: '', address: '', city: '', zip: '', country: 'US',
    giftNote: '', packaging: 'standard',
  });
  const [orderNumber] = useState(() => `VI-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);

  if (!checkoutOpen) return null;

  const handleClose = () => {
    setCheckoutOpen(false);
    if (step === 2) {
      clearCart();
      setStep(0);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.65)' }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <div
        data-component-id="#15"
        data-ui-library="Ant Design Steps"
        className={`w-full max-w-xl rounded-2xl overflow-hidden ${inspectorMode ? 'inspector-active' : ''}`}
        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5" style={{ borderBottom: '1px solid var(--border)' }}>
          <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Checkout</h2>
          <button onClick={handleClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Steps */}
        <div className="p-5" style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-primary)' }}>
        <Steps current={step} size="small" items={checkoutSteps.map(s => ({ title: <span style={{ color: 'var(--text-primary)', fontSize: 12 }}>{s.title}</span> }))} />
        </div>

        <div style={{ maxHeight: 420, overflowY: 'auto' }}>
          {/* Step 0: Shipping */}
          {step === 0 && (
            <div className="p-6 space-y-4">
              <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Shipping Details</h3>
              {[
                { label: 'Full Name', key: 'name', placeholder: 'Jane Doe', type: 'text' },
                { label: 'Email', key: 'email', placeholder: 'jane@example.com', type: 'email' },
                { label: 'Street Address', key: 'address', placeholder: '123 Bookshelf Lane', type: 'text' },
                { label: 'City', key: 'city', placeholder: 'Inkwell', type: 'text' },
                { label: 'ZIP / Postal Code', key: 'zip', placeholder: '10001', type: 'text' },
              ].map(({ label, key, placeholder, type }) => (
                <div key={key}>
                  <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>{label}</label>
                  <input
                    type={type}
                    value={(form as any)[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full px-3 py-2 rounded-lg text-sm"
                    style={{
                      background: 'var(--bg-primary)',
                      border: '1px solid var(--border)',
                      color: 'var(--text-primary)',
                      outline: 'none',
                    }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Step 1: Packaging */}
          {step === 1 && (
            <div className="p-6 space-y-4">
              <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Packaging & Gift Note</h3>
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>Packaging Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {['standard', 'premium'].map((pkg) => (
                    <label key={pkg} className="cursor-pointer">
                      <input
                        type="radio"
                        name="packaging"
                        value={pkg}
                        checked={form.packaging === pkg}
                        onChange={() => setForm((f) => ({ ...f, packaging: pkg }))}
                        className="sr-only"
                      />
                      <div
                        className="p-3 rounded-lg text-center text-sm font-medium"
                        style={{
                          border: `2px solid ${form.packaging === pkg ? 'var(--accent)' : 'var(--border)'}`,
                          background: form.packaging === pkg ? 'rgba(245,158,11,0.1)' : 'var(--bg-primary)',
                          color: form.packaging === pkg ? 'var(--accent)' : 'var(--text-muted)',
                        }}
                      >
                        {pkg === 'standard' ? '📦 Standard' : '✨ Premium Box'}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Gift Note (optional)</label>
                <textarea
                  value={form.giftNote}
                  onChange={(e) => setForm((f) => ({ ...f, giftNote: e.target.value }))}
                  placeholder="Write a personal message…"
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg text-sm resize-none"
                  style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          )}

          {/* Step 2: Confirmation */}
          {step === 2 && (
            <div className="p-6 text-center">
              <div className="mb-4" style={{ color: 'var(--accent)' }}>
                <CheckCircle size={56} className="mx-auto" />
              </div>
              <h3 className="font-serif text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Order Confirmed!
              </h3>
              <p className="text-sm mb-1" style={{ color: 'var(--text-muted)' }}>
                Order #{orderNumber}
              </p>
              <p className="text-xs mb-6" style={{ color: 'var(--text-muted)' }}>
                A confirmation will be sent to <strong style={{ color: 'var(--text-primary)' }}>{form.email || 'your email'}</strong>
              </p>
              <div
                className="text-left p-4 rounded-xl mb-6 space-y-2"
                style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}
              >
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-muted)' }}>Items</span>
                  <span style={{ color: 'var(--text-primary)' }}>{cart.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-muted)' }}>Shipping to</span>
                  <span style={{ color: 'var(--text-primary)' }}>{form.city || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--text-muted)' }}>Packaging</span>
                  <span style={{ color: 'var(--text-primary)' }}>{form.packaging}</span>
                </div>
                <div className="flex justify-between font-bold text-base pt-2" style={{ borderTop: '1px solid var(--border)' }}>
                  <span style={{ color: 'var(--text-primary)' }}>Total Paid</span>
                  <span style={{ color: 'var(--accent)' }}>{formatCurrency(totals.total, currency)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer buttons */}
        <div
          className="flex justify-between p-5"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          {step > 0 && step < 2 ? (
            <button onClick={() => setStep((s) => s - 1)} className="btn-ghost text-sm">← Back</button>
          ) : <div />}
          {step < 2 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="btn-accent text-sm px-6"
            >
              {step === 0 ? 'Continue →' : 'Place Order →'}
            </button>
          ) : (
            <button onClick={handleClose} className="btn-accent text-sm px-6">
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
