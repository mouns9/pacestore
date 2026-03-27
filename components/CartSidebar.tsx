'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/contexts/CartContext';

export default function CartSidebar() {
  const { items, isOpen, close, remove, updateQty, total, count } = useCart();

  const shipping = total > 0 && total < 150 ? 4.99 : 0;
  const grandTotal = total + shipping;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={close}
      />

      {/* Sidebar panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-[420px] bg-[#111111] border-l border-white/5 z-50 flex flex-col transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 flex-shrink-0">
          <div>
            <h2 className="text-white font-black text-sm uppercase tracking-widest">Panier</h2>
            <p className="text-white/25 text-xs mt-0.5">
              {count} article{count !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={close}
            className="text-white/30 hover:text-white transition-colors p-3 -mr-2 hover:bg-white/5 min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-4 px-6 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-5 text-center py-16">
              <svg
                width="52"
                height="52"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-white/8"
              >
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              <div>
                <p className="text-white/30 text-sm font-black uppercase tracking-wider">
                  Panier vide
                </p>
                <p className="text-white/15 text-xs mt-1.5 leading-relaxed">
                  Ajoutez des produits pour démarrer
                </p>
              </div>
              <button
                onClick={close}
                className="text-[#FF5C00] text-xs font-black uppercase tracking-widest border border-[#FF5C00]/30 px-5 py-3.5 min-h-[44px] hover:bg-[#FF5C00] hover:text-white transition-all duration-200"
              >
                Voir le catalogue
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 bg-[#0A0A0A] border border-white/5 p-3 hover:border-[#FF5C00]/20 transition-colors duration-200"
              >
                {/* Image */}
                <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden bg-[#1A1A1A]">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-black uppercase tracking-wide leading-tight">
                    {item.name}
                  </p>
                  <p className="text-[#FF5C00] text-sm font-black mt-1">
                    {item.price.toLocaleString('fr-FR')} €
                  </p>

                  <div className="flex items-center justify-between mt-2.5">
                    {/* Quantity control */}
                    <div className="flex items-center border border-white/10">
                      <button
                        onClick={() => updateQty(item.id, item.quantity - 1)}
                        className="w-11 h-11 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-colors text-base leading-none"
                        aria-label="Diminuer la quantité"
                      >
                        −
                      </button>
                      <span className="w-10 h-11 flex items-center justify-center text-white text-xs font-bold border-x border-white/10">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, item.quantity + 1)}
                        className="w-11 h-11 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-colors text-base leading-none"
                        aria-label="Augmenter la quantité"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => remove(item.id)}
                      className="min-h-[44px] px-2 flex items-center text-white/20 hover:text-red-400 transition-colors text-[10px] uppercase tracking-wider font-bold"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-white/5 px-6 pt-5 pb-5 flex-shrink-0 space-y-3" style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}>
            {/* Shipping */}
            <div className="flex justify-between text-xs">
              <span className="text-white/30 uppercase tracking-wider">Livraison</span>
              {shipping === 0 ? (
                <span className="text-emerald-400 font-bold">Offerte</span>
              ) : (
                <span className="text-white/50">{shipping.toFixed(2)} €</span>
              )}
            </div>

            {/* Progress to free shipping */}
            {shipping > 0 && (
              <div className="bg-[#0A0A0A] border border-white/5 px-3 py-2.5">
                <p className="text-white/25 text-[10px] uppercase tracking-wider mb-2">
                  Encore {(150 - total).toFixed(2)} € pour la livraison gratuite
                </p>
                <div className="h-0.5 bg-white/5 overflow-hidden">
                  <div
                    className="h-full bg-[#FF5C00] transition-all duration-500"
                    style={{ width: `${Math.min((total / 150) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Total */}
            <div className="flex justify-between items-baseline pt-2 border-t border-white/5">
              <span className="text-white/40 text-xs font-bold uppercase tracking-widest">Total</span>
              <span className="text-white text-2xl font-black">
                {grandTotal.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €
              </span>
            </div>

            {/* CTA */}
            <Link
              href="/checkout"
              onClick={close}
              className="flex items-center justify-center gap-2 w-full bg-[#FF5C00] hover:bg-white hover:text-[#0A0A0A] text-white font-black text-xs uppercase tracking-[0.15em] py-4 min-h-[52px] transition-all duration-300"
            >
              Passer commande
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
