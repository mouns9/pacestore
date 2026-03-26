'use client';
import { ReactNode } from 'react';
import { CartProvider } from '@/contexts/CartContext';
import CartSidebar from './CartSidebar';
import ChatWidget from './ChatWidget';

export default function LayoutClient({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      {children}
      <CartSidebar />
      <ChatWidget />
    </CartProvider>
  );
}
