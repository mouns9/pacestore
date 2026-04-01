import Hero from "@/components/Hero";
import CatalogueSection from "@/components/CatalogueSection";
import productsData from "@/data/products.json";

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

const products = productsData as Product[];

const STATS = [
  { value: "+1 200", label: "Coureurs équipés", sub: "depuis 2022" },
  { value: "4.9 / 5", label: "Note clients", sub: "sur 847 avis vérifiés" },
  { value: "48 h", label: "Livraison express", sub: "France & Europe" },
  { value: "60 j", label: "Retours offerts", sub: "sans condition" },
];

const FEATURES = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
      </svg>
    ),
    title: "Expertise technique",
    body: "Drop, stack, indice de pronation, restitution d'énergie. On analyse chaque donnée pour vous orienter vers le bon choix.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
      </svg>
    ),
    title: "Testés en conditions",
    body: "Nos produits sont validés sur piste, route et sentiers techniques avant d'intégrer le catalogue.",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    title: "Retours 60 jours",
    body: "Si la chaussure ne convient pas à votre foulée, on échange. Sans question.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ── 1. Hero ──────────────────────────────────────────────── */}
      <Hero />

      {/* ── 2. Ticker tape ───────────────────────────────────────── */}
      <div className="overflow-hidden border-y border-white/5 bg-[#FF5C00] py-3 select-none">
        <div className="ticker-track">
          {Array.from({ length: 2 }).map((_, outer) => (
            <span key={outer} className="flex items-center">
              {[
                "Trail technique",
                "Plaque carbone",
                "GPS haute précision",
                "Drop optimisé",
                "Stack maximaliste",
                "Vibram Megagrip",
                "ZoomX foam",
                "AMOLED multibandes",
              ].map((item, i) => (
                <span key={i} className="flex items-center">
                  <span className="text-white font-black text-xs uppercase tracking-[0.25em] px-8">
                    {item}
                  </span>
                  <span className="text-white/40 text-xs">✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ── 3. Stats section ─────────────────────────────────────── */}
      <section className="bg-[#111111] border-b border-white/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="fade-up">
            <p className="text-[#FF5C00] text-xs font-bold uppercase tracking-[0.3em] text-center mb-3">
              En chiffres
            </p>
            <h2 className="text-center text-3xl sm:text-4xl font-black uppercase tracking-tight text-white mb-14">
              La confiance des coureurs sérieux
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/5">
            {STATS.map((stat, i) => (
              <div key={i} className={`fade-up-d${(i + 1) as 1 | 2 | 3 | 4}`}>
                <div className="bg-[#111111] px-8 py-10 text-center hover:bg-[#1A1A1A] transition-colors duration-300 group">
                  <div
                    className="font-black text-white group-hover:text-[#FF5C00] transition-colors duration-300 mb-1"
                    style={{ fontSize: "clamp(32px, 5vw, 52px)", lineHeight: 1 }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-sm font-bold text-white/70 uppercase tracking-widest mt-2">{stat.label}</div>
                  <div className="text-xs text-white/25 mt-1">{stat.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Catalogue ─────────────────────────────────────────── */}
      <section id="catalogue" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">

        {/* Section header */}
        <div className="fade-up">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
            <div>
              <p className="text-[#FF5C00] text-xs font-bold uppercase tracking-[0.3em] mb-3">
                Sélection experte
              </p>
              <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tight leading-tight text-white">
                Catalogue
                <br />
                <span className="text-white/15">Printemps 2026</span>
              </h2>
            </div>
            <p className="text-white/35 text-sm max-w-sm leading-relaxed sm:text-right">
              Chaque référence est testée sur le terrain par notre équipe.
              Drop, stack, amorti, plaque — rien n&apos;est laissé au hasard.
            </p>
          </div>
        </div>

        <CatalogueSection products={products} />
      </section>

      {/* ── 5. Features strip ────────────────────────────────────── */}
      <section className="border-y border-white/5 bg-[#111111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-8">
            {FEATURES.map((item, i) => (
              <div key={item.title} className={i === 0 ? 'fade-up' : i === 1 ? 'fade-up-d1' : 'fade-up-d2'}>
                <div className="flex flex-col items-center sm:items-start gap-4 group">
                  <div className="text-[#FF5C00] group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-white font-black text-sm uppercase tracking-wider">
                    {item.title}
                  </h3>
                  <p className="text-white/35 text-sm leading-relaxed text-center sm:text-left">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Brand statement ───────────────────────────────────── */}
      <section className="py-32 px-4 text-center overflow-hidden relative">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle at center, #FF5C00 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div className="fade-up relative z-10 max-w-4xl mx-auto">
          <p className="text-[#FF5C00] text-xs font-bold uppercase tracking-[0.3em] mb-6">Notre philosophie</p>
          <blockquote
            className="font-black uppercase leading-[0.9] tracking-tight text-white mb-8"
            style={{ fontSize: "clamp(36px, 7vw, 72px)" }}
          >
            On ne vend pas des chaussures.
            <br />
            <span className="text-white/20">On équipe des performances.</span>
          </blockquote>
          <a
            href="#catalogue"
            className="inline-flex items-center gap-2 text-[#FF5C00] border border-[#FF5C00]/30 hover:bg-[#FF5C00] hover:text-white font-bold text-sm uppercase tracking-[0.2em] px-8 py-3.5 transition-all duration-300"
          >
            Explorer le catalogue
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </section>
    </>
  );
}
