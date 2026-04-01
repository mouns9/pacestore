'use client';
import { useState } from 'react';
import ProductCard from './ProductCard';

type ProductSpec = {
  drop?: string;
  stack?: string;
  poids?: string;
  terrain?: string;
  autonomie?: string;
  ecran?: string;
  gps?: string;
  capteurs?: string;
};

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  badge: string;
  description: string;
  specs: ProductSpec;
  image: string;
  colors: string[];
  sizes: (number | string)[];
  inStock: boolean;
};

const FILTERS = ['Tout', 'Trail', 'Compétition', 'GPS'] as const;

export default function CatalogueSection({ products }: { products: Product[] }) {
  const [activeFilter, setActiveFilter] = useState<string>('Tout');

  const filtered =
    activeFilter === 'Tout'
      ? products
      : products.filter((p) => p.category === activeFilter);

  return (
    <>
      {/* Quick filters */}
      <div className="fade-up-d1">
        <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-2">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`flex-shrink-0 text-xs font-bold uppercase tracking-widest px-4 py-2 border transition-all duration-200 active:scale-95 ${
                filter === activeFilter
                  ? 'bg-[#FF5C00] border-[#FF5C00] text-white'
                  : 'border-white/10 text-white/40 hover:border-[#FF5C00]/50 hover:text-white/70'
              }`}
            >
              {filter}
            </button>
          ))}
          <div className="ml-auto flex-shrink-0 text-white/20 text-xs uppercase tracking-widest">
            {filtered.length} produit{filtered.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 fade-up-d2">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}
