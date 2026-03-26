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

type Props = {
  product: Product;
};

const CATEGORY_COLORS: Record<string, string> = {
  Trail:       "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  Compétition: "bg-[#FF5C00]/10 text-[#FF5C00] border-[#FF5C00]/20",
  GPS:         "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

const CATEGORY_ICONS: Record<string, string> = {
  Trail:       "TR",
  Compétition: "RD",
  GPS:         "GPS",
};

export default function ProductCard({ product }: Props) {
  const categoryClass =
    CATEGORY_COLORS[product.category] ?? "bg-white/5 text-white/50 border-white/10";

  const specEntries = Object.entries(product.specs).slice(0, 3);

  return (
    <article className="group relative bg-[#111111] border border-white/5 overflow-hidden flex flex-col transition-all duration-500 hover:border-[#FF5C00]/50 hover:scale-[1.02] hover:shadow-[0_24px_60px_rgba(255,92,0,0.12)]">

      {/* Image area */}
      <div className="relative aspect-[4/3] bg-[#0D0D0D] overflow-hidden">

        {/* Category watermark */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white/[0.04] font-black uppercase select-none"
                style={{ fontSize: "clamp(60px, 8vw, 90px)", letterSpacing: "-0.04em" }}>
            {CATEGORY_ICONS[product.category] ?? product.category}
          </span>
        </div>

        {/* Orange hover wash */}
        <div className="absolute inset-0 bg-[#FF5C00]/0 group-hover:bg-[#FF5C00]/5 transition-colors duration-500" />

        {/* Bottom-of-image vignette */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#111111] to-transparent" />

        {/* Badge */}
        <div className="absolute top-4 left-4">
          <span className="bg-[#FF5C00] text-white text-[10px] font-black uppercase tracking-[0.15em] px-2.5 py-1">
            {product.badge}
          </span>
        </div>

        {/* Stock dot */}
        {product.inStock && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-[#0A0A0A]/80 px-2.5 py-1 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wide">En stock</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 gap-4">

        {/* Category pill + name */}
        <div>
          <span className={`inline-block text-[10px] font-bold uppercase tracking-widest border px-2 py-0.5 mb-2.5 ${categoryClass}`}>
            {product.category}
          </span>
          <h3 className="text-white font-black text-lg leading-tight tracking-tight group-hover:text-[#FF5C00] transition-colors duration-300">
            {product.name}
          </h3>
        </div>

        {/* Description */}
        <p className="text-white/40 text-sm leading-relaxed line-clamp-3 flex-1">
          {product.description}
        </p>

        {/* Specs */}
        {specEntries.length > 0 && (
          <ul className="grid grid-cols-3 gap-1.5">
            {specEntries.map(([key, value]) => (
              <li key={key} className="bg-[#0A0A0A] border border-white/5 px-2 py-2 text-center group-hover:border-[#FF5C00]/10 transition-colors duration-300">
                <div className="text-[#FF5C00] text-xs font-black truncate">{value}</div>
                <div className="text-white/25 text-[10px] uppercase tracking-wide mt-0.5 capitalize">{key}</div>
              </li>
            ))}
          </ul>
        )}

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          <span className="text-2xl font-black text-white">
            {product.price.toLocaleString("fr-FR")} €
          </span>
          <button className="bg-[#FF5C00] hover:bg-white hover:text-[#0A0A0A] active:scale-95 transition-all duration-300 text-white text-xs font-black uppercase tracking-[0.15em] px-5 py-2.5">
            Ajouter
          </button>
        </div>
      </div>
    </article>
  );
}
