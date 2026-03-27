'use client';
import { useState, useEffect, FormEvent } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart, CartItem } from '@/contexts/CartContext';

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

const stripeAppearance = {
  theme: 'night' as const,
  variables: {
    colorPrimary: '#FF5C00',
    colorBackground: '#0A0A0A',
    colorText: '#FFFFFF',
    colorTextSecondary: 'rgba(255,255,255,0.4)',
    colorTextPlaceholder: 'rgba(255,255,255,0.2)',
    colorIconTab: 'rgba(255,255,255,0.4)',
    borderRadius: '0px',
    fontFamily: 'system-ui, sans-serif',
    fontSizeBase: '13px',
  },
  rules: {
    '.Input': { border: '1px solid rgba(255,255,255,0.1)', padding: '10px 12px' },
    '.Input:focus': { border: '1px solid rgba(255,92,0,0.5)', boxShadow: 'none' },
    '.Label': { color: 'rgba(255,255,255,0.4)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '10px' },
  },
};

type CustomerInfo = { name: string; email: string; phone: string; address: string; city: string; zip: string };

// ── Inner form (must be inside <Elements>) ──────────────────────────────────
function CheckoutForm({ customer, orderId, items, grandTotal }: {
  customer: CustomerInfo;
  orderId: string;
  items: CartItem[];
  grandTotal: number;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { clear } = useCart();
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError('');

    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/tracking?id=${orderId}`,
        payment_method_data: {
          billing_details: {
            name: customer.name,
            email: customer.email,
            phone: customer.phone || undefined,
            address: { line1: customer.address, city: customer.city, postal_code: customer.zip, country: 'FR' },
          },
        },
      },
      redirect: 'if_required',
    });

    if (stripeError) {
      setError(stripeError.message ?? 'Erreur de paiement.');
      setProcessing(false);
      return;
    }

    if (paymentIntent?.status === 'succeeded' || paymentIntent?.status === 'processing') {
      // Save order to localStorage
      const order = {
        id: orderId,
        items,
        total: grandTotal,
        customer,
        status: 'confirmed',
        date: new Date().toISOString(),
        paymentId: paymentIntent.id,
      };
      localStorage.setItem(`order-${orderId}`, JSON.stringify(order));

      // Send confirmation email (best-effort)
      fetch('/api/send-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: customer.name, email: customer.email, orderId, items, total: grandTotal }),
      }).catch(() => {});

      clear();
      router.push(`/tracking?id=${orderId}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error && (
        <p className="text-red-400 text-xs border border-red-400/20 bg-red-400/5 px-3 py-2">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={!stripe || !elements || processing}
        className="w-full bg-[#FF5C00] hover:bg-white hover:text-[#0A0A0A] disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-xs uppercase tracking-[0.15em] py-4 transition-all duration-300 flex items-center justify-center gap-2"
      >
        {processing ? (
          <>
            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Traitement…
          </>
        ) : !stripe || !elements ? (
          <>
            <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white/50 rounded-full animate-spin" />
            Chargement…
          </>
        ) : (
          <>
            Payer {grandTotal.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </>
        )}
      </button>
      <p className="text-white/15 text-[10px] text-center uppercase tracking-wider">
        Paiement sécurisé SSL — Mode test Stripe
      </p>
    </form>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const { items, total, count, hydrated } = useCart();
  const router = useRouter();

  const shipping = total > 0 && total < 150 ? 4.99 : 0;
  const grandTotal = total + shipping;

  const [orderId] = useState(
    () => `PACE-${Date.now().toString(36).toUpperCase()}`
  );
  const [clientSecret, setClientSecret] = useState('');
  const [loadingIntent, setLoadingIntent] = useState(false);
  const [stripeReady, setStripeReady] = useState(false);

  const [customer, setCustomer] = useState<CustomerInfo>({
    name: '', email: '', phone: '', address: '', city: '', zip: '',
  });
  const [formDone, setFormDone] = useState(false);
  const [intentError, setIntentError] = useState('');

  // Wait for localStorage hydration before checking empty cart
  useEffect(() => {
    if (hydrated && count === 0) router.push('/');
  }, [hydrated, count, router]);

  const handleCustomerSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!customer.name || !customer.email || !customer.address || !customer.city || !customer.zip) return;

    setLoadingIntent(true);
    setIntentError('');
    try {
      const res = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: grandTotal }),
      });
      const data = await res.json();
      if (data.clientSecret) {
        setClientSecret(data.clientSecret);
        setStripeReady(true);
        setFormDone(true);
      } else {
        setIntentError('Impossible de préparer le paiement. Veuillez réessayer.');
      }
    } catch {
      setIntentError('Erreur réseau. Vérifiez votre connexion et réessayez.');
    } finally {
      setLoadingIntent(false);
    }
  };

  const setField = (field: keyof CustomerInfo) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setCustomer((prev) => ({ ...prev, [field]: e.target.value }));

  if (!hydrated) return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
      <span className="w-6 h-6 border-2 border-white/10 border-t-[#FF5C00] rounded-full animate-spin" />
    </div>
  );
  if (hydrated && count === 0) return null;

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Top bar */}
      <div className="border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-0.5">
            <span className="text-[#FF5C00] font-black text-lg tracking-tight uppercase">Pace</span>
            <span className="font-black text-lg tracking-tight uppercase text-white">Store</span>
          </Link>
          <div className="flex items-center gap-2 text-white/20 text-xs uppercase tracking-widest">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            Paiement sécurisé
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">

          {/* Left: Forms */}
          <div className="space-y-8">
            <div>
              <p className="text-[#FF5C00] text-xs font-bold uppercase tracking-[0.3em] mb-2">Commande</p>
              <h1 className="text-3xl font-black uppercase tracking-tight text-white">Finaliser l&apos;achat</h1>
            </div>

            {/* Step 1: Customer info */}
            <div className="bg-[#111111] border border-white/5 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white font-black text-xs uppercase tracking-widest">
                  1 — Vos informations
                </h2>
                {formDone && (
                  <button
                    onClick={() => { setFormDone(false); setStripeReady(false); }}
                    className="text-[#FF5C00] text-[10px] uppercase tracking-widest hover:underline min-h-[44px] px-2 flex items-center"
                  >
                    Modifier
                  </button>
                )}
              </div>

              {formDone ? (
                <div className="space-y-1 text-sm">
                  <p className="text-white font-bold">{customer.name}</p>
                  <p className="text-white/40">{customer.email}</p>
                  <p className="text-white/40">{customer.address}, {customer.zip} {customer.city}</p>
                </div>
              ) : (
                <form onSubmit={handleCustomerSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1.5">Nom complet *</label>
                      <input
                        type="text"
                        required
                        value={customer.name}
                        onChange={setField('name')}
                        className="w-full bg-[#0A0A0A] border border-white/10 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-[#FF5C00]/50 transition-colors placeholder-white/15"
                        placeholder="Marie Dupont"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1.5">Email *</label>
                      <input
                        type="email"
                        required
                        value={customer.email}
                        onChange={setField('email')}
                        className="w-full bg-[#0A0A0A] border border-white/10 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-[#FF5C00]/50 transition-colors placeholder-white/15"
                        placeholder="marie@exemple.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1.5">Téléphone</label>
                    <input
                      type="tel"
                      value={customer.phone}
                      onChange={setField('phone')}
                      className="w-full bg-[#0A0A0A] border border-white/10 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-[#FF5C00]/50 transition-colors placeholder-white/15"
                      placeholder="+33 6 00 00 00 00"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1.5">Adresse *</label>
                    <input
                      type="text"
                      required
                      value={customer.address}
                      onChange={setField('address')}
                      className="w-full bg-[#0A0A0A] border border-white/10 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-[#FF5C00]/50 transition-colors placeholder-white/15"
                      placeholder="12 rue de la Paix"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1.5">Code postal *</label>
                      <input
                        type="text"
                        required
                        value={customer.zip}
                        onChange={setField('zip')}
                        className="w-full bg-[#0A0A0A] border border-white/10 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-[#FF5C00]/50 transition-colors placeholder-white/15"
                        placeholder="75001"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-white/30 mb-1.5">Ville *</label>
                      <input
                        type="text"
                        required
                        value={customer.city}
                        onChange={setField('city')}
                        className="w-full bg-[#0A0A0A] border border-white/10 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-[#FF5C00]/50 transition-colors placeholder-white/15"
                        placeholder="Paris"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loadingIntent}
                    className="w-full bg-white text-[#0A0A0A] hover:bg-[#FF5C00] hover:text-white disabled:opacity-40 font-black text-xs uppercase tracking-[0.15em] py-4 min-h-[52px] transition-all duration-300"
                  >
                    {loadingIntent ? 'Chargement…' : 'Continuer vers le paiement →'}
                  </button>
                  {intentError && (
                    <p className="text-red-400 text-xs border border-red-400/20 bg-red-400/5 px-3 py-2">
                      {intentError}
                    </p>
                  )}
                </form>
              )}
            </div>

            {/* Step 2: Payment */}
            {stripeReady && clientSecret && stripePromise && (
              <div className="bg-[#111111] border border-white/5 p-6">
                <h2 className="text-white font-black text-xs uppercase tracking-widest mb-6">
                  2 — Paiement
                </h2>
                <Elements
                  stripe={stripePromise}
                  options={{ clientSecret, appearance: stripeAppearance }}
                >
                  <CheckoutForm
                    customer={customer}
                    orderId={orderId}
                    items={items}
                    grandTotal={grandTotal}
                  />
                </Elements>
              </div>
            )}

            {!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && (
              <div className="bg-[#FF5C00]/10 border border-[#FF5C00]/20 px-4 py-3 text-[#FF5C00] text-xs">
                <strong>Config requise :</strong> Ajoutez NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY dans .env.local
              </div>
            )}
          </div>

          {/* Right: Order summary */}
          <div className="lg:sticky lg:top-20 self-start space-y-4">
            <div className="bg-[#111111] border border-white/5 p-6">
              <h2 className="text-white font-black text-xs uppercase tracking-widest mb-5">
                Récapitulatif
              </h2>

              <div className="space-y-3 mb-5">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-14 h-14 flex-shrink-0 bg-[#1A1A1A] overflow-hidden">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                      <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-[#FF5C00] text-white text-[9px] font-black rounded-full flex items-center justify-center leading-none px-1">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-xs font-bold uppercase leading-tight">{item.name}</p>
                      <p className="text-white/40 text-xs mt-1">{item.price.toLocaleString('fr-FR')} €</p>
                    </div>
                    <p className="text-white text-xs font-black">
                      {(item.price * item.quantity).toLocaleString('fr-FR')} €
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4 border-t border-white/5">
                <div className="flex justify-between text-xs">
                  <span className="text-white/30">Sous-total</span>
                  <span className="text-white/60">{total.toLocaleString('fr-FR')} €</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/30">Livraison</span>
                  {shipping === 0 ? (
                    <span className="text-emerald-400 font-bold">Offerte</span>
                  ) : (
                    <span className="text-white/60">{shipping.toFixed(2)} €</span>
                  )}
                </div>
                <div className="flex justify-between items-baseline pt-3 border-t border-white/5">
                  <span className="text-white/50 text-xs font-bold uppercase tracking-widest">Total</span>
                  <span className="text-white text-xl font-black">
                    {grandTotal.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
                  </span>
                </div>
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: '🔒', label: 'SSL' },
                { icon: '↩', label: '60j retours' },
                { icon: '⚡', label: '48h livraison' },
              ].map(({ icon, label }) => (
                <div key={label} className="bg-[#111111] border border-white/5 px-2 py-3 text-center">
                  <div className="text-lg mb-1">{icon}</div>
                  <div className="text-white/25 text-[9px] uppercase tracking-wider font-bold">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
