export default function Hero() {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#0A0A0A]">

      {/* ── Background layers ─────────────────────────────────────── */}

      {/* Fine grid */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "linear-gradient(#FF5C00 1px, transparent 1px), linear-gradient(90deg, #FF5C00 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      {/* Diagonal hatching */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, #FF5C00 0px, #FF5C00 1px, transparent 0px, transparent 60px)",
        }}
      />

      {/* Central orange glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-[#FF5C00]/6 blur-[180px] pointer-events-none" />

      {/* Bottom-right accent orb */}
      <div className="absolute -bottom-20 right-0 w-[500px] h-[500px] rounded-full bg-[#FF5C00]/10 blur-[120px] pointer-events-none" />

      {/* Top-left cold shadow */}
      <div className="absolute -top-40 -left-20 w-[600px] h-[600px] rounded-full bg-white/2 blur-[140px] pointer-events-none" />

      {/* ── Content ───────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 sm:px-8 pb-28">

        {/* Season label */}
        <div className="hero-label inline-flex items-center gap-2 bg-[#FF5C00]/10 border border-[#FF5C00]/30 px-4 py-2 mb-10">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF5C00] animate-pulse" />
          <span className="text-[#FF5C00] text-xs font-bold uppercase tracking-[0.3em]">
            Nouvelle sélection printemps 2026
          </span>
        </div>

        {/* Main heading — 96 px bold */}
        <h1
          className="hero-title font-black uppercase leading-[0.88] tracking-[-0.02em] mb-8"
          style={{ fontSize: "clamp(52px, 9.5vw, 96px)" }}
        >
          <span className="text-white block">L&apos;équipement</span>
          <span className="text-[#FF5C00] block">qui fait</span>
          <span className="text-white block">la différence.</span>
        </h1>

        {/* Sub-heading — 24 px light */}
        <p
          className="hero-sub font-light text-white/50 leading-relaxed max-w-2xl mb-12"
          style={{ fontSize: "clamp(16px, 2.2vw, 24px)" }}
        >
          Trail technique, compétition route, GPS haute performance —
          chaque produit est testé par des coureurs qui maîtrisent drop,
          stack et plaque carbone.
        </p>

        {/* CTAs */}
        <div className="hero-cta flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#catalogue"
            className="group flex items-center gap-3 bg-[#FF5C00] hover:bg-white text-white hover:text-[#0A0A0A] font-black text-sm uppercase tracking-[0.2em] px-10 py-4 transition-all duration-300"
          >
            Voir le catalogue
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5"
              className="group-hover:translate-x-1 transition-transform duration-300"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
          <a
            href="/guide"
            className="flex items-center gap-2 border border-white/20 hover:border-[#FF5C00] text-white/60 hover:text-[#FF5C00] font-bold text-sm uppercase tracking-[0.2em] px-10 py-4 transition-all duration-300"
          >
            Guide de sélection
          </a>
        </div>
      </div>

      {/* ── Stats bar pinned to bottom ─────────────────────────────── */}
      <div className="hero-stats absolute bottom-0 left-0 right-0 border-t border-white/5 bg-[#0A0A0A]/70 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex items-center justify-center sm:justify-start gap-8 sm:gap-16">
            {[
              { value: "+1 200", label: "Coureurs équipés" },
              { value: "4.9 / 5", label: "Avis clients" },
              { value: "48 h",   label: "Livraison express" },
              { value: "60 j",   label: "Retours offerts" },
            ].map((stat, i) => (
              <div key={i} className={i >= 2 ? "hidden sm:block" : ""}>
                <div className="text-xl sm:text-2xl font-black text-white">{stat.value}</div>
                <div className="text-[10px] text-white/30 uppercase tracking-widest mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-24 right-8 hidden lg:flex flex-col items-center gap-3 select-none">
        <span className="text-[9px] text-white/20 uppercase tracking-[0.35em] [writing-mode:vertical-lr]">Scroll</span>
        <div className="w-px h-10 bg-gradient-to-b from-white/20 to-transparent" />
      </div>
    </section>
  );
}
