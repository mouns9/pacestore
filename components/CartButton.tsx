'use client';
import { useCart } from '@/contexts/CartContext';

export default function CartButton() {
  const { count, open } = useCart();

  return (
    <button
      onClick={open}
      className="relative flex items-center gap-2 bg-[#FF5C00] hover:bg-white hover:text-[#0A0A0A] transition-all duration-300 text-white text-xs font-black uppercase tracking-[0.15em] px-4 py-2"
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
      Panier
      {count > 0 && (
        <span className="ml-0.5 bg-white text-[#FF5C00] group-hover:bg-[#0A0A0A] text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center leading-none">
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  );
}
