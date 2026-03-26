'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

type OrderItem = { name: string; quantity: number; price: number };
type Order = {
  id: string;
  items: OrderItem[];
  total: number;
  customer: { name: string; email: string; address: string; city: string; zip: string };
  status: string;
  date: string;
  paymentId?: string;
};

const STATUSES = [
  {
    key: 'confirmed',
    label: 'Confirmée',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
    description: 'Votre commande a été reçue et validée.',
  },
  {
    key: 'prepared',
    label: 'En préparation',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7H4a2 2 0 00-2 2v6a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
      </svg>
    ),
    description: 'Nos équipes préparent votre colis avec soin.',
  },
  {
    key: 'shipped',
    label: 'Expédiée',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3m-4 10h8a2 2 0 002-2V9a2 2 0 00-2-2h-5l-3 3v7a2 2 0 002 2z" />
      </svg>
    ),
    description: 'Votre colis est en route. Livraison dans 48h.',
  },
  {
    key: 'delivered',
    label: 'Livrée',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline strokeLinecap="round" strokeLinejoin="round" points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    description: 'Votre colis a été livré. Bonne course !',
  },
];

const STATUS_ORDER = ['confirmed', 'prepared', 'shipped', 'delivered'];

function getStepOffset(orderDate: string, step: number): string {
  const base = new Date(orderDate);
  const offsets = [0, 2, 8, 26]; // hours after order
  const date = new Date(base.getTime() + offsets[step] * 60 * 60 * 1000);
  return date.toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

function TrackingContent() {
  const searchParams = useSearchParams();
  const [inputId, setInputId] = useState(searchParams.get('id') ?? '');
  const [order, setOrder] = useState<Order | null>(null);
  const [notFound, setNotFound] = useState(false);

  const lookup = (id: string) => {
    const raw = localStorage.getItem(`order-${id.trim().toUpperCase()}`);
    if (raw) {
      setOrder(JSON.parse(raw));
      setNotFound(false);
    } else {
      setOrder(null);
      setNotFound(true);
    }
  };

  useEffect(() => {
    const id = searchParams.get('id');
    if (id) { setInputId(id); lookup(id); }
  }, [searchParams]);

  const currentStatusIndex = order ? STATUS_ORDER.indexOf(order.status) : -1;

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Header */}
      <div className="border-b border-white/5">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-0.5">
            <span className="text-[#FF5C00] font-black text-lg tracking-tight uppercase">Pace</span>
            <span className="font-black text-lg tracking-tight uppercase text-white">Store</span>
          </Link>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {/* Title */}
        <div className="mb-10">
          <p className="text-[#FF5C00] text-xs font-bold uppercase tracking-[0.3em] mb-2">Suivi</p>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white">Ma commande</h1>
        </div>

        {/* Search */}
        <div className="bg-[#111111] border border-white/5 p-5 mb-8">
          <label className="block text-[10px] font-bold uppercase tracking-widest text-white/30 mb-2">
            Numéro de commande
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputId}
              onChange={(e) => setInputId(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && lookup(inputId)}
              placeholder="PACE-XXXXXX"
              className="flex-1 bg-[#0A0A0A] border border-white/10 text-white text-sm px-3 py-2.5 focus:outline-none focus:border-[#FF5C00]/50 transition-colors placeholder-white/15 uppercase"
            />
            <button
              onClick={() => lookup(inputId)}
              className="bg-[#FF5C00] hover:bg-white hover:text-[#0A0A0A] text-white font-black text-xs uppercase tracking-[0.12em] px-5 py-2.5 transition-all duration-200"
            >
              Rechercher
            </button>
          </div>
          {notFound && (
            <p className="text-red-400 text-xs mt-2">
              Commande introuvable. Vérifiez le numéro dans votre email de confirmation.
            </p>
          )}
        </div>

        {order && (
          <>
            {/* Order header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 bg-[#111111] border border-white/5 p-5">
              <div>
                <p className="text-white/30 text-xs uppercase tracking-widest mb-1">Commande</p>
                <p className="text-white font-black text-lg">{order.id}</p>
                <p className="text-white/25 text-xs mt-1">
                  {new Date(order.date).toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-white/30 text-xs uppercase tracking-widest mb-1">Total</p>
                <p className="text-white font-black text-xl">{order.total.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</p>
                <p className="text-white/25 text-xs mt-1">{order.customer.name}</p>
              </div>
            </div>

            {/* Status timeline */}
            <div className="bg-[#111111] border border-white/5 p-6 mb-6">
              <h2 className="text-white font-black text-xs uppercase tracking-widest mb-8">Statut</h2>

              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-5 top-0 bottom-0 w-px bg-white/5" />

                <div className="space-y-0">
                  {STATUSES.map((status, i) => {
                    const isCompleted = i <= currentStatusIndex;
                    const isCurrent = i === currentStatusIndex;

                    return (
                      <div key={status.key} className="relative flex gap-5 pb-8 last:pb-0">
                        {/* Node */}
                        <div
                          className={`relative z-10 w-10 h-10 flex-shrink-0 flex items-center justify-center border transition-colors duration-300 ${
                            isCurrent
                              ? 'bg-[#FF5C00] border-[#FF5C00] text-white'
                              : isCompleted
                              ? 'bg-[#FF5C00]/20 border-[#FF5C00]/40 text-[#FF5C00]'
                              : 'bg-[#0A0A0A] border-white/10 text-white/15'
                          }`}
                        >
                          {status.icon}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pt-1.5">
                          <div className="flex items-center justify-between gap-4">
                            <p
                              className={`font-black text-sm uppercase tracking-wide ${
                                isCompleted ? 'text-white' : 'text-white/25'
                              }`}
                            >
                              {status.label}
                            </p>
                            {isCompleted && (
                              <p className="text-white/25 text-[10px] uppercase tracking-wider flex-shrink-0">
                                {getStepOffset(order.date, i)}
                              </p>
                            )}
                          </div>
                          <p className={`text-xs leading-relaxed mt-1 ${isCompleted ? 'text-white/40' : 'text-white/15'}`}>
                            {status.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Order items */}
            <div className="bg-[#111111] border border-white/5 p-6">
              <h2 className="text-white font-black text-xs uppercase tracking-widest mb-5">Articles commandés</h2>
              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                    <div>
                      <p className="text-white text-xs font-bold uppercase">{item.name}</p>
                      <p className="text-white/30 text-[10px] mt-0.5">Qté : {item.quantity}</p>
                    </div>
                    <p className="text-[#FF5C00] text-sm font-black">
                      {(item.price * item.quantity).toLocaleString('fr-FR')} €
                    </p>
                  </div>
                ))}
              </div>

              {/* Delivery address */}
              <div className="mt-5 pt-4 border-t border-white/5">
                <p className="text-white/30 text-[10px] uppercase tracking-widest mb-1.5">Adresse de livraison</p>
                <p className="text-white/60 text-xs">{order.customer.address}</p>
                <p className="text-white/60 text-xs">{order.customer.zip} {order.customer.city}</p>
              </div>
            </div>
          </>
        )}

        <div className="mt-8 text-center">
          <Link href="/" className="text-white/30 text-xs uppercase tracking-widest hover:text-white transition-colors">
            ← Retour à la boutique
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function TrackingPage() {
  return (
    <Suspense>
      <TrackingContent />
    </Suspense>
  );
}
