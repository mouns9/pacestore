'use client';
import { createContext, useContext, useReducer, useEffect, useState, ReactNode } from 'react';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
};

type CartAction =
  | { type: 'ADD'; item: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE'; id: string }
  | { type: 'UPDATE_QTY'; id: string; quantity: number }
  | { type: 'CLEAR' }
  | { type: 'OPEN' }
  | { type: 'CLOSE' }
  | { type: 'HYDRATE'; items: CartItem[] };

type CartContextType = {
  items: CartItem[];
  isOpen: boolean;
  hydrated: boolean;
  add: (item: Omit<CartItem, 'quantity'>) => void;
  remove: (id: string) => void;
  updateQty: (id: string, quantity: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  total: number;
  count: number;
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find((i) => i.id === action.item.id);
      const items = existing
        ? state.items.map((i) =>
            i.id === action.item.id ? { ...i, quantity: i.quantity + 1 } : i
          )
        : [...state.items, { ...action.item, quantity: 1 }];
      return { ...state, items, isOpen: true };
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    case 'UPDATE_QTY':
      return {
        ...state,
        items: state.items
          .map((i) =>
            i.id === action.id ? { ...i, quantity: action.quantity } : i
          )
          .filter((i) => i.quantity > 0),
      };
    case 'CLEAR':
      return { ...state, items: [] };
    case 'OPEN':
      return { ...state, isOpen: true };
    case 'CLOSE':
      return { ...state, isOpen: false };
    case 'HYDRATE':
      return { ...state, items: action.items };
    default:
      return state;
  }
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('pacestore-cart');
      if (saved) dispatch({ type: 'HYDRATE', items: JSON.parse(saved) });
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem('pacestore-cart', JSON.stringify(state.items));
  }, [state.items, hydrated]);

  const total = state.items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const count = state.items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isOpen: state.isOpen,
        add: (item) => dispatch({ type: 'ADD', item }),
        remove: (id) => dispatch({ type: 'REMOVE', id }),
        updateQty: (id, quantity) => dispatch({ type: 'UPDATE_QTY', id, quantity }),
        clear: () => dispatch({ type: 'CLEAR' }),
        open: () => dispatch({ type: 'OPEN' }),
        close: () => dispatch({ type: 'CLOSE' }),
        total,
        count,
        hydrated,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
